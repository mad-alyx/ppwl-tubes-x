// apps/backend/src/controllers/user.controller.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserController = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            likes: { where: { userId } },
            _count: { select: { comments: true, likes: true } },
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, avatarUrl: true } },
            post: {
              select: {
                id: true,
                content: true,
                author: { select: { id: true, name: true, avatarUrl: true } },
              },
            },
            _count: { select: { likes: true } },
          },
        },
        likes: {
          orderBy: { createdAt: "desc" },
          include: {
            post: {
              include: {
                author: { select: { id: true, name: true, avatarUrl: true } },
                likes: { where: { userId } },
                _count: { select: { comments: true, likes: true } },
              },
            },
          },
        },
      },
    });

    if (!user) throw new Error("Pengguna tidak ditemukan");

    const postsWithLikes = user.posts.map((post) => {
      const { likes, ...rest } = post;
      return { ...rest, isLiked: likes.length > 0 };
    });

    const likedPosts = user.likes.map((like) => {
      const { likes, ...postRest } = like.post;
      return { ...postRest, isLiked: likes.length > 0 };
    });

    const { likes, ...userRest } = user;
    return { ...userRest, posts: postsWithLikes, likedPosts };
  },

  async updateProfile(userId: string, name: string, avatarUrl?: string, bannerUrl?: string, bio?: string, location?: string, website?: string) {
    if (!name.trim()) throw new Error("Nama tidak boleh kosong.");

    return await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatarUrl: avatarUrl || null,
        bannerUrl: bannerUrl || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
      },
    });
  },
};