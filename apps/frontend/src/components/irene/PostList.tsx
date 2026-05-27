import React from "react";
import { MessageCircle, Heart, Image as ImageIcon } from "lucide-react";

type Props = {
  posts: any[];
  loadPostDetailAndComments: (id: string) => void;
  setReplyingTo: (p: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post"|"comment") => Promise<void>;
  ItemMenu: any;
};

export default function PostList({ posts, loadPostDetailAndComments, setReplyingTo, handleLike, ItemMenu }: Props) {
  return (
    <div>
      {posts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">Belum ada postingan dari siapa pun di sini. Ayo jadilah yang pertama!</div>
      ) : posts.map((post) => (
        <div key={post.id} onClick={() => loadPostDetailAndComments(post.id)} className="p-4 border-b border-gray-800 hover:bg-white/5 transition cursor-pointer">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0" onClick={(e)=>{e.stopPropagation(); /* navigate to profile handled by parent */ }}>
              {post.author?.avatarUrl ? <img src={post.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{post.author?.name?.charAt(0) || "?"}</div>}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1"><span className="font-bold hover:underline">{post.author?.name}</span><span className="text-gray-500 text-sm">@{post.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></div>
                <ItemMenu item={post} type="post" />
              </div>
              {post.content && <p className="mt-1 text-[#E7E9EA] whitespace-pre-wrap">{post.content}</p>}
              {post.imageUrl && <img src={post.imageUrl} className="mt-3 rounded-2xl border border-gray-800 max-h-[500px] w-full object-cover" />}
              <div className="flex justify-between mt-3 text-gray-500 max-w-md pr-6">
                <button onClick={(e) => { e.stopPropagation(); setReplyingTo(post); }} className="flex items-center gap-2 group outline-none"><div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full transition-colors"><MessageCircle className="w-4 h-4" /></div><span className="text-xs group-hover:text-[#1D9BF0]">{post._count?.comments || 0}</span></button>
                <button onClick={(e) => handleLike(e, post.id, "post")} className={`flex items-center gap-2 group outline-none ${post.isLiked ? 'text-pink-500' : ''}`}><div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full transition-colors"><Heart className={`w-4 h-4 ${post.isLiked ? 'fill-pink-500' : ''}`} /></div><span className="text-xs group-hover:text-pink-500">{post._count?.likes || 0}</span></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
