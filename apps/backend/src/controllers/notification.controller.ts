// apps/backend/src/controllers/notification.controller.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const NotificationController = {
  // Mengambil semua notifikasi milik pengguna yang sedang login
  async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: {
        userId: userId, 
      },
      orderBy: {
        createdAt: "desc", 
      },
      include: {
        triggeredBy: { 
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        post: { 
          select: {
            id: true,
            content: true,
          },
        },
      },
    });
  },

  // Menandai semua notifikasi sebagai telah dibaca
  async markAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
};