// src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Home, Search, Bell, Mail, User, LogOut } from "lucide-react";
import { AppProvider, useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import Beranda from "./pages/Beranda";
import Notifikasi from "./pages/Notifikasi";
import DetailPostingan from "./pages/DetailPostingan";
import EditProfile from "./pages/EditProfile";
import FormPostingan from "./pages/FormPostingan";
import ReplyModal from "./components/nay/ReplyModal";
import ComposeModal from "./components/irene/ComposeModal";
import EditProfileModal from "./components/nay/EditProfileModal";

// ─── Layout Utama ─────────────────────────────────────────────────────────────
const HomeLayout = () => {
  const {
    currentView, error, setError, userData,
    posts, selectedPostDetail, postComments, notifications, userProfile,
    replyingTo, replyContent, setReplyContent, replyImage, setReplyImage,
    replyImageInputRef, handleImageUpload, activeEmojiPicker, setActiveEmojiPicker,
    EmojiDropdown, isSubmitting, handleReplySubmit, setReplyingTo,
    isComposeOpen, setIsComposeOpen, composeContent, setComposeContent,
    composeImage, setComposeImage, composeImageInputRef, composeCharCount,
    MAX_CHARS, composeEditId, composeEditType, handlePostSubmit,
    composeTextareaRef, handleInputResize,
    isProfileEditOpen, setIsProfileEditOpen,
    editProfileName, setEditProfileName, editProfileBio, setEditProfileBio,
    editProfileLocation, setEditProfileLocation, editProfileWebsite, setEditProfileWebsite,
    editProfileImage, setEditProfileImage, editProfileBanner, setEditProfileBanner,
    newPostContent, setNewPostContent, postImage, setPostImage,
    textareaRef, postImageInputRef, charCount,
    loadPostDetailAndComments, handleLike, ItemMenu,
    handleProfileSave, switchView, handleLogout,
  } = useAppContext();

  const Xlogo = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <div
      className="min-h-screen bg-black text-white flex justify-center relative"
      onClick={() => setActiveEmojiPicker(null)}
    >
      {/* ── Modal Balasan ── */}
      <ReplyModal
        replyingTo={replyingTo}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        replyImage={replyImage}
        setReplyImage={setReplyImage}
        replyImageInputRef={replyImageInputRef}
        handleImageUpload={handleImageUpload}
        activeEmojiPicker={activeEmojiPicker}
        setActiveEmojiPicker={setActiveEmojiPicker}
        EmojiDropdown={EmojiDropdown}
        isSubmitting={isSubmitting}
        handleReplySubmit={handleReplySubmit}
        onClose={() => { setReplyingTo(null); setReplyContent(""); setReplyImage(null); setActiveEmojiPicker(null); }}
        userData={userData}
      />

      {/* ── Modal Compose / Edit ── */}
      <ComposeModal
        isComposeOpen={isComposeOpen}
        composeContent={composeContent}
        setComposeContent={setComposeContent}
        composeImage={composeImage}
        setComposeImage={setComposeImage}
        composeImageInputRef={composeImageInputRef}
        handleImageUpload={handleImageUpload}
        activeEmojiPicker={activeEmojiPicker}
        setActiveEmojiPicker={setActiveEmojiPicker}
        EmojiDropdown={EmojiDropdown}
        composeCharCount={composeCharCount}
        MAX_CHARS={MAX_CHARS}
        isSubmitting={isSubmitting}
        composeEditId={composeEditId}
        composeEditType={composeEditType}
        handlePostSubmit={handlePostSubmit}
        onClose={() => { setIsComposeOpen(false); setComposeContent(""); setComposeImage(null); setActiveEmojiPicker(null); }}
        userData={userData}
        composeTextareaRef={composeTextareaRef}
        handleInputResize={handleInputResize}
      />

      {/* ── Modal Edit Profil ── */}
      <EditProfileModal
        isProfileEditOpen={isProfileEditOpen}
        editProfileName={editProfileName}
        setEditProfileName={setEditProfileName}
        editProfileBio={editProfileBio}
        setEditProfileBio={setEditProfileBio}
        editProfileLocation={editProfileLocation}
        setEditProfileLocation={setEditProfileLocation}
        editProfileWebsite={editProfileWebsite}
        setEditProfileWebsite={setEditProfileWebsite}
        editProfileImage={editProfileImage}
        setEditProfileImage={setEditProfileImage}
        editProfileBanner={editProfileBanner}
        setEditProfileBanner={setEditProfileBanner}
        isSubmitting={isSubmitting}
        handleProfileSave={handleProfileSave}
        handleImageUpload={handleImageUpload}
        onClose={() => setIsProfileEditOpen(false)}
      />

      {/* ── Struktur 3 kolom ── */}
      <div className="w-full max-w-[1265px] flex justify-between">

        {/* Sidebar kiri */}
        <header className="w-[88px] xl:w-[275px] flex flex-col justify-between py-4 px-2 xl:px-4 h-screen sticky top-0">
          <div className="flex flex-col items-center xl:items-start gap-2">
            <div onClick={() => switchView("home")} className="p-3 w-max hover:bg-white/10 rounded-full cursor-pointer transition mb-2">
              <Xlogo />
            </div>
            <nav className="flex flex-col gap-1 w-full">
              <div onClick={() => switchView("home")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "home" || currentView === "detail" ? "font-bold" : ""}`}>
                <Home className="w-7 h-7" /><span className="hidden xl:inline text-xl">Beranda</span>
              </div>
              <div className="p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition opacity-50">
                <Search className="w-7 h-7" /><span className="hidden xl:inline text-xl">Jelajahi</span>
              </div>
              <div onClick={() => switchView("notifications")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "notifications" ? "font-bold" : ""}`}>
                <Bell className="w-7 h-7" /><span className="hidden xl:inline text-xl">Notifikasi</span>
              </div>
              <div className="p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition opacity-50">
                <Mail className="w-7 h-7" /><span className="hidden xl:inline text-xl">Pesan</span>
              </div>
              <div onClick={() => switchView("profile")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "profile" ? "font-bold" : ""}`}>
                <User className="w-7 h-7" /><span className="hidden xl:inline text-xl">Profil</span>
              </div>
            </nav>
            <button
              onClick={() => setIsComposeOpen(true)}
              className="mt-4 bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white font-bold w-12 h-12 xl:w-11/12 xl:h-14 rounded-full transition flex items-center justify-center shadow-[0_8px_24px_rgba(29,155,240,0.3)]"
            >
              <span className="hidden xl:inline text-lg">Posting</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white xl:hidden">
                <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.095C7.945 12.827 2 21.3 2 21.3c-1.125 1.574-.63 3.65.688 4.238 1.15.518 2.627-.1 3.52-1.3l8.6-11.455C18.667 9.208 21.5 5.5 23 3zm-20.5 13.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm11.5-9.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z" />
              </svg>
            </button>
          </div>
          <div onClick={handleLogout} className="flex items-center xl:justify-between p-3 rounded-full hover:bg-white/10 cursor-pointer transition mt-auto mb-4" title="Keluar">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                {userData?.avatarUrl
                  ? <img src={userData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>
                }
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="font-bold text-sm leading-tight">{userData?.name || "Pengguna"}</span>
                <span className="text-gray-500 text-sm leading-tight">@{userData?.name?.replace(/\s+/g, '').toLowerCase() || "user"}</span>
              </div>
            </div>
            <LogOut className="hidden xl:block w-5 h-5 text-gray-500" />
          </div>
        </header>

        {/* Konten tengah */}
        <main className="flex-1 max-w-[600px] border-x border-gray-800 min-h-screen relative">
          {error && (
            <div className="m-4 p-4 text-white bg-[#F4212E]/20 border border-[#F4212E]/40 rounded-xl relative animate-in fade-in duration-200">
              <div className="flex gap-2">
                <span className="font-bold text-[#F4212E]">Sistem:</span>
                <p className="text-[#E7E9EA]">{error}</p>
              </div>
              <button onClick={() => setError("")} className="absolute top-3 right-4 text-gray-500 hover:text-white transition">✕</button>
            </div>
          )}

          {currentView === "home" && (
            <Beranda
              userData={userData}
              switchView={switchView}
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              textareaRef={textareaRef}
              handlePostSubmit={handlePostSubmit}
              postImage={postImage}
              postImageInputRef={postImageInputRef}
              handleImageUpload={handleImageUpload}
              setPostImage={setPostImage}
              activeEmojiPicker={activeEmojiPicker}
              setActiveEmojiPicker={setActiveEmojiPicker}
              EmojiDropdown={EmojiDropdown}
              charCount={charCount}
              isSubmitting={isSubmitting}
              MAX_CHARS={MAX_CHARS}
              posts={posts}
              loadPostDetailAndComments={loadPostDetailAndComments}
              setReplyingTo={setReplyingTo}
              handleLike={handleLike}
              ItemMenu={ItemMenu}
            />
          )}
          {currentView === "notifications" && (
            <Notifikasi
              notifications={notifications}
              loadPostDetailAndComments={loadPostDetailAndComments}
            />
          )}
          {currentView === "profile" && (
            <EditProfile
              userProfile={userProfile}
              switchView={switchView}
              setReplyingTo={setReplyingTo}
              handleLike={handleLike}
              ItemMenu={ItemMenu}
              loadPostDetailAndComments={loadPostDetailAndComments}
              setIsProfileEditOpen={setIsProfileEditOpen}
            />
          )}
          {currentView === "form" && (
            <FormPostingan
              userData={userData}
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              textareaRef={textareaRef}
              handlePostSubmit={handlePostSubmit}
              postImage={postImage}
              postImageInputRef={postImageInputRef}
              handleImageUpload={handleImageUpload}
              setPostImage={setPostImage}
              activeEmojiPicker={activeEmojiPicker}
              setActiveEmojiPicker={setActiveEmojiPicker}
              EmojiDropdown={EmojiDropdown}
              charCount={charCount}
              isSubmitting={isSubmitting}
              MAX_CHARS={MAX_CHARS}
              switchView={switchView}
            />
          )}
          {currentView === "detail" && (
            <DetailPostingan
              selectedPostDetail={selectedPostDetail}
              postComments={postComments}
              setReplyingTo={setReplyingTo}
              handleLike={handleLike}
              ItemMenu={ItemMenu}
              switchView={switchView}
            />
          )}
        </main>

        {/* Sidebar kanan */}
        <aside className="hidden lg:block w-[350px] pl-8 py-4 sticky top-0 h-screen overflow-y-auto">
          <div className="relative group mb-4">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Cari" className="w-full bg-[#202327] outline-none text-white rounded-full py-3 pl-12 pr-4 focus:bg-black focus:ring-1 focus:ring-[#1D9BF0] transition" />
          </div>
          <div className="bg-[#16181C] rounded-2xl p-4 border border-gray-800">
            <h2 className="text-xl font-bold mb-2">Tren untuk Anda</h2>
            <p className="text-sm font-bold mt-3">#PemrogramanWebLanjut</p>
            <p className="text-xs text-gray-500">15.4 rb postingan</p>
          </div>
        </aside>

      </div>
    </div>
  );
};

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppProvider>
                <HomeLayout />
              </AppProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/auth/success"
          element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              {(() => {
                const params = new URLSearchParams(window.location.search);
                const token = params.get("token");
                const isNewUser = params.get("isNewUser");
                if (token) {
                  localStorage.setItem("jwt_token", token);
                  window.location.href = isNewUser === "true" ? (localStorage.setItem("needs_onboarding", "true"), "/login") : "/";
                }
                return <div>Memverifikasi sesi...</div>;
              })()}
            </div>
          }
        />

        <Route
          path="/auth/error"
          element={
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
              <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-lg text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-3xl font-bold">!</div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Otentikasi Gagal</h2>
                  <p className="text-[#71767B]">
                    {(() => { const p = new URLSearchParams(window.location.search); return p.get("message") || "Terjadi kesalahan yang tidak diketahui."; })()}
                  </p>
                </div>
                <Link to="/login" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition">
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}