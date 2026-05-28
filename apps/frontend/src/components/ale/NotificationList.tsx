import React from "react";
import { MessageCircle, Heart } from "lucide-react";

type Props = {
  notifications: any[];
  loadPostDetailAndComments: (id: string) => void;
};

export default function NotificationList({ notifications, loadPostDetailAndComments }: Props) {
  return (
    <div className="divide-y divide-gray-800">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">Belum ada aktivitas baru.</div>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} onClick={() => { if(notif.postId) loadPostDetailAndComments(notif.postId); }} className="p-4 flex gap-4 hover:bg-white/5 transition cursor-pointer">
            <div className="text-2xl shrink-0">{notif.type.includes("LIKE") ? <Heart className="w-6 h-6 fill-pink-500 text-pink-500 mx-auto" /> : <MessageCircle className="w-6 h-6 text-[#1D9BF0] fill-[#1D9BF0] mx-auto" />}</div>
            <div className="flex-1">
              <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden mb-2">{notif.triggeredBy?.avatarUrl ? <img src={notif.triggeredBy.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{notif.triggeredBy?.name?.charAt(0)}</div>}</div>
              <p className="text-sm"><span className="font-bold">{notif.triggeredBy?.name || "Seseorang"}</span> {notif.type === "LIKE" ? "menyukai postingan Anda" : notif.type === "COMMENT_LIKE" ? "menyukai komentar Anda" : "membalas Anda"}</p>
              {notif.post?.content && <p className="text-gray-500 text-xs mt-1 bg-gray-900/50 p-2 rounded border border-gray-800 italic truncate">"{notif.post?.content}"</p>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
