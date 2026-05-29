import React, { useState } from "react";
import { ArrowLeft, MessageCircle, Heart, CalendarClock, MapPin, Globe } from "lucide-react";

type Tab = "posts" | "replies" | "likes";

type Props = {
  userProfile: any;
  switchView: (v: any) => void;
  setReplyingTo: (p: any) => void;
  handleLike: (e: React.MouseEvent, id: string, type?: "post" | "comment") => Promise<void>;
  ItemMenu: any;
  loadPostDetailAndComments: (id: string) => void;
  setIsProfileEditOpen: (v: boolean) => void;
};

export default function ProfileView({
  userProfile,
  switchView,
  setReplyingTo,
  handleLike,
  ItemMenu,
  loadPostDetailAndComments,
  setIsProfileEditOpen,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const getTabClass = (tab: Tab) => {
    const base = "flex-1 py-4 text-center font-bold relative hover:bg-white/5 transition cursor-pointer";
    return activeTab === tab ? base : base + " text-gray-500";
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800 p-4 flex items-center gap-6">
        <button onClick={() => switchView("home")} className="p-2 hover:bg-white/10 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold leading-tight">{userProfile.name}</h2>
          <p className="text-sm text-gray-500">{userProfile.posts?.length || 0} postingan</p>
        </div>
      </div>

      {/* Banner & Avatar */}
      <div className="relative pb-4 border-b border-gray-800">
        <div className="h-48 bg-gray-800 w-full overflow-hidden">
          {userProfile.bannerUrl && <img src={userProfile.bannerUrl} className="w-full h-full object-cover" />}
        </div>
        <div className="absolute top-32 left-4 w-32 h-32 bg-black rounded-full p-1">
          <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold">{userProfile.name.charAt(0)}</span>
            )}
          </div>
        </div>
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsProfileEditOpen(true)}
            className="border border-gray-600 font-bold py-1.5 px-4 rounded-full hover:bg-gray-900 transition"
          >
            Edit profil
          </button>
        </div>
        <div className="px-4 mt-2">
          <h1 className="text-2xl font-bold">{userProfile.name}</h1>
          <p className="text-gray-500">@{userProfile.name.replace(/\s+/g, "").toLowerCase()}</p>
          {userProfile.bio && <p className="mt-3 text-[15px] whitespace-pre-wrap">{userProfile.bio}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-[15px] text-gray-500">
            {userProfile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {userProfile.location}
              </span>
            )}
            {userProfile.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <a
                  href={userProfile.website.startsWith("http") ? userProfile.website : "https://" + userProfile.website}
                  className="text-[#1D9BF0] hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {userProfile.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarClock className="w-4 h-4" />
              Bergabung Mei 2026
            </span>
          </div>
          <p className="mt-4 flex gap-4 text-[15px]">
            <span className="text-gray-500 hover:underline cursor-pointer">
              <strong className="text-white">0</strong> Mengikuti
            </span>
            <span className="text-gray-500 hover:underline cursor-pointer">
              <strong className="text-white">0</strong> Pengikut
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <div className={getTabClass("posts")} onClick={() => setActiveTab("posts")}>
          Postingan
          {activeTab === "posts" && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full" />
          )}
        </div>
        <div className={getTabClass("replies")} onClick={() => setActiveTab("replies")}>
          Balasan
          {activeTab === "replies" && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full" />
          )}
        </div>
        <div className={getTabClass("likes")} onClick={() => setActiveTab("likes")}>
          Suka
          {activeTab === "likes" && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full" />
          )}
        </div>
      </div>

      {/* Tab: Postingan */}
      {activeTab === "posts" && (
        <div>
          {!userProfile.posts || userProfile.posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Anda belum membuat postingan apa pun.</div>
          ) : (
            userProfile.posts.map((post: any) => (
              <div
                key={post.id}
                onClick={() => loadPostDetailAndComments(post.id)}
                className="p-4 border-b border-gray-800 hover:bg-white/5 transition cursor-pointer flex gap-3"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                      {userProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-bold hover:underline">{userProfile.name}</span>
                      <span className="text-gray-500 text-sm">
                        @{userProfile.name.replace(/\s+/g, "").toLowerCase()}
                      </span>
                    </div>
                    <ItemMenu item={post} type="post" />
                  </div>
                  {post.content && <p className="mt-1 text-[#E7E9EA] whitespace-pre-wrap">{post.content}</p>}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      className="mt-3 rounded-2xl border border-gray-800 max-h-[500px] w-full object-cover"
                    />
                  )}
                  <div className="flex justify-between mt-3 text-gray-500 max-w-md pr-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); setReplyingTo(post); }}
                      className="flex items-center gap-2 group outline-none"
                    >
                      <div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span>{post._count?.comments || 0}</span>
                    </button>
                    <button
                      onClick={(e) => handleLike(e, post.id, "post")}
                      className={"flex items-center gap-2 group outline-none" + (post.isLiked ? " text-pink-500" : "")}
                    >
                      <div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full">
                        <Heart className={"w-4 h-4" + (post.isLiked ? " fill-pink-500" : "")} />
                      </div>
                      <span>{post._count?.likes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Balasan */}
      {activeTab === "replies" && (
        <div>
          {!userProfile.comments || userProfile.comments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Anda belum membuat balasan apa pun.</div>
          ) : (
            userProfile.comments.map((comment: any) => (
              <div
                key={comment.id}
                onClick={() => comment.post?.id && loadPostDetailAndComments(comment.post.id)}
                className="p-4 border-b border-gray-800 hover:bg-white/5 transition cursor-pointer"
              >
                {comment.post && (
                  <p className="text-gray-500 text-sm mb-2 pl-1">
                    Membalas postingan{" "}
                    <span className="text-[#1D9BF0]">
                      @{comment.post.author?.name?.replace(/\s+/g, "").toLowerCase()}
                    </span>
                  </p>
                )}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                    {userProfile.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold">
                        {userProfile.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold">{userProfile.name}</span>
                      <span className="text-gray-500 text-sm">
                        @{userProfile.name.replace(/\s+/g, "").toLowerCase()}
                      </span>
                    </div>
                    <p className="text-[#E7E9EA] whitespace-pre-wrap">{comment.content}</p>
                    {comment.imageUrl && (
                      <img
                        src={comment.imageUrl}
                        className="mt-3 rounded-2xl border border-gray-800 max-h-[400px] w-full object-cover"
                      />
                    )}
                    <div className="flex mt-3 text-gray-500 items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{comment._count?.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Suka */}
      {activeTab === "likes" && (
        <div>
          {!userProfile.likedPosts || userProfile.likedPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Anda belum menyukai postingan apa pun.</div>
          ) : (
            userProfile.likedPosts.map((post: any) => (
              <div
                key={post.id}
                onClick={() => loadPostDetailAndComments(post.id)}
                className="p-4 border-b border-gray-800 hover:bg-white/5 transition cursor-pointer flex gap-3"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                  {post.author?.avatarUrl ? (
                    <img src={post.author.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold bg-gray-600">
                      {post.author?.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold hover:underline">{post.author?.name}</span>
                    <span className="text-gray-500 text-sm">
                      @{post.author?.name?.replace(/\s+/g, "").toLowerCase()}
                    </span>
                  </div>
                  {post.content && <p className="text-[#E7E9EA] whitespace-pre-wrap">{post.content}</p>}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      className="mt-3 rounded-2xl border border-gray-800 max-h-[500px] w-full object-cover"
                    />
                  )}
                  <div className="flex justify-between mt-3 text-gray-500 max-w-md pr-6">
                    <button
                      onClick={(e) => { e.stopPropagation(); setReplyingTo(post); }}
                      className="flex items-center gap-2 group outline-none"
                    >
                      <div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span>{post._count?.comments || 0}</span>
                    </button>
                    <button
                      onClick={(e) => handleLike(e, post.id, "post")}
                      className={"flex items-center gap-2 group outline-none" + (post.isLiked ? " text-pink-500" : "")}
                    >
                      <div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full">
                        <Heart className={"w-4 h-4" + (post.isLiked ? " fill-pink-500" : "")} />
                      </div>
                      <span>{post._count?.likes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
