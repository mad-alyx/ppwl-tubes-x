import React from "react";
import PostingForm from "../components/nayla/PostingForm";

type Props = {
  userData: any;
  newPostContent: string;
  setNewPostContent: (v: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement> | null;
  handlePostSubmit: (e: React.FormEvent, isModal?: boolean) => Promise<void>;
  postImage: string | null;
  postImageInputRef: React.RefObject<HTMLInputElement> | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  setPostImage: (v: string | null) => void;
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: (v: any) => void;
  EmojiDropdown: any;
  charCount: number;
  isSubmitting: boolean;
  MAX_CHARS: number;
  switchView: (v: any) => void;
};

export default function FormPostingan(props: Props) {
  return (
    <PostingForm
      userData={props.userData}
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
      switchView={props.switchView}
    />
  );
}
