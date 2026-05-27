// apps/backend/src/routes/post.route.ts

import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt"; 
import { PostController } from "../controllers/post.controller";

export const postRoutes = new Elysia({ prefix: "/posts" })
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
  .get("/", async ({ userId, set }) => {
    try {
      const data = await PostController.getPosts(userId!);
      return { status: "success", data };
    } catch (error: any) { set.status = 500; return { status: "error", message: error.message }; }
  })
  .post("/", async ({ userId, body, set }) => {
    try {
      const data = await PostController.createPost(userId!, body.content, body.imageUrl);
      return { status: "success", data };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  }, { body: t.Object({ content: t.String(), imageUrl: t.Optional(t.String()) }) })
  
  // Endpoint Edit dan Hapus Postingan
  .put("/:id", async ({ userId, params, body, set }) => {
    try {
      const data = await PostController.updatePost(params.id, userId!, body.content, body.imageUrl);
      return { status: "success", data };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  }, { body: t.Object({ content: t.String(), imageUrl: t.Optional(t.String()) }) })
  
  .delete("/:id", async ({ userId, params, set }) => {
    try {
      await PostController.deletePost(params.id, userId!);
      return { status: "success", message: "Postingan dihapus" };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  })

  // Interaksi Like
  .post("/:id/like", async ({ userId, params, set }) => {
    try {
      const result = await PostController.toggleLike(params.id, userId!);
      return { status: "success", ...result };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  })
  .post("/comments/:id/like", async ({ userId, params, set }) => {
    try {
      const result = await PostController.toggleCommentLike(params.id, userId!);
      return { status: "success", ...result };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  })

  // CRUD Komentar
  .post("/:id/comment", async ({ userId, params, body, set }) => {
    try {
      const data = await PostController.createComment(params.id, userId!, body.content, body.parentId, body.imageUrl);
      return { status: "success", data };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  }, { body: t.Object({ content: t.String(), parentId: t.Optional(t.String()), imageUrl: t.Optional(t.String()) }) })
  
  .put("/comments/:id", async ({ userId, params, body, set }) => {
    try {
      const data = await PostController.updateComment(params.id, userId!, body.content, body.imageUrl);
      return { status: "success", data };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  }, { body: t.Object({ content: t.String(), imageUrl: t.Optional(t.String()) }) })

  .delete("/comments/:id", async ({ userId, params, set }) => {
    try {
      await PostController.deleteComment(params.id, userId!);
      return { status: "success", message: "Komentar dihapus" };
    } catch (error: any) { set.status = 400; return { status: "error", message: error.message }; }
  });