import React from "react";
import Composer from "../components/irene/Composer";
import PostList from "../components/irene/PostList";

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
  setPostImage: (v: string | null) => void;
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: (v: any) => void;
  EmojiDropdown: any;
  charCount: number;
  isSubmitting: boolean;
  MAX_CHARS: number;
  posts: any[];
  loadPostDetailAndComments: (id: string) => void;
  setReplyingTo: (p: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post"|"comment") => Promise<void>;
  ItemMenu: any;
};

export default function Beranda(props: Props) {
  return (
    <>
      <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800">
        <h2 className="text-xl font-bold p-4 pb-0">Beranda</h2>
        <div className="flex w-full mt-2">
           <div className="flex-1 py-3 text-center font-bold relative cursor-pointer hover:bg-white/5 transition">Untuk Anda<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full"></div></div>
           <div className="flex-1 py-3 text-center text-gray-500 font-bold opacity-50 hover:bg-white/5 transition cursor-pointer">Mengikuti</div>
        </div>
      </div>

      <Composer
        userData={props.userData}
        switchView={props.switchView}
        newPostContent={props.newPostContent}
        setNewPostContent={props.setNewPostContent}
        textareaRef={props.textareaRef}
        handlePostSubmit={props.handlePostSubmit}
        postImage={props.postImage}
        postImageInputRef={props.postImageInputRef}
        handleImageUpload={props.handleImageUpload}
        setPostImage={props.setPostImage}
        activeEmojiPicker={props.activeEmojiPicker}
        setActiveEmojiPicker={props.setActiveEmojiPicker}
        EmojiDropdown={props.EmojiDropdown}
        charCount={props.charCount}
        isSubmitting={props.isSubmitting}
        MAX_CHARS={props.MAX_CHARS}
      />

      <PostList
        posts={props.posts}
        loadPostDetailAndComments={props.loadPostDetailAndComments}
        setReplyingTo={props.setReplyingTo}
        handleLike={props.handleLike}
        ItemMenu={props.ItemMenu}
      />
    </>
  );
}
