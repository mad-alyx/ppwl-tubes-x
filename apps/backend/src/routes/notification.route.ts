// apps/backend/src/routes/notification.route.ts

import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { NotificationController } from "../controllers/notification.controller";

export const notificationRoutes = new Elysia({ prefix: "/notifications" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "default_secret",
    })
  )
  .derive(async ({ headers, jwt }) => {
    const authHeader = headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { userId: null };
    }
    const token = authHeader.split(" ")[1];
    const payload = await jwt.verify(token);
    return { userId: payload ? (payload.sub as string) : null };
  })
  .onBeforeHandle(({ userId, set }) => {
    if (!userId) {
      set.status = 401;
      return { status: "error", message: "Sesi kedaluwarsa." };
    }
  })
  
  // GET /api/notifications - Memuat data notifikasi
  .get("/", async ({ userId }) => {
    try {
      const data = await NotificationController.getNotifications(userId!);
      return { status: "success", data };
    } catch (error: any) {
      return { status: "error", message: error.message };
    }
  })
  
  // PUT /api/notifications/read - Menandai semua notifikasi sudah dibaca
  .put("/read", async ({ userId }) => {
    try {
      await NotificationController.markAsRead(userId!);
      return { status: "success", message: "Semua notifikasi telah ditandai dibaca." };
    } catch (error: any) {
      return { status: "error", message: error.message };
    }
  });