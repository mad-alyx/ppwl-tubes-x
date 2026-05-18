// apps/backend/src/controllers/post.controller.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PostController = {
  async getPosts(currentUserId: string) {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        likes: { where: { userId: currentUserId } },
        comments: {
          where: { parentId: null }, 
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            likes: { where: { userId: currentUserId } }, 
            _count: { select: { likes: true, replies: true } },
            replies: {
              include: { 
                author: { select: { id: true, name: true, avatarUrl: true } },
                likes: { where: { userId: currentUserId } }, 
                _count: { select: { likes: true } }
              },
              orderBy: { createdAt: "asc" }
            }
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { comments: true, likes: true } },
      },
    });

    // Menambahkan tipe eksplisit ": any" untuk meredam protes strict TypeScript
    return posts.map((post: any) => {
      const { likes, comments, ...rest } = post;
      return {
        ...rest,
        isLiked: likes?.length > 0,
        comments: comments?.map((c: any) => {
           const { likes: cLikes, replies, ...cRest } = c;
           return {
             ...cRest,
             isLiked: cLikes?.length > 0,
             replies: replies?.map((r: any) => {
               const { likes: rLikes, ...rRest } = r;
               return { ...rRest, isLiked: rLikes?.length > 0 };
             }) || []
           }
        }) || []
      };
    });
  },

  async createPost(userId: string, content: string, imageUrl?: string) {
    if (!content.trim() && !imageUrl) throw new Error("Postingan harus memiliki teks atau gambar.");
    const userPostCount = await prisma.post.count({ where: { authorId: userId } });
    if (userPostCount >= 2) throw new Error("Batas maksimal tercapai (2 Postingan).");

    return await prisma.post.create({
      data: { content, authorId: userId, imageUrl: imageUrl || null },
    });
  },

  async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Postingan tidak ditemukan.");
    if (post.authorId !== userId) throw new Error("Anda tidak berhak menghapus postingan ini.");
    
    return await prisma.post.delete({ where: { id: postId } });
  },

  async updatePost(postId: string, userId: string, content: string, imageUrl?: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Postingan tidak ditemukan.");
    if (post.authorId !== userId) throw new Error("Akses ditolak.");

    return await prisma.post.update({
      where: { id: postId },
      data: { content, imageUrl: imageUrl || null }
    });
  },

  async toggleLike(postId: string, userId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (!post) throw new Error("Postingan tidak ditemukan.");

    const existingLike = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
    if (existingLike) {
      await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
      return { liked: false, message: "Batal menyukai postingan." };
    }
    const newLike = await prisma.like.create({ data: { userId, postId } });

    if (post.authorId !== userId) {
      try {
        await prisma.notification.create({
          data: { type: "LIKE", userId: post.authorId, triggeredById: userId, postId: postId },
        });
      } catch (e) {}
    }
    return { liked: true, message: "Berhasil menyukai postingan.", data: newLike };
  },

  async toggleCommentLike(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true, postId: true } });
    if (!comment) throw new Error("Komentar tidak ditemukan.");

    const existingLike = await prisma.commentLike.findUnique({ where: { userId_commentId: { userId, commentId } } });
    if (existingLike) {
      await prisma.commentLike.delete({ where: { userId_commentId: { userId, commentId } } });
      return { liked: false };
    }
    
    await prisma.commentLike.create({ data: { userId, commentId } });

    if (comment.authorId !== userId) {
      try {
        await prisma.notification.create({
          data: { type: "COMMENT_LIKE", userId: comment.authorId, triggeredById: userId, postId: comment.postId },
        });
      } catch (e) {}
    }
    return { liked: true };
  },

  async createComment(postId: string, userId: string, content: string, parentId?: string, imageUrl?: string) {
    if (!content.trim() && !imageUrl) throw new Error("Balasan tidak boleh kosong.");
    const userCommentCount = await prisma.comment.count({ where: { authorId: userId } });
    if (userCommentCount >= 5) throw new Error("Batas maksimal tercapai (5 Komentar).");

    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (!post) throw new Error("Postingan induk tidak ditemukan.");

    const comment = await prisma.comment.create({
      data: { content, postId, authorId: userId, parentId: parentId || null, imageUrl: imageUrl || null },
    });

    if (post.authorId !== userId) {
      try {
        await prisma.notification.create({
          data: { type: "COMMENT", userId: post.authorId, triggeredById: userId, postId: postId },
        });
      } catch (e) {}
    }
    return comment;
  },

  async updateComment(commentId: string, userId: string, content: string, imageUrl?: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.authorId !== userId) throw new Error("Akses ditolak.");
    return await prisma.comment.update({ where: { id: commentId }, data: { content, imageUrl: imageUrl || null } });
  },

  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.authorId !== userId) throw new Error("Akses ditolak.");
    return await prisma.comment.delete({ where: { id: commentId } });
  }
};