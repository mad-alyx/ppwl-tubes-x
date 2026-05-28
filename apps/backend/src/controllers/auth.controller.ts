// apps/backend/src/controllers/auth.controller.ts

import { prisma } from "../db/setup";
import bcrypt from 'bcryptjs';

// Definisi antarmuka untuk respons token Google
interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

// Definisi antarmuka untuk respons profil pengguna Google
interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export const AuthController = {
  async register(body: any) {
    const { email, password, name } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email telah terdaftar di dalam sistem.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return {
      status: "success",
      message: "Registrasi pengguna berhasil diselesaikan.",
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  },

  async login(body: any, jwt: any) {
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error("Kredensial autentikasi tidak valid.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Kredensial autentikasi tidak valid.");
    }

    const token = await jwt.sign({ sub: user.id });

    return {
      status: "success",
      message: "Sesi autentikasi berhasil diterbitkan.",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    };
  },

  async handleGoogleCallback(code: string, jwt: any) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Konfigurasi Google OAuth belum diinisialisasi pada variabel lingkungan.");
    }

    // 1. Menukar Authorization Code dengan Access Token Google
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Gagal melakukan verifikasi token dengan Google Authorization Server.");
    }

    // Asersi tipe untuk memastikan TypeScript mengenali properti access_token
    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

    // 2. Mengekstraksi Profil Pengguna dari Google API
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error("Gagal mengekstraksi identitas pengguna dari sistem Google.");
    }

    // Asersi tipe untuk memastikan TypeScript mengenali properti profil pengguna
    const googleUser = (await userResponse.json()) as GoogleUserInfo;

    if (!googleUser.email) {
      throw new Error("Payload profil Google tidak memuat entitas email yang valid.");
    }

    // 3. Sinkronisasi Entitas Pengguna (Upsert Logic)
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    let isNewUser = false; // Penanda khusus pengguna baru

    if (!user) {
      isNewUser = true; // Tandai sebagai pendaftar baru
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
          googleId: googleUser.id,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email: googleUser.email },
        data: {
          googleId: googleUser.id,
          avatarUrl: user.avatarUrl || googleUser.picture,
        },
      });
    }

    // 4. Menerbitkan JWT internal sistem
    const token = await jwt.sign({ sub: user.id });

    // Kembalikan status isNewUser ke rute
    return { token, user, isNewUser };
  }

};