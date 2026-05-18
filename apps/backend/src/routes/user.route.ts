// apps/backend/src/routes/user.route.ts

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt"; 
import { UserController } from "../controllers/user.controller";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "default_secret" }))
  .derive(async ({ headers, jwt }) => {
    const authHeader = headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) return { userId: null };
    const token = authHeader.split(" ")[1];
    const payload = await jwt.verify(token);
    return { userId: payload ? (payload.sub as string || payload.id as string || payload.userId as string) : null };
  })
  .onBeforeHandle(({ userId, set }) => {
    if (!userId) { set.status = 401; return { status: "error", message: "Sesi tidak valid." }; }
  })
  .get("/profile", async ({ userId, set }) => {
    try {
      const data = await UserController.getProfile(userId!);
      return { status: "success", data };
    } catch (err: any) {
      set.status = 400; return { status: "error", message: err.message };
    }
  })
  .put("/profile", async ({ userId, body, set }) => {
    try {
      const data = await UserController.updateProfile(userId!, body.name, body.avatarUrl, body.bannerUrl, body.bio, body.location, body.website);
      return { status: "success", message: "Profil diperbarui.", data };
    } catch (err: any) {
      set.status = 400; return { status: "error", message: err.message };
    }
  }, { 
    body: t.Object({ 
      name: t.String(), 
      avatarUrl: t.Optional(t.String()),
      bannerUrl: t.Optional(t.String()),
      bio: t.Optional(t.String()),
      location: t.Optional(t.String()),
      website: t.Optional(t.String())
    }) 
  });