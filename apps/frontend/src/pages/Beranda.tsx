import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import {
  Home, Search, Bell, Mail, User, MessageCircle, Heart, LogOut,
  Image as ImageIcon, Smile, CalendarClock, MapPin, Globe,
  ArrowLeft, X, MoreHorizontal, Edit, Trash2, ChevronRight, Camera
} from "lucide-react";
import ViewBeranda from "../components/ViewBeranda";

type ViewMode = "home" | "notifications" | "detail" | "profile";

const EMOJI_LIST = [
  '😀','😂','🤣','😊','😍','🥰','😘','💕','😁','😉','😎','😋','🤗','🤔','🤨','😐','😑','😶','🙄','😏',
  '😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑',
  '😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳',
  '🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐',
  '🤓','😈','👿','👻','💀','☠️','👽','👾','🤖','💩','❤️','🔥','✨','💯','👍','👎','✌️','🤞','🙏','👏','🙌'
];

export default function Beranda() {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<ViewMode>("home");
  const [selectedPostDetail, setSelectedPostDetail] = useState<any>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPostContent, setNewPostContent] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);

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

  const MAX_CHARS = 280;
  const composeCharCount = composeContent.length;

  // ── Data Loaders ──────────────────────────────────────────

  const loadTimeline = async () => {
    try {
      const response = await fetchApi("/posts");
      const fetchedPosts = response.data || [];
      setPosts(fetchedPosts);
      if (currentView === "detail" && selectedPostDetail) {
        const updated = fetchedPosts.find((p: any) => p.id === selectedPostDetail.id);
        if (updated) { setSelectedPostDetail(updated); setPostComments(updated.comments || []); }
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
    const target = posts.find(p => p.id === postId);
    if (target) { setSelectedPostDetail(target); setPostComments(target.comments || []); }
    setCurrentView("detail");
    setError("");
  };

  useEffect(() => {
    loadTimeline();
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) setUserData(JSON.parse(storedUser));
  }, []);

  // ── Handlers ──────────────────────────────────────────────

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (activeEmojiPicker === "reply") setReplyContent(prev => prev + emoji);
    else if (activeEmojiPicker === "compose") setComposeContent(prev => prev + emoji);
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>, ref: React.RefObject<HTMLTextAreaElement | null>, setter: any) => {
    setter(e.target.value);
    if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = `${ref.current.scrollHeight}px`; }
  };

  const handlePostSubmit = async (e: React.FormEvent, isModal = false) => {
    e.preventDefault();
    const content = isModal ? composeContent : newPostContent;
    const imageUrl = isModal ? composeImage : postImage;
    const currentLimit = isModal ? composeCharCount : newPostContent.length;
    if ((!content.trim() && !imageUrl) || isSubmitting || currentLimit > MAX_CHARS) return;
    setIsSubmitting(true); setError("");
    try {
      if (composeEditId) {
        const endpoint = composeEditType === "post" ? `/posts/${composeEditId}` : `/posts/comments/${composeEditId}`;
        await fetchApi(endpoint, { method: "PUT", body: JSON.stringify({ content, imageUrl: imageUrl || undefined }) });
      } else {
        await fetchApi("/posts", { method: "POST", body: JSON.stringify({ content, imageUrl: imageUrl || undefined }) });
      }
      if (isModal) { setComposeContent(""); setComposeImage(null); setIsComposeOpen(false); setComposeEditId(null); setComposeEditType(null); }
      else { setNewPostContent(""); setPostImage(null); }
    } catch (err: any) { setError(err.message); }
    finally {
      if (isModal) { setIsComposeOpen(false); setComposeContent(""); setComposeImage(null); }
      setActiveEmojiPicker(null); setIsSubmitting(false);
      loadTimeline();
      if (currentView === "profile") loadProfile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyContent.trim() && !replyImage) || isSubmitting || !replyingTo) return;
    setIsSubmitting(true); setError("");
    try {
      const payload: any = { content: replyContent };
      if (replyImage) payload.imageUrl = replyImage;
      if (replyingTo.postId) payload.parentId = replyingTo.id;
      const targetPostId = replyingTo.postId ? replyingTo.postId : replyingTo.id;
      await fetchApi(`/posts/${targetPostId}/comment`, { method: "POST", body: JSON.stringify(payload) });
    } catch (err: any) { setError(err.message); }
    finally {
      setReplyingTo(null); setReplyContent(""); setReplyImage(null);
      setIsSubmitting(false); setActiveEmojiPicker(null);
      loadTimeline(); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string, type: "post" | "comment" = "post") => {
    e.stopPropagation();
    try {
      if (type === "post") {
        setPosts(cur => cur.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, _count: { ...p._count, likes: p.isLiked ? Math.max(0, p._count.likes - 1) : p._count.likes + 1 } } : p));
        if (currentView === "detail" && selectedPostDetail?.id === id)
          setSelectedPostDetail((p: any) => ({ ...p, isLiked: !p.isLiked, _count: { ...p._count, likes: p.isLiked ? Math.max(0, p._count.likes - 1) : p._count.likes + 1 } }));
        await fetchApi(`/posts/${id}/like`, { method: "POST" });
      } else {
        await fetchApi(`/posts/comments/${id}/like`, { method: "POST" });
      }
      loadTimeline();
    } catch { loadTimeline(); }
  };

  const openEditModal = (item: any, type: "post" | "comment") => {
    setComposeContent(item.content); setComposeImage(item.imageUrl);
    setComposeEditId(item.id); setComposeEditType(type);
    setIsComposeOpen(true); setOpenMenuId(null);
  };

  const handleDelete = async (id: string, type: "post" | "comment") => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    try {
      const endpoint = type === "post" ? `/posts/${id}` : `/posts/comments/${id}`;
      await fetchApi(endpoint, { method: "DELETE" });
      setOpenMenuId(null);
      if (type === "post" && currentView === "detail" && selectedPostDetail?.id === id) switchView("home");
      else { loadTimeline(); if (currentView === "profile") loadProfile(); }
    } catch (err: any) { alert(err.message); }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const payload: any = { name: editProfileName, bio: editProfileBio, location: editProfileLocation, website: editProfileWebsite };
      if (editProfileImage) payload.avatarUrl = editProfileImage;
      if (editProfileBanner) payload.bannerUrl = editProfileBanner;
      const res = await fetchApi("/users/profile", { method: "PUT", body: JSON.stringify(payload) });
      localStorage.setItem("user_data", JSON.stringify(res.data));
      setUserData(res.data); setIsProfileEditOpen(false);
      loadProfile(); loadTimeline();
    } catch (err: any) { alert(err.message); }
    finally { setIsSubmitting(false); }
  };

  const switchView = (view: ViewMode) => {
    setError(""); setCurrentView(view); setOpenMenuId(null); setActiveEmojiPicker(null);
    if (view === "home") loadTimeline();
    if (view === "notifications") loadNotifications();
    if (view === "profile") loadProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  // ── Sub-components ────────────────────────────────────────

  const XLogo = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 fill-white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const ItemMenu = ({ item, type }: { item: any; type: "post" | "comment" }) => {
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

  const EmojiDropdown = ({ target }: { target: "reply" | "compose" }) => (
    <div className="absolute top-12 left-0 z-50 bg-[#16181C] border border-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] p-3 w-[300px]">
      <div className="flex justify-between items-center mb-2 px-1 border-b border-gray-800 pb-2">
        <span className="text-sm font-bold text-gray-300">Pilih Emoji</span>
        <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-gray-500 hover:text-white transition bg-gray-800 rounded-full p-1"><X className="w-4 h-4"/></button>
      </div>
      <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
        {EMOJI_LIST.map(emoji => (
          <button type="button" key={emoji} onClick={() => handleEmojiSelect(emoji)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl transition transform hover:scale-125">{emoji}</button>
        ))}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white flex justify-center relative" onClick={() => setOpenMenuId(null)}>

      {/* Modal Balasan */}
      {replyingTo && (
        <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16">
          <div className="bg-black w-full max-w-[600px] rounded-2xl flex flex-col relative border border-gray-800">
            <div className="flex items-center px-4 py-2 border-b border-gray-800">
              <button onClick={() => { setReplyingTo(null); setReplyContent(""); setReplyImage(null); setActiveEmojiPicker(null); }} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 flex gap-3 relative max-h-[30vh] overflow-y-auto">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                  {replyingTo.author?.avatarUrl ? <img src={replyingTo.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{replyingTo.author?.name?.charAt(0) || "?"}</div>}
                </div>
                <div className="w-0.5 bg-gray-700 h-full mt-2"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-1">
                  <span className="font-bold">{replyingTo.author?.name}</span>
                  <span className="text-gray-500 text-sm">@{replyingTo.author?.name?.replace(/\s+/g, '').toLowerCase()}</span>
                </div>
                <p className="mt-1 text-[#E7E9EA] whitespace-pre-wrap">{replyingTo.content}</p>
                {replyingTo.imageUrl && <img src={replyingTo.imageUrl} className="mt-2 rounded-xl max-h-40 object-cover" />}
              </div>
            </div>
            <div className="p-4 flex gap-3 pt-0">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                {userData?.avatarUrl ? <img src={userData.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}
              </div>
              <form onSubmit={handleReplySubmit} className="flex flex-col flex-1 gap-3">
                <textarea className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 pt-2" placeholder="Posting balasan Anda" rows={3} autoFocus value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
                {replyImage && (
                  <div className="relative w-fit">
                    <img src={replyImage} className="rounded-2xl max-h-60 object-cover" />
                    <button type="button" onClick={() => setReplyImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"><X className="w-4 h-4"/></button>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-800 pt-3 relative">
                  <div className="flex text-[#1D9BF0]">
                    <input type="file" accept="image/*" hidden ref={replyImageInputRef} onChange={(e) => handleImageUpload(e, setReplyImage)} />
                    <button type="button" onClick={() => replyImageInputRef.current?.click()} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><ImageIcon className="w-5 h-5" /></button>
                    <div className="relative">
                      <button type="button" onClick={() => setActiveEmojiPicker(activeEmojiPicker === "reply" ? null : "reply")} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><Smile className="w-5 h-5" /></button>
                      {activeEmojiPicker === "reply" && <EmojiDropdown target="reply" />}
                    </div>
                  </div>
                  <button type="submit" disabled={(!replyContent.trim() && !replyImage) || isSubmitting} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">Balas</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Compose / Edit */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16">
          <div className="bg-black w-full max-w-[600px] rounded-2xl flex flex-col relative border border-gray-800">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <button onClick={() => { setIsComposeOpen(false); setComposeContent(""); setComposeImage(null); setComposeEditId(null); setComposeEditType(null); setActiveEmojiPicker(null); }} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button>
                {composeEditId && <h2 className="font-bold text-lg">Edit {composeEditType === "post" ? "Postingan" : "Komentar"}</h2>}
              </div>
              <button onClick={(e) => handlePostSubmit(e, true)} disabled={(!composeContent.trim() && !composeImage) || isSubmitting || composeCharCount > MAX_CHARS} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">{composeEditId ? "Simpan" : "Posting"}</button>
            </div>
            <div className="p-4 flex gap-3 overflow-y-auto max-h-[80vh]">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                {userData?.avatarUrl ? <img src={userData.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}
              </div>
              <div className="flex flex-col flex-1 gap-3 w-full">
                <textarea ref={composeTextareaRef} className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 pt-2" placeholder="Apa yang sedang terjadi?" rows={4} autoFocus value={composeContent} onChange={(e) => handleInputResize(e, composeTextareaRef, setComposeContent)} />
                {composeImage && (
                  <div className="relative">
                    <img src={composeImage} className="rounded-2xl max-h-80 w-full object-cover" />
                    <button type="button" onClick={() => setComposeImage(null)} className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black transition"><X className="w-5 h-5"/></button>
                  </div>
                )}
                <div className="flex justify-between items-center mt-1 border-t border-gray-800 pt-3 relative">
                  <div className="flex text-[#1D9BF0] -ml-2">
                    <input type="file" accept="image/*" hidden ref={composeImageInputRef} onChange={(e) => handleImageUpload(e, setComposeImage)} />
                    <button type="button" onClick={() => composeImageInputRef.current?.click()} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><ImageIcon className="w-5 h-5" /></button>
                    <div className="relative">
                      <button type="button" onClick={() => setActiveEmojiPicker(activeEmojiPicker === "compose" ? null : "compose")} className="p-2 hover:bg-[#1D9BF0]/10 rounded-full transition"><Smile className="w-5 h-5" /></button>
                      {activeEmojiPicker === "compose" && <EmojiDropdown target="compose" />}
                    </div>
                  </div>
                  <span className={`text-sm ${composeCharCount > MAX_CHARS ? "text-red-500" : "text-gray-500"}`}>{composeCharCount}/{MAX_CHARS}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Profil */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black w-full max-w-[600px] h-[90vh] sm:h-[80vh] rounded-2xl flex flex-col relative border border-gray-800 overflow-hidden">
            <form onSubmit={handleProfileSave} className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/90 backdrop-blur z-10 sticky top-0">
                <div className="flex items-center gap-6">
                  <button type="button" onClick={() => setIsProfileEditOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button>
                  <h2 className="font-bold text-xl">Edit profile</h2>
                </div>
                <button type="submit" disabled={isSubmitting} className="bg-white text-black font-bold py-1.5 px-4 rounded-full hover:bg-gray-200 transition disabled:opacity-50">Save</button>
              </div>
              <div className="overflow-y-auto flex-1 pb-8">
                <div className="relative">
                  <div className="h-32 sm:h-48 bg-gray-800 w-full relative flex items-center justify-center group overflow-hidden">
                    {editProfileBanner && <img src={editProfileBanner} className="w-full h-full object-cover" />}
                    <label className="absolute flex items-center justify-center w-11 h-11 bg-black/50 hover:bg-black/40 rounded-full cursor-pointer transition">
                      <Camera className="w-5 h-5 text-white" />
                      <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, setEditProfileBanner)} />
                    </label>
                  </div>
                  <div className="absolute -bottom-12 left-4 w-28 h-28 bg-black rounded-full p-1 group">
                    <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden relative flex items-center justify-center cursor-pointer">
                      {editProfileImage ? <img src={editProfileImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition" /> : <span className="text-4xl text-gray-400">{editProfileName.charAt(0)}</span>}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        <Camera className="w-6 h-6 text-white"/>
                        <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e, setEditProfileImage)} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-16 px-4 space-y-6">
                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Name</label>
                    <input type="text" value={editProfileName} onChange={(e) => setEditProfileName(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3" required maxLength={50}/>
                  </div>
                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Bio</label>
                    <textarea value={editProfileBio} onChange={(e) => setEditProfileBio(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3 resize-none" rows={3} maxLength={160}/>
                  </div>
                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Location</label>
                    <input type="text" value={editProfileLocation} onChange={(e) => setEditProfileLocation(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3" maxLength={30}/>
                  </div>
                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Website</label>
                    <input type="text" value={editProfileWebsite} onChange={(e) => setEditProfileWebsite(e.target.value)} className="w-full bg-transparent outline-none text-base pt-6 pb-2 px-3" maxLength={100}/>
                  </div>
                  <div className="pt-2 pb-1 cursor-pointer hover:bg-white/5 transition flex items-center justify-between group">
                    <div>
                      <p className="text-gray-500 text-[15px]">Birth date</p>
                      <p className="text-[#E7E9EA] text-lg group-hover:text-[#1D9BF0] transition">May 5, 2006</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="py-3 cursor-pointer hover:bg-white/5 transition flex items-center justify-between group">
                    <p className="text-[#E7E9EA] text-lg font-bold group-hover:text-white transition">Switch to professional</p>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Layout Utama */}
      <div className="w-full max-w-[1265px] flex justify-between">

        {/* Sidebar Kiri */}
        <header className="w-[88px] xl:w-[275px] flex flex-col justify-between py-4 px-2 xl:px-4 h-screen sticky top-0">
          <div className="flex flex-col items-center xl:items-start gap-2">
            <div onClick={() => switchView("home")} className="p-3 w-max hover:bg-white/10 rounded-full cursor-pointer transition mb-2"><XLogo /></div>
            <nav className="flex flex-col gap-1 w-full">
              <div onClick={() => switchView("home")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "home" || currentView === "detail" ? "font-bold" : ""}`}><Home className="w-7 h-7" /><span className="hidden xl:inline text-xl">Beranda</span></div>
              <div className="p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition opacity-50"><Search className="w-7 h-7" /><span className="hidden xl:inline text-xl">Jelajahi</span></div>
              <div onClick={() => switchView("notifications")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "notifications" ? "font-bold" : ""}`}><Bell className="w-7 h-7" /><span className="hidden xl:inline text-xl">Notifikasi</span></div>
              <div className="p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition opacity-50"><Mail className="w-7 h-7" /><span className="hidden xl:inline text-xl">Pesan</span></div>
              <div onClick={() => switchView("profile")} className={`p-3 w-max xl:w-fit flex items-center gap-5 hover:bg-white/10 rounded-full cursor-pointer transition ${currentView === "profile" ? "font-bold" : ""}`}><User className="w-7 h-7" /><span className="hidden xl:inline text-xl">Profil</span></div>
            </nav>
            <button onClick={() => setIsComposeOpen(true)} className="mt-4 bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white font-bold w-12 h-12 xl:w-11/12 xl:h-14 rounded-full transition flex items-center justify-center shadow-[0_8px_24px_rgba(29,155,240,0.3)]">
              <span className="hidden xl:inline text-lg">Posting</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-white xl:hidden"><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.095C7.945 12.827 2 21.3 2 21.3c-1.125 1.574-.63 3.65.688 4.238 1.15.518 2.627-.1 3.52-1.3l8.6-11.455C18.667 9.208 21.5 5.5 23 3zm-20.5 13.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm11.5-9.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5z"></path></svg>
            </button>
          </div>
          <div onClick={handleLogout} className="flex items-center xl:justify-between p-3 rounded-full hover:bg-white/10 cursor-pointer transition mt-auto mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">
                {userData?.avatarUrl ? <img src={userData.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="font-bold text-sm leading-tight">{userData?.name || "Pengguna"}</span>
                <span className="text-gray-500 text-sm leading-tight">@{userData?.name?.replace(/\s+/g, '').toLowerCase() || "user"}</span>
              </div>
            </div>
            <LogOut className="hidden xl:block w-5 h-5 text-gray-500" />
          </div>
        </header>

        {/* Konten Tengah */}
        <main className="flex-1 max-w-[600px] border-x border-gray-800 min-h-screen relative">
          {error && (
            <div className="m-4 p-4 text-white bg-[#F4212E]/20 border border-[#F4212E]/40 rounded-xl relative animate-in fade-in duration-200">
              <div className="flex gap-2"><span className="font-bold text-[#F4212E]">Sistem:</span><p className="text-[#E7E9EA]">{error}</p></div>
              <button onClick={() => setError("")} className="absolute top-3 right-4 text-gray-500 hover:text-white transition">✕</button>
            </div>
          )}

          {/* View: Profil */}
          {currentView === "profile" && userProfile && (
            <>
              <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800 p-4 flex items-center gap-6">
                <button onClick={() => switchView("home")} className="p-2 hover:bg-white/10 rounded-full transition"><ArrowLeft className="w-5 h-5" /></button>
                <div><h2 className="text-xl font-bold leading-tight">{userProfile.name}</h2><p className="text-sm text-gray-500">{userProfile.posts?.length || 0} postingan</p></div>
              </div>
              <div className="relative pb-4 border-b border-gray-800">
                <div className="h-48 bg-gray-800 w-full overflow-hidden">{userProfile.bannerUrl && <img src={userProfile.bannerUrl} className="w-full h-full object-cover" />}</div>
                <div className="absolute top-32 left-4 w-32 h-32 bg-black rounded-full p-1">
                  <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                    {userProfile.avatarUrl ? <img src={userProfile.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold">{userProfile.name.charAt(0)}</span>}
                  </div>
                </div>
                <div className="flex justify-end p-4">
                  <button onClick={() => setIsProfileEditOpen(true)} className="border border-gray-600 font-bold py-1.5 px-4 rounded-full hover:bg-gray-900 transition">Edit profil</button>
                </div>
                <div className="px-4 mt-2">
                  <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                  <p className="text-gray-500">@{userProfile.name.replace(/\s+/g, '').toLowerCase()}</p>
                  {userProfile.bio && <p className="mt-3 text-[15px] whitespace-pre-wrap">{userProfile.bio}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-[15px] text-gray-500">
                    {userProfile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/>{userProfile.location}</span>}
                    {userProfile.website && <span className="flex items-center gap-1"><Globe className="w-4 h-4"/><a href={userProfile.website.startsWith('http') ? userProfile.website : `https://${userProfile.website}`} className="text-[#1D9BF0] hover:underline" target="_blank" rel="noreferrer">{userProfile.website.replace(/(^\w+:|^)\/\//, '')}</a></span>}
                    <span className="flex items-center gap-1"><CalendarClock className="w-4 h-4"/>Bergabung Mei 2026</span>
                  </div>
                  <p className="mt-4 flex gap-4 text-[15px]">
                    <span className="text-gray-500 hover:underline cursor-pointer"><strong className="text-white">0</strong> Mengikuti</span>
                    <span className="text-gray-500 hover:underline cursor-pointer"><strong className="text-white">0</strong> Pengikut</span>
                  </p>
                </div>
              </div>
              <div className="flex border-b border-gray-800">
                <div className="flex-1 py-4 text-center font-bold relative hover:bg-white/5 transition cursor-pointer">Postingan<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full"></div></div>
                <div className="flex-1 py-4 text-center text-gray-500 font-bold opacity-50 hover:bg-white/5 transition cursor-pointer">Balasan</div>
                <div className="flex-1 py-4 text-center text-gray-500 font-bold opacity-50 hover:bg-white/5 transition cursor-pointer">Suka</div>
              </div>
              <div>
                {userProfile.posts?.length === 0 ? <div className="p-8 text-center text-gray-500">Anda belum membuat postingan apa pun.</div>
                  : userProfile.posts?.map((post: any) => (
                    <div key={post.id} onClick={() => loadPostDetailAndComments(post.id)} className="p-4 border-b border-gray-800 hover:bg-white/5 transition cursor-pointer flex gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">{userProfile.avatarUrl ? <img src={userProfile.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userProfile.name.charAt(0)}</div>}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1"><span className="font-bold hover:underline">{userProfile.name}</span><span className="text-gray-500 text-sm">@{userProfile.name.replace(/\s+/g, '').toLowerCase()}</span></div>
                          <ItemMenu item={post} type="post" />
                        </div>
                        {post.content && <p className="mt-1 text-[#E7E9EA] whitespace-pre-wrap">{post.content}</p>}
                        {post.imageUrl && <img src={post.imageUrl} className="mt-3 rounded-2xl border border-gray-800 max-h-[500px] w-full object-cover" />}
                        <div className="flex justify-between mt-3 text-gray-500 max-w-md pr-6">
                          <button onClick={(e) => { e.stopPropagation(); setReplyingTo(post); }} className="flex items-center gap-2 group outline-none"><div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full"><MessageCircle className="w-4 h-4" /></div><span>{post._count?.comments || 0}</span></button>
                          <button onClick={(e) => handleLike(e, post.id, "post")} className={`flex items-center gap-2 group outline-none ${post.isLiked ? 'text-pink-500' : ''}`}><div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full"><Heart className={`w-4 h-4 ${post.isLiked ? 'fill-pink-500' : ''}`} /></div><span>{post._count?.likes || 0}</span></button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* View: Notifikasi */}
          {currentView === "notifications" && (
            <>
              <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800 p-4"><h2 className="text-xl font-bold">Notifikasi</h2></div>
              <div className="divide-y divide-gray-800">
                {notifications.length === 0 ? <div className="p-8 text-center text-gray-500">Belum ada aktivitas baru.</div>
                  : notifications.map((notif) => (
                    <div key={notif.id} onClick={() => { if (notif.postId) loadPostDetailAndComments(notif.postId); }} className="p-4 flex gap-4 hover:bg-white/5 transition cursor-pointer">
                      <div className="text-2xl shrink-0">{notif.type.includes("LIKE") ? <Heart className="w-6 h-6 fill-pink-500 text-pink-500 mx-auto" /> : <MessageCircle className="w-6 h-6 text-[#1D9BF0] fill-[#1D9BF0] mx-auto" />}</div>
                      <div className="flex-1">
                        <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden mb-2">{notif.triggeredBy?.avatarUrl ? <img src={notif.triggeredBy.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{notif.triggeredBy?.name?.charAt(0)}</div>}</div>
                        <p className="text-sm"><span className="font-bold">{notif.triggeredBy?.name || "Seseorang"}</span> {notif.type === "LIKE" ? "menyukai postingan Anda" : notif.type === "COMMENT_LIKE" ? "menyukai komentar Anda" : "membalas Anda"}</p>
                        {notif.post?.content && <p className="text-gray-500 text-xs mt-1 bg-gray-900/50 p-2 rounded border border-gray-800 italic truncate">"{notif.post?.content}"</p>}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* View: Detail Postingan */}
          {currentView === "detail" && selectedPostDetail && (
            <>
              <div className="sticky top-0 bg-black/80 backdrop-blur z-10 border-b border-gray-800 p-4 flex items-center gap-6">
                <button onClick={() => switchView("home")} className="p-2 hover:bg-white/10 rounded-full transition"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-xl font-bold">Postingan</h2>
              </div>
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">{selectedPostDetail.author?.avatarUrl ? <img src={selectedPostDetail.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-lg">{selectedPostDetail.author?.name?.charAt(0)}</div>}</div>
                    <div><h3 className="font-bold leading-tight">{selectedPostDetail.author?.name}</h3><p className="text-gray-500 text-sm">@{selectedPostDetail.author?.name?.replace(/\s+/g, '').toLowerCase()}</p></div>
                  </div>
                  <ItemMenu item={selectedPostDetail} type="post" />
                </div>
                {selectedPostDetail.content && <p className="text-2xl text-[#E7E9EA] whitespace-pre-wrap leading-relaxed py-2">{selectedPostDetail.content}</p>}
                {selectedPostDetail.imageUrl && <img src={selectedPostDetail.imageUrl} className="mt-2 mb-2 rounded-2xl border border-gray-800 max-h-[500px] w-full object-cover" />}
                <div className="border-y border-gray-800 py-3 my-3 text-sm text-gray-500 flex gap-6">
                  <span><strong className="text-white">{selectedPostDetail._count?.likes || 0}</strong> Suka</span>
                  <span><strong className="text-white">{selectedPostDetail._count?.comments || 0}</strong> Balasan</span>
                </div>
                <div className="flex justify-around text-gray-500 border-b border-gray-800 pb-2">
                  <button onClick={() => setReplyingTo(selectedPostDetail)} className="p-2 hover:bg-[#1D9BF0]/10 hover:text-[#1D9BF0] rounded-full transition"><MessageCircle className="w-5 h-5" /></button>
                  <button onClick={(e) => handleLike(e, selectedPostDetail.id, "post")} className={`p-2 hover:bg-pink-500/10 hover:text-pink-500 rounded-full transition ${selectedPostDetail.isLiked ? 'text-pink-500' : ''}`}><Heart className={`w-5 h-5 ${selectedPostDetail.isLiked ? 'fill-pink-500' : ''}`} /></button>
                </div>
              </div>
              <div className="divide-y divide-gray-800">
                {postComments.length === 0 ? <div className="p-8 text-center text-gray-500">Belum ada balasan untuk postingan ini.</div>
                  : postComments.map((comment: any) => (
                    <div key={comment.id} className="p-4 flex flex-col hover:bg-white/5 transition">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0">{comment.author?.avatarUrl ? <img src={comment.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-sm">{comment.author?.name?.charAt(0) || "?"}</div>}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1"><span className="font-bold text-sm">{comment.author?.name}</span><span className="text-gray-500 text-sm">@{comment.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></div>
                            <ItemMenu item={comment} type="comment" />
                          </div>
                          {comment.content && <p className="text-[#E7E9EA] mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>}
                          {comment.imageUrl && <img src={comment.imageUrl} className="mt-2 rounded-xl border border-gray-800 max-h-60 object-cover" />}
                          <div className="flex justify-start mt-2 gap-6">
                            <button onClick={(e) => { e.stopPropagation(); setReplyingTo(comment); }} className="flex items-center gap-2 group outline-none text-gray-500"><div className="p-2 -ml-2 group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] rounded-full transition-colors"><MessageCircle className="w-4 h-4" /></div><span className="text-xs group-hover:text-[#1D9BF0]">{comment.replies?.length || 0}</span></button>
                            <button onClick={(e) => handleLike(e, comment.id, "comment")} className={`flex items-center gap-2 group outline-none text-gray-500 ${comment.isLiked ? 'text-pink-500' : ''}`}><div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full transition-colors"><Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-pink-500' : ''}`} /></div><span className="text-xs group-hover:text-pink-500">{comment._count?.likes || 0}</span></button>
                          </div>
                        </div>
                      </div>
                      {comment.replies?.map((reply: any) => (
                        <div key={reply.id} className="ml-10 mt-3 border-l-2 border-gray-800 pl-4 flex gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full overflow-hidden shrink-0">{reply.author?.avatarUrl ? <img src={reply.author.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-xs">{reply.author?.name?.charAt(0) || "?"}</div>}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1"><span className="font-bold text-sm">{reply.author?.name}</span><span className="text-gray-500 text-xs">@{reply.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></div>
                              <ItemMenu item={reply} type="comment" />
                            </div>
                            <p className="text-gray-400 text-xs mb-1">Membalas <span className="text-[#1D9BF0]">@{comment.author?.name?.replace(/\s+/g, '').toLowerCase()}</span></p>
                            {reply.content && <p className="text-[#E7E9EA] text-sm whitespace-pre-wrap">{reply.content}</p>}
                            {reply.imageUrl && <img src={reply.imageUrl} className="mt-2 rounded-xl border border-gray-800 max-h-40 object-cover" />}
                            <div className="flex justify-start mt-1 gap-6">
                              <button onClick={(e) => handleLike(e, reply.id, "comment")} className={`flex items-center gap-2 group outline-none text-gray-500 ${reply.isLiked ? 'text-pink-500' : ''}`}><div className="p-2 -ml-2 group-hover:bg-pink-500/10 group-hover:text-pink-500 rounded-full transition-colors"><Heart className={`w-4 h-4 ${reply.isLiked ? 'fill-pink-500' : ''}`} /></div><span className="text-xs group-hover:text-pink-500">{reply._count?.likes || 0}</span></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* View: Beranda */}
          {currentView === "home" && (
            <ViewBeranda
              posts={posts}
              userData={userData}
              newPostContent={newPostContent}
              setNewPostContent={setNewPostContent}
              postImage={postImage}
              setPostImage={setPostImage}
              isSubmitting={isSubmitting}
              activeEmojiPicker={activeEmojiPicker}
              setActiveEmojiPicker={setActiveEmojiPicker}
              handlePostSubmit={handlePostSubmit}
              handleImageUpload={handleImageUpload}
              handleInputResize={handleInputResize}
              handleLike={handleLike}
              loadPostDetailAndComments={loadPostDetailAndComments}
              switchView={switchView}
              setReplyingTo={setReplyingTo}
              ItemMenu={ItemMenu}
            />
          )}
        </main>

        {/* Sidebar Kanan */}
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
}