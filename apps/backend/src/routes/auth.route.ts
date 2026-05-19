// apps/backend/src/routes/auth.route.ts

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthController } from "../controllers/auth.controller";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "rahasia_sistem_autentikasi_backend",
    })
  )
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        return await AuthController.register(body);
      } catch (error: any) {
        set.status = 400;
        return { status: "error", message: error.message };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      try {
        return await AuthController.login(body, jwt);
      } catch (error: any) {
        set.status = 401;
        return { status: "error", message: error.message };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  // --- BLOK OAUTH GOOGLE ---
  .get("/google", ({ redirect }) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    
    // Validasi eksistensi kredensial
    if (!clientId || clientId === "masukkan_client_id_google_disini") {
      return { status: "error", message: "Kredensial Google OAuth belum dikonfigurasi." };
    }

    const scope = "email profile";
const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&prompt=select_account`;    
    // Mengalihkan peramban klien ke server otorisasi Google
    return redirect(googleAuthUrl);
  })
  .get("/google/callback", async ({ query, jwt, set, redirect }) => {
    try {
      const code = query.code as string;
      if (!code) throw new Error("Authorization Code tidak ditemukan.");

      // Tangkap isNewUser dari controller
      const { token, isNewUser } = await AuthController.handleGoogleCallback(code, jwt);

      // Sisipkan isNewUser ke dalam parameter URL frontend
      return redirect(`http://localhost:5173/auth/success?token=${token}&isNewUser=${isNewUser}`);
      
    } catch (error: any) {
      set.status = 500;
      return redirect(`http://localhost:5173/auth/error?message=${encodeURIComponent(error.message)}`);
    }
  });