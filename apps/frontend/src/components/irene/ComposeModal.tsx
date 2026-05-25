import React from "react";
import { X, Image as ImageIcon, Smile } from "lucide-react";

type Props = {
  isComposeOpen: boolean;
  composeContent: string;
  setComposeContent: (v: string) => void;
  composeImage: string | null;
  setComposeImage: (v: string | null) => void;
  composeImageInputRef: React.RefObject<HTMLInputElement> | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: (v: any) => void;
  EmojiDropdown: any;
  composeCharCount: number;
  MAX_CHARS: number;
  isSubmitting: boolean;
  composeEditId: string | null;
  composeEditType: "post" | "comment" | null;
  handlePostSubmit: (e: React.FormEvent, isModal?: boolean) => Promise<void>;
  onClose: () => void;
  userData: any;
  composeTextareaRef: React.RefObject<HTMLTextAreaElement> | null;
  handleInputResize: (e: React.ChangeEvent<HTMLTextAreaElement>, ref: React.RefObject<HTMLTextAreaElement | null>, setter: any) => void;
};

export default function ComposeModal({
  isComposeOpen,
  composeContent,
  setComposeContent,
  composeImage,
  setComposeImage,
  composeImageInputRef,
  handleImageUpload,
  activeEmojiPicker,
  setActiveEmojiPicker,
  EmojiDropdown,
  composeCharCount,
  MAX_CHARS,
  isSubmitting,
  composeEditId,
  composeEditType,
  handlePostSubmit,
  onClose,
  userData,
  composeTextareaRef,
  handleInputResize
}: Props) {
  if (!isComposeOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16">
      <div className="bg-black w-full max-w-[600px] rounded-2xl flex flex-col relative border border-gray-800">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button>
            {composeEditId && <h2 className="font-bold text-lg">Edit {composeEditType === "post" ? "Postingan" : "Komentar"}</h2>}
          </div>
          <button onClick={(e) => handlePostSubmit(e, true)} disabled={(!composeContent.trim() && !composeImage) || isSubmitting || composeCharCount > MAX_CHARS} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">{composeEditId ? "Simpan" : "Posting"}</button>
        </div>
        <div className="p-4 flex gap-3 overflow-y-auto max-h-[80vh]">
           <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">{userData?.avatarUrl ? <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}</div>
          <div className="flex flex-col flex-1 gap-3 w-full">
            <textarea ref={composeTextareaRef} className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 pt-2" placeholder="Apa yang sedang terjadi?" rows={4} autoFocus value={composeContent} onChange={(e) => handleInputResize(e, composeTextareaRef, setComposeContent)} />
            {composeImage && (
              <div className="relative">
                <img src={composeImage} alt="Preview" className="rounded-2xl max-h-80 w-full object-cover" />
                <button type="button" onClick={() => setComposeImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"><X className="w-5 h-5"/></button>
              </div>
            )}
            <div className="flex justify-between items-center mt-1 border-t border-gray-800 pt-3 relative">
              <div className="flex text-[#1D9BF0] -ml-2">
                 <input type="file" accept="image/*" hidden ref={composeImageInputRef} onChange={(e) => handleImageUpload(e, setComposeImage)} />
                 <button type="button" onClick={() => composeImageInputRef?.current?.click()} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><ImageIcon className="w-5 h-5" /></button>
                 
                 <div className="relative">
                    <button type="button" onClick={() => setActiveEmojiPicker(activeEmojiPicker === "compose" ? null : "compose")} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><Smile className="w-5 h-5" /></button>
                    {activeEmojiPicker === "compose" && <EmojiDropdown target="compose" />}
                 </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className={composeCharCount > MAX_CHARS ? "text-red-500" : ""}>{composeCharCount}/{MAX_CHARS}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
