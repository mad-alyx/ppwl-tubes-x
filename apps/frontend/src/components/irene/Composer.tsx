import React from "react";
import { Image as ImageIcon, Smile, X } from "lucide-react";

type Props = {
  userData: any;
  switchView: (v: any) => void;
  newPostContent: string;
  setNewPostContent: (v: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null> | null;
  handlePostSubmit: (e: React.FormEvent, isModal?: boolean) => Promise<void>;
  postImage: string | null;
  postImageInputRef: React.RefObject<HTMLInputElement | null> | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  setPostImage: React.Dispatch<React.SetStateAction<string | null>>;
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: (v: any) => void;
  EmojiDropdown: any;
  charCount: number;
  isSubmitting: boolean;
  MAX_CHARS: number;
};

export default function Composer({
  userData,
  switchView,
  newPostContent,
  setNewPostContent,
  textareaRef,
  handlePostSubmit,
  postImage,
  postImageInputRef,
  handleImageUpload,
  setPostImage,
  activeEmojiPicker,
  setActiveEmojiPicker,
  EmojiDropdown,
  charCount,
  isSubmitting,
  MAX_CHARS,
}: Props) {
  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPostContent(e.target.value);
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="p-4 border-b border-gray-800 flex gap-3">
      <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0 cursor-pointer" onClick={() => switchView("profile")}>
        {userData?.avatarUrl ? <img src={userData.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}
      </div>
      <form onSubmit={(e) => handlePostSubmit(e, false)} className="flex flex-col flex-1 w-full">
        <div className="py-2"><textarea ref={textareaRef} className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 overflow-hidden" placeholder="Apa yang sedang terjadi?" rows={1} value={newPostContent} onChange={handleInputResize} /></div>
        {postImage && (
          <div className="relative mt-2 mb-2">
            <img src={postImage} className="rounded-2xl max-h-96 w-full object-cover border border-gray-800" />
            <button type="button" onClick={() => setPostImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"><X className="w-5 h-5"/></button>
          </div>
        )}
        <div className="flex justify-between items-center mt-1 relative">
          <div className="flex text-[#1D9BF0] -ml-2">
             <input type="file" accept="image/*" hidden ref={postImageInputRef} onChange={(e) => handleImageUpload(e, setPostImage)} />
             <button type="button" onClick={() => postImageInputRef?.current?.click()} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><ImageIcon className="w-5 h-5" /></button>
             
             <div className="relative">
               <button type="button" onClick={() => setActiveEmojiPicker(activeEmojiPicker === "post" ? null : "post")} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><Smile className="w-5 h-5" /></button>
               {activeEmojiPicker === "post" && <EmojiDropdown target="post" />}
             </div>
          </div>
          <button type="submit" disabled={(!newPostContent.trim() && !postImage) || isSubmitting || charCount > MAX_CHARS} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">Posting</button>
        </div>
      </form>
    </div>
  );
}
