import React from "react";
import { X, Image as ImageIcon, Smile } from "lucide-react";

type Props = {
  replyingTo: any;
  replyContent: string;
  setReplyContent: (v: string) => void;
  replyImage: string | null;
  setReplyImage: (v: string | null) => void;
  replyImageInputRef: React.RefObject<HTMLInputElement> | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: (v: any) => void;
  EmojiDropdown: any;
  isSubmitting: boolean;
  handleReplySubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  userData: any;
};

export default function ReplyModal({
  replyingTo,
  replyContent,
  setReplyContent,
  replyImage,
  setReplyImage,
  replyImageInputRef,
  handleImageUpload,
  activeEmojiPicker,
  setActiveEmojiPicker,
  EmojiDropdown,
  isSubmitting,
  handleReplySubmit,
  onClose,
  userData
}: Props) {
  if (!replyingTo) return null;

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16">
      <div className="bg-black w-full max-w-[600px] rounded-2xl flex flex-col relative border border-gray-800">
        <div className="flex items-center px-4 py-2 border-b border-gray-800"><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button></div>
        <div className="p-4 flex gap-3 relative max-h-[30vh] overflow-y-auto">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">{replyingTo.author?.avatarUrl ? <img src={replyingTo.author.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{replyingTo.author?.name?.charAt(0) || "?"}</div>}</div>
            <div className="w-0.5 bg-gray-700 h-full mt-2"></div>
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-1"><span className="font-bold">{replyingTo.author?.name}</span><span className="text-gray-500 text-sm">@{replyingTo.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></div>
            <p className="mt-1 text-[#E7E9EA] whitespace-pre-wrap">{replyingTo.content}</p>
            {replyingTo.imageUrl && <img src={replyingTo.imageUrl} alt="Ref" className="mt-2 rounded-xl max-h-40 object-cover" />}
          </div>
        </div>
        <div className="p-4 flex gap-3 pt-0">
           <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">{userData?.avatarUrl ? <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}</div>
          <form onSubmit={handleReplySubmit} className="flex flex-col flex-1 gap-3">
            <textarea className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 pt-2" placeholder="Posting balasan Anda" rows={3} autoFocus value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
            {replyImage && (
              <div className="relative w-fit">
                <img src={replyImage} alt="Preview" className="rounded-2xl max-h-60 object-cover" />
                <button type="button" onClick={() => setReplyImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"><X className="w-4 h-4"/></button>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-gray-800 pt-3 relative">
              <div className="flex text-[#1D9BF0]">
                 <input type="file" accept="image/*" hidden ref={replyImageInputRef} onChange={(e) => handleImageUpload(e, setReplyImage)} />
                 <button type="button" onClick={() => replyImageInputRef?.current?.click()} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><ImageIcon className="w-5 h-5" /></button>
                 
                 <div className="relative">
                   <button type="button" onClick={() => setActiveEmojiPicker(activeEmojiPicker === "reply" ? null : "reply")} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><Smile className="w-5 h-5" /></button>
                   {activeEmojiPicker === "reply" && <EmojiDropdown target="reply" />}
                 </div>
              </div>
              <button type="submit" disabled={(!replyContent.trim() && !replyImage) || isSubmitting} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">Balas</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
