// apps/frontend/src/pages/Timeline.tsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import { 
  Home, Search, Bell, User, LogOut, X, MoreHorizontal, Edit, Trash2
} from "lucide-react";
import Beranda from "./Beranda";
import Notifikasi from "./Notifikasi";
import DetailPostingan from "./DetailPostingan";
import EditProfile from "./EditProfile";
import FormPostingan from "./FormPostingan";
import ReplyModal from "../components/nay/ReplyModal";
import ComposeModal from "../components/irene/ComposeModal";
import EditProfileModal from "../components/nay/EditProfileModal";
import { useAuthStore } from "@/stores/useAuthStore";

type ViewMode = "home" | "notifications" | "detail" | "profile" | "form";

const EMOJI_LIST = [
  '😀','😂','🤣','😊','😍','🥰','😘','💕','😁','😉','😎','😋','🤗','🤔','🤨','😐','😑','😶','🙄','😏',
  '😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑',
  '😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳',
  '🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐',
  '🤓','😈','👿','👻','💀','☠️','👽','👾','🤖','💩','❤️','🔥','✨','💯','👍','👎','✌️','🤞','🙏','👏','🙌'
];

export default function Timeline() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const [currentView, setCurrentView] = useState<ViewMode>("home");
  const [selectedPostDetail, setSelectedPostDetail] = useState<any>(null);
  const [postComments, setPostComments] = useState<any[]>([]);

  const [posts, setPosts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState<any>(null); 
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const replyImageInputRef = useRef<HTMLInputElement>(null);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeContent, setComposeContent] = useState("");
  const [composeImage, setComposeImage] = useState<string | null>(null);
  const [composeEditId, setComposeEditId] = useState<string | null>(null);
  const [composeEditType, setComposeEditType] = useState<"post" | "comment" | null>(null);
  const composeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const composeImageInputRef = useRef<HTMLInputElement>(null);

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileBio, setEditProfileBio] = useState("");
  const [editProfileLocation, setEditProfileLocation] = useState("");
  const [editProfileWebsite, setEditProfileWebsite] = useState("");
  const [editProfileImage, setEditProfileImage] = useState<string | null>(null);
  const [editProfileBanner, setEditProfileBanner] = useState<string | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<"post" | "reply" | "compose" | null>(null);

  const [newPostContent, setNewPostContent] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const charCount = newPostContent.length;

  const loadTimeline = async () => {
    try {
      const response = await fetchApi("/posts");
      const fetchedPosts = response.data || [];
      setPosts(fetchedPosts);
      if (currentView === "detail" && selectedPostDetail) {
        const updatedTargetPost = fetchedPosts.find((p: any) => p.id === selectedPostDetail.id);
        if (updatedTargetPost) {
           setSelectedPostDetail(updatedTargetPost);
           setPostComments(updatedTargetPost.comments || []);
        }
      }
    } catch (err: any) { setError(err.message); }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetchApi("/notifications");
      setNotifications(response.data || []);
      await fetchApi("/notifications/read", { method: "PUT" });
    } catch (err: any) { console.error(err); }
  };

  const loadProfile = async () => {
    try {
      const res = await fetchApi("/users/profile");
      setUserProfile(res.data);
      setEditProfileName(res.data.name || "");
      setEditProfileBio(res.data.bio || "");
      setEditProfileLocation(res.data.location || "");
      setEditProfileWebsite(res.data.website || "");
      setEditProfileImage(res.data.avatarUrl || null);
      setEditProfileBanner(res.data.bannerUrl || null);
    } catch (err) { console.error(err); }
  };

  const loadPostDetailAndComments = (postId: string) => {
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost) {
      setSelectedPostDetail(targetPost);
      setPostComments(targetPost.comments || []); 
    }
    setCurrentView("detail");
    setError("");
  };

  useEffect(() => {
    loadTimeline();
    if (user) setUserData(user);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > MAX_SIZE) { h = h * MAX_SIZE / w; w = MAX_SIZE; }
          } else {
            if (h > MAX_SIZE) { w = w * MAX_SIZE / h; h = MAX_SIZE; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          setter(compressed);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (activeEmojiPicker === "reply") setReplyContent(prev => prev + emoji);
    else if (activeEmojiPicker === "compose") setComposeContent(prev => prev + emoji);
  };

  const MAX_CHARS = 280;
  const composeCharCount = composeContent.length;

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>, ref: React.RefObject<HTMLTextAreaElement | null>, setter: any) => {
    setter(e.target.value);
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

const handlePostSubmit = async (e: React.FormEvent, isModal: boolean = true) => {
  e.preventDefault();

  const content = isModal ? composeContent : newPostContent;
  const image = isModal ? composeImage : postImage;
  const charLen = isModal ? composeCharCount : charCount;

  if ((!content.trim() && !image) || isSubmitting || charLen > MAX_CHARS) return;
  setIsSubmitting(true);
  setError("");
  try {
    if (composeEditId && isModal) {
      const endpoint = composeEditType === "post" ? `/posts/${composeEditId}` : `/posts/comments/${composeEditId}`;
      await fetchApi(endpoint, { method: "PUT", body: JSON.stringify({ content, imageUrl: image || undefined }) });
    } else {
      await fetchApi("/posts", { method: "POST", body: JSON.stringify({ content, imageUrl: image || undefined }) });
    }
    if (isModal) {
      setComposeContent(""); setComposeImage(null);
      setIsComposeOpen(false); setComposeEditId(null); setComposeEditType(null);
    } else {
      setNewPostContent(""); setPostImage(null);
    }
  } catch (err: any) { setError(err.message); }
  finally {
    setActiveEmojiPicker(null);
    setIsSubmitting(false);
    loadTimeline();
    if (currentView === "profile") loadProfile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyContent.trim() && !replyImage) || isSubmitting || !replyingTo) return;
    setIsSubmitting(true);
    setError("");
    try {
      const payload: any = { content: replyContent };
      if (replyImage) payload.imageUrl = replyImage;
      if (replyingTo.postId) payload.parentId = replyingTo.id; 
      const targetPostId = replyingTo.postId ? replyingTo.postId : replyingTo.id;
      await fetchApi(`/posts/${targetPostId}/comment`, { method: "POST", body: JSON.stringify(payload) });
    } catch (err: any) { setError(err.message); } 
    finally {
      setReplyingTo(null); setReplyContent(""); setReplyImage(null); setIsSubmitting(false);
      setActiveEmojiPicker(null);
      loadTimeline();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string, type: "post" | "comment" = "post") => {
    e.stopPropagation(); 
    try {
      if (type === "post") {
        setPosts(currentPosts => currentPosts.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, _count: { ...p._count, likes: p.isLiked ? Math.max(0, p._count.likes - 1) : p._count.likes + 1 } } : p));
        if (currentView === "detail" && selectedPostDetail?.id === id) {
          setSelectedPostDetail((p: any) => ({ ...p, isLiked: !p.isLiked, _count: { ...p._count, likes: p.isLiked ? Math.max(0, p._count.likes - 1) : p._count.likes + 1 } }));
        }
        await fetchApi(`/posts/${id}/like`, { method: "POST" });
      } else {
        await fetchApi(`/posts/comments/${id}/like`, { method: "POST" });
      }
      loadTimeline();
    } catch (err) { loadTimeline(); }
  };

  const openEditModal = (item: any, type: "post" | "comment") => {
    setComposeContent(item.content);
    setComposeImage(item.imageUrl);
    setComposeEditId(item.id);
    setComposeEditType(type);
    setIsComposeOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string, type: "post" | "comment") => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    try {
      const endpoint = type === "post" ? `/posts/${id}` : `/posts/comments/${id}`;
      await fetchApi(endpoint, { method: "DELETE" });
      setOpenMenuId(null);
      if (type === "post" && currentView === "detail" && selectedPostDetail?.id === id) {
         switchView("home");
      } else {
         loadTimeline();
         if (currentView === "profile") loadProfile();
      }
    } catch (err: any) { alert(err.message); }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = { 
        name: editProfileName,
        bio: editProfileBio,
        location: editProfileLocation,
        website: editProfileWebsite
      };
      if (editProfileImage) payload.avatarUrl = editProfileImage;
      if (editProfileBanner) payload.bannerUrl = editProfileBanner;
      const res = await fetchApi("/users/profile", { method: "PUT", body: JSON.stringify(payload) });
      localStorage.setItem("user_data", JSON.stringify(res.data));
      setUserData(res.data);
      setIsProfileEditOpen(false);
      loadProfile();
      loadTimeline();
    } catch(err: any) { alert(err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const switchView = (view: ViewMode) => {
    setError(""); setCurrentView(view); setOpenMenuId(null); setActiveEmojiPicker(null);
    if (view === "home") loadTimeline();
    if (view === "notifications") loadNotifications();
    if (view === "profile") loadProfile();
  };

  const Xlogo = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>;

  const ItemMenu = ({ item, type }: { item: any, type: "post"|"comment" }) => {
    if (item.authorId !== userData?.id) return null;
    const isOpen = openMenuId === item.id;
    return (
      <div className="relative">
        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(isOpen ? null : item.id); }} className="text-gray-500 hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 p-1.5 rounded-full transition">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-8 bg-black border border-gray-700 rounded-xl shadow-lg shadow-white/10 z-20 w-36 overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); openEditModal(item, type); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-sm font-bold text-left"><Edit className="w-4 h-4"/> Edit</button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id, type); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-sm font-bold text-red-500 text-left"><Trash2 className="w-4 h-4"/> Hapus</button>
          </div>
        )}
      </div>
    );
  };

  const EmojiDropdown = ({ target }: { target: "post" | "reply" | "compose" }) => (
    <div className="absolute top-12 left-0 z-50 bg-[#16181C] border border-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] p-3 w-75">
      <div className="flex justify-between items-center mb-2 px-1 border-b border-gray-800 pb-2">
        <span className="text-sm font-bold text-gray-300">Pilih Emoji</span>
        <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-gray-500 hover:text-white transition bg-gray-800 rounded-full p-1"><X className="w-4 h-4"/></button>
      </div>
      <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto custom-scrollbar">
        {EMOJI_LIST.map(emoji => (
          <button type="button" key={emoji} onClick={() => handleEmojiSelect(emoji)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl transition transform hover:scale-125">{emoji}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex justify-center relative" onClick={() => { setOpenMenuId(null); }}>
      
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
        onClose={() => { setIsComposeOpen(false); setComposeContent(""); setComposeImage(null); setComposeEditId(null); setComposeEditType(null); setActiveEmojiPicker(null); }}
        userData={userData}
        composeTextareaRef={composeTextareaRef}
        handleInputResize={handleInputResize}
      />

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

      <div className="w-full max-w-316.25 flex justify-between">
        
        {/* SIDEBAR KIRI */}
        <header className="hidden sm:flex w-22 xl:w-68.75 flex-col justify-between py-4 px-2 xl:px-4 h-screen sticky top-0">
          <div className="flex flex-col items-center xl:items-start gap-2">
            <div onClick={() => switchView("home")} className="p-3 w-max hover:bg-white/10 rounded-full cursor-pointer transition mb-2"><Xlogo /></div>
            <nav className="flex flex-col gap-1 w-full">
              <div onClick={() => switchView("home")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "home" || currentView === "detail" ? "font-bold" : ""}`}><Home className="w-7 h-7" /><span className="hidden xl:inline text-xl">Beranda</span></div>
              <div onClick={() => switchView("notifications")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "notifications" ? "font-bold" : ""}`}><Bell className="w-7 h-7" /><span className="hidden xl:inline text-xl">Notifikasi</span></div>
              <div onClick={() => switchView("profile")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "profile" ? "font-bold" : ""}`}><User className="w-7 h-7" /><span className="hidden xl:inline text-xl">Profil</span></div>
            </nav>
            <button onClick={() => setIsComposeOpen(true)} className="mt-4 bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white font-bold w-12 h-12 xl:w-11/12 xl:h-14 rounded-full transition flex items-center justify-center shadow-[0_8px_24px_rgba(29,155,240,0.3)]">
              <span className="hidden xl:inline text-lg">Posting</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white xl:hidden"><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.095C7.945 12.827 2 21.3 2 21.3c-1.125 1.574-.63 3.65.688 4.238 1.15.518 2.627-.1 3.52-1.3l8.6-11.455C18.667 9.208 21.5 5.5 23 3zm-20.5 13.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm11.5-9.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z"></path></svg>
            </button>
          </div>

          {/* PROFILE + LOGOUT */}
          <div className="flex items-center justify-between p-3 rounded-full mt-auto mb-4">
            <div className="flex items-center gap-3">
              <img
                src={(user as any)?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=374151&color=fff`}
                alt={user?.name}
                className="w-10 h-10 rounded-full bg-gray-700 object-cover shrink-0"
              />
              <div className="hidden xl:flex flex-col">
                <span className="font-bold text-sm leading-tight">{user?.name || "Pengguna"}</span>
                <span className="text-gray-500 text-sm leading-tight">@{user?.name?.replace(/\s+/g, '').toLowerCase() || "user"}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 hidden xl:flex items-center justify-center transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-150 border-x border-gray-800 min-h-screen relative pb-16 sm:pb-0">
          {error && (
            <div className="m-4 p-4 text-white bg-[#F4212E]/20 border border-[#F4212E]/40 rounded-xl relative animate-in fade-in duration-200">
              <div className="flex gap-2"><span className="font-bold text-[#F4212E]">Sistem:</span><p className="text-[#E7E9EA]">{error}</p></div>
              <button onClick={() => setError("")} className="absolute top-3 right-4 text-gray-500 hover:text-white transition">✕</button>
            </div>
          )}

          {currentView === "detail" && selectedPostDetail && (
            <DetailPostingan
              selectedPostDetail={selectedPostDetail}
              postComments={postComments}
              setReplyingTo={setReplyingTo}
              handleLike={handleLike}
              ItemMenu={ItemMenu}
              switchView={switchView}
            />
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
            <Notifikasi notifications={notifications} loadPostDetailAndComments={loadPostDetailAndComments} />
          )}

          {currentView === "profile" && userProfile && (
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
        </main>

        <aside className="hidden lg:block w-87.5 pl-8 py-4 sticky top-0 h-screen overflow-y-auto">
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
        
        {/* BOTTOM NAV MOBILE */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-gray-800 flex justify-around items-center py-2 sm:hidden z-50">
          <div onClick={() => switchView("home")} className={`p-3 rounded-full hover:bg-white/10 cursor-pointer transition ${currentView === "home" || currentView === "detail" ? "text-white" : "text-gray-500"}`}>
            <Home className="w-6 h-6" />
          </div>
          <div onClick={() => switchView("notifications")} className={`p-3 rounded-full hover:bg-white/10 cursor-pointer transition ${currentView === "notifications" ? "text-white" : "text-gray-500"}`}>
            <Bell className="w-6 h-6" />
          </div>
          <button onClick={() => setIsComposeOpen(true)} className="bg-[#1D9BF0] hover:bg-[#1a8cd8] p-3 rounded-full transition">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white">
              <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.095C7.945 12.827 2 21.3 2 21.3c-1.125 1.574-.63 3.65.688 4.238 1.15.518 2.627-.1 3.52-1.3l8.6-11.455C18.667 9.208 21.5 5.5 23 3zm-20.5 13.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm11.5-9.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z"/>
            </svg>
          </button>
          <div onClick={() => switchView("profile")} className={`p-3 rounded-full hover:bg-white/10 cursor-pointer transition ${currentView === "profile" ? "text-white" : "text-gray-500"}`}>
            <User className="w-6 h-6" />
          </div>
        </nav>
      </div>
    </div>
  );
}