// apps/frontend/src/components/ViewFormPostingan.tsx

import React from "react";
import { Image as ImageIcon, Smile, X } from "lucide-react";

const EMOJI_LIST = [
  '😀','😂','🤣','😊','😍','🥰','😘','💕','😁','😉','😎','😋','🤗','🤔','🤨','😐','😑','😶','🙄','😏',
  '😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑',
  '😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳',
  '🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐',
  '🤓','😈','👿','👻','💀','☠️','👽','👾','🤖','💩','❤️','🔥','✨','💯','👍','👎','✌️','🤞','🙏','👏','🙌'
];

const MAX_CHARS = 280;

export interface ViewFormPostinganProps {
  // Data
  userData: any;
  content: string;
  image: string | null;
  showEmojiPicker: boolean;
  isSubmitting: boolean;

  // Refs
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;

  // Handlers
  onAvatarClick?: () => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onEmojiSelect: (emoji: string) => void;
  onToggleEmojiPicker: () => void;
  onCloseEmojiPicker: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ViewFormPostingan({
  userData,
  content,
  image,
  showEmojiPicker,
  isSubmitting,
  textareaRef,
  imageInputRef,
  onAvatarClick,
  onContentChange,
  onImageUpload,
  onImageRemove,
  onEmojiSelect,
  onToggleEmojiPicker,
  onCloseEmojiPicker,
  onSubmit,
}: ViewFormPostinganProps) {
  const charCount = content.length;

  return (
    <div className="p-4 border-b border-gray-800 flex gap-3">
      {/* Avatar */}
      <div
        className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0 cursor-pointer"
        onClick={onAvatarClick}
      >
        {userData?.avatarUrl ? (
          <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold">
            {userData?.name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col flex-1 gap-3">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 pt-2 overflow-hidden"
          placeholder="Apa yang sedang terjadi?"
          rows={2}
          value={content}
          onChange={onContentChange}
        />

        {/* Preview Gambar */}
        {image && (
          <div className="relative w-fit">
            <img src={image} alt="Preview" className="rounded-2xl max-h-60 object-cover" />
            <button
              type="button"
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex justify-between items-center border-t border-gray-800 pt-3 relative">
          <div className="flex text-[#1D9BF0] -ml-2">
            {/* Upload Gambar */}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={onImageUpload}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={onToggleEmojiPicker}
                className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute top-12 left-0 z-50 bg-[#16181C] border border-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] p-3 w-[300px]">
                  <div className="flex justify-between items-center mb-2 px-1 border-b border-gray-800 pb-2">
                    <span className="text-sm font-bold text-gray-300">Pilih Emoji</span>
                    <button
                      type="button"
                      onClick={onCloseEmojiPicker}
                      className="text-gray-500 hover:text-white transition bg-gray-800 rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => onEmojiSelect(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl transition transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Counter & Tombol Submit */}
          <div className="flex items-center gap-3">
            <span className={`text-sm ${charCount > MAX_CHARS ? "text-red-500" : "text-gray-500"}`}>
              {charCount}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={(!content.trim() && !image) || isSubmitting || charCount > MAX_CHARS}
              className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition"
            >
              Posting
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}