import React from "react";
import { MessageCircle, Heart, ArrowLeft } from "lucide-react";

type Props = {
  selectedPostDetail: any;
  setReplyingTo: (p: any) => void;
  handleLike: (
    e: React.MouseEvent,
    id: string,
    type?: "post" | "comment",
  ) => Promise<void>;
  ItemMenu: any;
  switchView: (v: any) => void;
};

// Komponen untuk menampilkan detail dari sebuah postingan tunggal
export default function PostDetail({
  selectedPostDetail,
  setReplyingTo,
  handleLike,
  ItemMenu,
  switchView,
}: Props) {
  if (!selectedPostDetail) return null;
  return (
    <>
      <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800 p-4 flex items-center gap-6">
        <button
          onClick={() => switchView("home")}
          className="p-2 hover:bg-white/10 rounded-full transition"
          title="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Postingan</h2>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
              {selectedPostDetail.author?.avatarUrl ? (
                <img
                  src={selectedPostDetail.author.avatarUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-lg">
                  {selectedPostDetail.author?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold leading-tight">
                {selectedPostDetail.author?.name}
              </h3>
              <p className="text-gray-500 text-sm">
                @
                {selectedPostDetail.author?.name
                  ?.replace(/\s+/g, "")
                  .toLowerCase()}
              </p>
            </div>
          </div>
          <ItemMenu item={selectedPostDetail} type="post" />
        </div>
        {selectedPostDetail.content && (
          <p className="text-2xl text-[#E7E9EA] whitespace-pre-wrap leading-relaxed py-2">
            {selectedPostDetail.content}
          </p>
        )}
        {selectedPostDetail.imageUrl && (
          <img
            src={selectedPostDetail.imageUrl}
            className="mt-2 mb-2 rounded-2xl border border-gray-800 max-h-125 w-full object-cover"
          />
        )}
        <div className="border-y border-gray-800 py-3 my-3 text-sm text-gray-500 flex gap-6">
          <span>
            <strong className="text-white">
              {selectedPostDetail._count?.likes || 0}
            </strong>{" "}
            Suka
          </span>
          <span>
            <strong className="text-white">
              {selectedPostDetail._count?.comments || 0}
            </strong>{" "}
            Balasan
          </span>
        </div>
        <div className="flex justify-around text-gray-500 border-b border-gray-800 pb-2">
          <button
            onClick={() => setReplyingTo(selectedPostDetail)}
            className="p-2 hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] rounded-full transition"
            title="Balas"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => handleLike(e, selectedPostDetail.id, "post")}
            className={`p-2 hover:bg-pink-500/10 hover:text-pink-500 rounded-full transition ${selectedPostDetail.isLiked ? "text-pink-500" : ""}`}
            title={selectedPostDetail.isLiked ? "Batal Suka" : "Suka"}
          >
            <Heart
              className={`w-5 h-5 ${selectedPostDetail.isLiked ? "fill-pink-500" : ""}`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
