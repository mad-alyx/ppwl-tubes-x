// apps/frontend/src/pages/FormPostingan.tsx

import React, { useState, useRef } from "react";
import { fetchApi } from "../utils/api";
import ViewFormPostingan from "../components/nayla/ViewFormPostingan";

const MAX_CHARS = 280;

export default function FormPostingan() {
  // ── State ────────────────────────────────────────────────
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // userData diambil dari localStorage (sama seperti pola di Beranda)
  const [userData] = useState<any>(() => {
    const stored = localStorage.getItem("user_data");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed.name && parsed.displayName) parsed.name = parsed.displayName;
    return parsed;
  });

  // ── Refs ─────────────────────────────────────────────────
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ─────────────────────────────────────────────

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleCloseEmojiPicker = () => {
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const charCount = content.length;
    if ((!content.trim() && !image) || isSubmitting || charCount > MAX_CHARS) return;

    setIsSubmitting(true);
    setError("");

    try {
      await fetchApi("/posts", {
        method: "POST",
        body: JSON.stringify({
          content,
          imageUrl: image || undefined,
        }),
      });

      // Reset form setelah berhasil posting
      setContent("");
      setImage(null);
      setShowEmojiPicker(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-[#E7E9EA]">
      {/* Error Banner */}
      {error && (
        <div className="m-4 p-4 text-white bg-[#F4212E]/20 border border-[#F4212E]/40 rounded-xl relative">
          <div className="flex gap-2">
            <span className="font-bold text-[#F4212E]">Error:</span>
            <p className="text-[#E7E9EA]">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="absolute top-3 right-4 text-gray-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* View Component */}
      <ViewFormPostingan
        userData={userData}
        content={content}
        image={image}
        showEmojiPicker={showEmojiPicker}
        isSubmitting={isSubmitting}
        textareaRef={textareaRef}
        imageInputRef={imageInputRef}
        onContentChange={handleContentChange}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        onEmojiSelect={handleEmojiSelect}
        onToggleEmojiPicker={handleToggleEmojiPicker}
        onCloseEmojiPicker={handleCloseEmojiPicker}
        onSubmit={handleSubmit}
        onAvatarClick={() => {/* navigasi ke profil jika diperlukan */}}
      />
    </div>
  );
}