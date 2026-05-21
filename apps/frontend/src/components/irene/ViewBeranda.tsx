// apps/frontend/src/components/irene/HomeView.tsx

import React, { useRef } from "react";
import { Image as ImageIcon, Smile, X, MessageCircle, Heart } from "lucide-react";

const EMOJI_LIST = [
  '😀','😂','🤣','😊','😍','🥰','😘','💕','😁','😉','😎','😋','🤗','🤔','🤨','😐','😑','😶','🙄','😏',
  '😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑',
  '😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳',
  '🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐',
  '🤓','😈','👿','👻','💀','☠️','👽','👾','🤖','💩','❤️','🔥','✨','💯','👍','👎','✌️','🤞','🙏','👏','🙌'
];

interface HomeViewProps {
  posts: any[];
  userData: any;
  newPostContent: string;
  setNewPostContent: React.Dispatch<React.SetStateAction<string>>;
  postImage: string | null;
  setPostImage: React.Dispatch<React.SetStateAction<string | null>>;
  isSubmitting: boolean;
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: React.Dispatch<React.SetStateAction<"post" | "reply" | "compose" | null>>;
  handlePostSubmit: (e: React.FormEvent, isModal?: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  handleInputResize: (e: React.ChangeEvent<HTMLTextAreaElement>, ref: React.RefObject<HTMLTextAreaElement | null>, setter: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post" | "comment") => void;
  loadPostDetailAndComments: (postId: string) => void;
  switchView: (view: any) => void;
  setReplyingTo: React.Dispatch<React.SetStateAction<any>>;
  ItemMenu: React.FC<{ item: any; type: "post" | "comment" }>;
}

const MAX_CHARS = 280;
const circleRadius = 10;
const circleCircumference = 2 * Math.PI * circleRadius;

export default function HomeView({
  posts, userData, newPostContent, setNewPostContent,
  postImage, setPostImage, isSubmitting, activeEmojiPicker, setActiveEmojiPicker,
  handlePostSubmit, handleImageUpload, handleInputResize,
  handleLike, loadPostDetailAndComments, switchView, setReplyingTo, ItemMenu,
}: HomeViewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const charCount = newPostContent.length;

  const EmojiDropdown = () => (
    <div className="absolute top-12 left-0 z-50 bg-[#16181C] border border-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] p-3 w-[300px]">
      <div className="flex justify-between items-center mb-2 px-1 border-b border-gray-800 pb-2">
        <span className="text-sm font-bold text-gray-300">Pilih Emoji</span>
        <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-gray-500 hover:text-white transition bg-gray-800 rounded-full p-1"><X className="w-4 h-4"/></button>
      </div>
      <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
        {EMOJI_LIST.map(emoji => (
          <button type="button" key={emoji} onClick={() => setNewPostContent(prev => prev + emoji)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl transition transform hover:scale-125">{emoji}</button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800">
        <h2 className="text-xl font-bold p-4 pb-0">Beranda</h2>
        <div className="flex w-full mt-2">
          <div className="flex-1 py-3 text-center font-bold relative cursor-pointer hover:bg-white/5 transition">
            Untuk Anda
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full"></div>
          </div>
          <div className="flex-1 py-3 text-center text-gray-500 font-bold opacity-50 hover:bg-white/5 transition cursor-pointer">Mengikuti</div>
        </div>
      </div>

      {/* Form Buat Postingan */}
      <div className="p-4 border-b border-gray-800 flex gap-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0 cursor-pointer" onClick={() => switchView("profile")}>
          {userData?.avatarUrl ? <img src={userData.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}
        </div>
        <form onSubmit={(e) => handlePostSubmit(e, false)} className="flex flex-col flex-1 w-full">
          <div className="py-2">
            <textarea ref={textareaRef} className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 overflow-hidden" placeholder="Apa yang sedang terjadi?" rows={1} value={newPostContent} onChange={(e) => handleInputResize(e, textareaRef, setNewPostContent)} />
          </div>
          {postImage && (
            <div className="relative mt-2 mb-2">
              <img src={postImage} className="rounded-2xl max-h-96 w-full object-cover border border-gray-800" />
              <button type="button" onClick={() => setPostImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"><X className="w-5 h-5"/></button>
            </div>
          )}
          <div className="flex justify-between items-center mt-1 relative">
            <div className="flex text-[#1D9BF0] -ml-2">
              <input type="file" accept="image/*" hidden ref={postImageInputRef} onChange={(e) => handleImageUpload(e, setPostImage)} />
              <button type="button" onClick={() => postImageInputRef.current?.click()} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><ImageIcon className="w-5 h-5" /></button>
              <div className="relative">
                <button type="button" onClick={() => setActiveEmojiPicker(activeEmojiPicker === "post" ? null : "post")} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><Smile className="w-5 h-5" /></button>
                {activeEmojiPicker === "post" && <EmojiDropdown />}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <svg width="30" height="30" viewBox="0 0 30 30">
                  <circle cx="15" cy="15" r={circleRadius} fill="none" stroke="#2f3336" strokeWidth="2.5"/>
                  <circle cx="15" cy="15" r={circleRadius} fill="none"
                    stroke={charCount > MAX_CHARS ? "#F4212E" : charCount > MAX_CHARS * 0.8 ? "#FFD400" : "#1D9BF0"}
                    strokeWidth="2.5" strokeDasharray={circleCircumference}
                    strokeDashoffset={circleCircumference * (1 - Math.min(charCount / MAX_CHARS, 1))}
                    strokeLinecap="round" transform="rotate(-90 15 15)" style={{ transition: "stroke-dashoffset 0.1s" }}
                  />
                  {charCount > MAX_CHARS * 0.8 && (
                    <text x="15" y="19" textAnchor="middle" fontSize="8" fill={charCount > MAX_CHARS ? "#F4212E" : "#E7E9EA"}>{MAX_CHARS - charCount}</text>
                  )}
                </svg>
              )}
              <button type="submit" disabled={(!newPostContent.trim() && !postImage) || isSubmitting || charCount > MAX_CHARS} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">Posting</button>
            </div>
          </div>
        </form>
      </div>

      {/* Daftar Postingan */}
      <div>
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada postingan dari siapa pun di sini. Ayo jadilah yang pertama!</div>
        ) : posts.map((post) => (
          <div key={post.id} onClick={() => loadPostDetailAndComments(post.id)} className="p-4 border-b border-gray-800 hover:bg-white/5 transition cursor-pointer">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0" onClick={(e) => { e.stopPropagation(); switchView("profile"); }}>
                {post.author?.avatarUrl ? <img src={post.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{post.author?.name?.charAt(0) || "?"}</div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-bold hover:underline">{post.author?.name}</span>
                    <span className="text-gray-500 text-sm">@{post.author?.name?.replace(/\s+/g, '').toLowerCase()}</span>
                  </div>
                  <ItemMenu item={post} type="post" />
                </div>
                {post.content && <p className="mt-1 text-[#E7E9EA] whitespace-pre-wrap">{post.content}</p>}
                {post.imageUrl && <img src={post.imageUrl} className="mt-3 rounded-2xl border border-gray-800 max-h-[500px] w-full object-cover" />}
                <div className="flex justify-between mt-3 text-gray-500 max-w-md pr-6">
                  <button onClick={(e) => { e.stopPropagation(); setReplyingTo(post); }} className="flex items-center gap-2 group outline-none">
                    <div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full transition-colors"><MessageCircle className="w-4 h-4" /></div>
                    <span className="text-xs group-hover:text-[#1D9BF0]">{post._count?.comments || 0}</span>
                  </button>
                  <button onClick={(e) => handleLike(e, post.id, "post")} className={`flex items-center gap-2 group outline-none ${post.isLiked ? 'text-pink-500' : ''}`}>
                    <div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full transition-colors"><Heart className={`w-4 h-4 ${post.isLiked ? 'fill-pink-500' : ''}`} /></div>
                    <span className="text-xs group-hover:text-pink-500">{post._count?.likes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}