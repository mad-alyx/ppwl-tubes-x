// apps/backend/src/routes/interaction.route.ts

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { InteractionController } from "../controllers/interaction.controller";

export const interactionRoutes = new Elysia({ prefix: "/api/interactions" })
  .get("/posts/:postId/comments", async ({ params }) => {
    return await InteractionController.getPostComments(params.postId);
  })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "rahasia_sistem_autentikasi_backend",
    })
  )
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error("Token autentikasi tidak ditemukan.");
    }
    const token = authorization.split(' ')[1];
    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = 401;
      throw new Error("Sesi otorisasi tidak valid.");
    }
    return { userId: payload.sub as string };
  })
  .post("/posts/:postId/like", async ({ params, userId, set }) => {
    try {
      return await InteractionController.toggleLike(params.postId, userId);
    } catch (error: any) {
      set.status = 400;
      return { status: "error", message: error.message };
    }
  })
  .post("/posts/:postId/comments", async ({ params, body, userId, set }) => {
    try {
      return await InteractionController.createComment(body, params.postId, userId);
    } catch (error: any) {
      set.status = 403;
      return { status: "error", message: error.message };
    }
  }, {
    body: t.Object({
      content: t.String(),
      parentId: t.Optional(t.String())
    })
  })
  .delete("/comments/:commentId", async ({ params, userId, set }) => {
    try {
      return await InteractionController.deleteComment(params.commentId, userId);
    } catch (error: any) {
      set.status = 403;
      return { status: "error", message: error.message };
    }
  });