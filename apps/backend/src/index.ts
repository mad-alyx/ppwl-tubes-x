// apps/backend/src/index.ts

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth.route";
import { postRoutes } from "./routes/post.route";
import { notificationRoutes } from "./routes/notification.route";
import { userRoutes } from "./routes/user.route"; // BARU

const app = new Elysia()
  .use(cors())
  .use(authRoutes)
  .group("/api", (app) => app
    .use(postRoutes)
    .use(notificationRoutes)
    .use(userRoutes) // BARU didaftarkan
  )
  .listen(3000);

console.log(`🦊 Server Elysia beroperasi pada ${app.server?.hostname}:${app.server?.port}`);