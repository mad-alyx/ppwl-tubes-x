import React from "react";
import { MessageCircle, Heart } from "lucide-react";

type Props = {
  postComments: any[];
  setReplyingTo: (p: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post"|"comment") => Promise<void>;
  ItemMenu: any;
};

export default function CommentThread({ postComments, setReplyingTo, handleLike, ItemMenu }: Props) {
  return (
    <div className="divide-y divide-gray-800">
      {postComments.length === 0 ? <div className="p-8 text-center text-gray-500">Belum ada balasan untuk postingan ini.</div> : postComments.map((comment: any) => (
        <div key={comment.id} className="p-4 flex flex-col hover:bg-white/5 transition">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">{comment.author?.avatarUrl ? <img src={comment.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-sm">{comment.author?.name?.charAt(0) || "?"}</div>}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1"><span className="font-bold text-sm">{comment.author?.name}</span><span className="text-gray-500 text-sm">@{comment.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></div>
                <ItemMenu item={comment} type="comment" />
              </div>
              {comment.content && <p className="text-[#E7E9EA] mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>}
              {comment.imageUrl && <img src={comment.imageUrl} className="mt-2 rounded-xl border border-gray-800 max-h-60 object-cover" />}
              <div className="flex justify-start mt-2 gap-6">
                <button onClick={(e) => { e.stopPropagation(); setReplyingTo(comment); }} className="flex items-center gap-2 group outline-none text-gray-500"><div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full transition-colors"><MessageCircle className="w-4 h-4" /></div><span className="text-xs group-hover:text-[#1D9BF0]">{comment.replies?.length || 0}</span></button>
                <button onClick={(e) => handleLike(e, comment.id, "comment")} className={`flex items-center gap-2 group outline-none text-gray-500 ${comment.isLiked ? 'text-pink-500' : ''}`}><div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full transition-colors"><Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-pink-500' : ''}`} /></div><span className="text-xs group-hover:text-pink-500">{comment._count?.likes || 0}</span></button>
              </div>
            </div>
          </div>
          {comment.replies?.map((reply: any) => (
            <div key={reply.id} className="ml-10 mt-3 border-l-2 border-gray-800 pl-4 flex gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden shrink-0">{reply.author?.avatarUrl ? <img src={reply.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-xs">{reply.author?.name?.charAt(0) || "?"}</div>}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1"><span className="font-bold text-sm">{reply.author?.name}</span><span className="text-gray-500 text-xs">@{reply.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></div>
                  <ItemMenu item={reply} type="comment" />
                </div>
                <p className="text-gray-400 text-xs mb-1">Membalas <span className="text-[#1D9BF0]">@{comment.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></p>
                {reply.content && <p className="text-[#E7E9EA] text-sm whitespace-pre-wrap">{reply.content}</p>}
                {reply.imageUrl && <img src={reply.imageUrl} className="mt-2 rounded-xl border border-gray-800 max-h-40 object-cover" />}
                <div className="flex justify-start mt-1 gap-6">
                  <button onClick={(e) => handleLike(e, reply.id, "comment")} className={`flex items-center gap-2 group outline-none text-gray-500 ${reply.isLiked ? 'text-pink-500' : ''}`}><div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full transition-colors"><Heart className={`w-4 h-4 ${reply.isLiked ? 'fill-pink-500' : ''}`} /></div><span className="text-xs group-hover:text-pink-500">{reply._count?.likes || 0}</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
