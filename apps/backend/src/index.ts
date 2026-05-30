import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth.route";
import { postRoutes } from "./routes/post.route";
import { notificationRoutes } from "./routes/notification.route";
import { userRoutes } from "./routes/user.route";

const app = new Elysia()
  .use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }))
  .use(authRoutes)
  .group("/api", (app) => app
    .use(postRoutes)
    .use(notificationRoutes)
    .use(userRoutes)
  )
  .listen(3000);

console.log(`🦊 Server Elysia beroperasi pada ${app.server?.hostname}:${app.server?.port}`);