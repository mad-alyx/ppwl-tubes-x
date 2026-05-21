// apps/backend/src/controllers/interaction.controller.ts

import { prisma } from "../db/setup";

export const InteractionController = {
  async toggleLike(postId: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Entitas postingan tidak ditemukan.");

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { status: "success", message: "Like berhasil ditarik." };
    }

    await prisma.like.create({ data: { userId, postId } });

    if (post.authorId !== userId) {
      await prisma.notification.create({
        data: { userId: post.authorId, triggerId: userId, type: "LIKE", postId }
      });
    }

    return { status: "success", message: "Postingan berhasil disukai." };
  },

  async createComment(body: any, postId: string, userId: string) {
    const currentComments = await prisma.comment.count({ where: { authorId: userId } });
    if (currentComments >= 5) {
      throw new Error("Batas maksimal interaksi tercapai. Setiap pengguna hanya diizinkan membuat maksimal 5 komentar.");
    }

    const { content, parentId } = body;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Entitas postingan tidak ditemukan.");

    const comment = await prisma.comment.create({
      data: { content, postId, authorId: userId, parentId: parentId || null }
    });

    if (post.authorId !== userId && !parentId) {
      await prisma.notification.create({
        data: { userId: post.authorId, triggerId: userId, type: "COMMENT", postId }
      });
    } else if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.authorId !== userId) {
        await prisma.notification.create({
          data: { userId: parentComment.authorId, triggerId: userId, type: "REPLY", postId }
        });
      }
    }

    return { status: "success", data: comment };
  },

  async getPostComments(postId: string) {
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        replies: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { status: "success", data: comments };
  },

  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Komentar tidak ditemukan.");
    if (comment.authorId !== userId) throw new Error("Otorisasi mutasi ditolak.");

    await prisma.comment.delete({ where: { id: commentId } });
    return { status: "success", message: "Komentar berhasil dihapus." };
  }
};