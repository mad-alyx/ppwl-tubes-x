import React from "react";
import PostDetail from "../components/fahdil/PostDetail";
import CommentThread from "../components/fahdil/CommentThread";

type Props = {
  selectedPostDetail: any;
  postComments: any[];
  setReplyingTo: (p: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post"|"comment") => Promise<void>;
  ItemMenu: any;
  switchView: (v: any) => void;
};

export default function DetailPostingan({ selectedPostDetail, postComments, setReplyingTo, handleLike, ItemMenu, switchView }: Props) {
  return (
    <>
      <PostDetail selectedPostDetail={selectedPostDetail} setReplyingTo={setReplyingTo} handleLike={handleLike} ItemMenu={ItemMenu} switchView={switchView} />
      <CommentThread postComments={postComments} setReplyingTo={setReplyingTo} handleLike={handleLike} ItemMenu={ItemMenu} />
    </>
  );
}
