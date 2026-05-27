//Halaman utama untuk menampilkan detail postingan dan thread komentar

import React from "react";
import PostDetail from "../components/fahdil/PostDetail";
import CommentThread from "../components/fahdil/CommentThread";

type Props = {
  selectedPostDetail: any;
  postComments: any[];
  setReplyingTo: (p: any) => void;
  handleLike: (
    e: React.MouseEvent,
    id: string,
    type?: "post" | "comment",
  ) => Promise<void>;
  ItemMenu: any;
  switchView: (v: any) => void;
};

export default function DetailPostingan({
  selectedPostDetail,
  postComments,
  setReplyingTo,
  handleLike,
  ItemMenu,
  switchView,
}: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white border-x border-gray-800">
      {/* Komponen Detail Postingan Utama */}
      <PostDetail
        selectedPostDetail={selectedPostDetail}
        setReplyingTo={setReplyingTo}
        handleLike={handleLike}
        ItemMenu={ItemMenu}
        switchView={switchView}
      />

      {/* Komponen Daftar Balasan/Komentar */}
      <div className="flex-1">
        <CommentThread
          postComments={postComments}
          setReplyingTo={setReplyingTo}
          handleLike={handleLike}
          ItemMenu={ItemMenu}
        />
      </div>
    </div>
  );
}
