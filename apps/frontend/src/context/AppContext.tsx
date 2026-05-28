// src/context/AppContext.tsx

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";
import { Edit, MoreHorizontal, Trash2, X } from "lucide-react";

export type ViewMode = "home" | "notifications" | "detail" | "profile" | "form";

const EMOJI_LIST = [
  '😀','😂','🤣','😊','😍','🥰','😘','💕','😁','😉','😎','😋','🤗','🤔','🤨','😐','😑','😶','🙄','😏',
  '😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑',
  '😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳',
  '🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐',
  '🤓','😈','👿','👻','💀','☠️','👽','👾','🤖','💩','❤️','🔥','✨','💯','👍','👎','✌️','🤞','🙏','👏','🙌'
];

// ─── Tipe Context ────────────────────────────────────────────────────────────
interface AppContextType {
  // State umum
  currentView: ViewMode;
  error: string;
  setError: (v: string) => void;
  userData: any;
  isSubmitting: boolean;

  // Post
  posts: any[];
  selectedPostDetail: any;
  postComments: any[];

  // Notifikasi
  notifications: any[];

  // Profil
  userProfile: any;
  isProfileEditOpen: boolean;
  setIsProfileEditOpen: (v: boolean) => void;
  editProfileName: string;
  setEditProfileName: (v: string) => void;
  editProfileBio: string;
  setEditProfileBio: (v: string) => void;
  editProfileLocation: string;
  setEditProfileLocation: (v: string) => void;
  editProfileWebsite: string;
  setEditProfileWebsite: (v: string) => void;
  editProfileImage: string | null;
  setEditProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  editProfileBanner: string | null;
  setEditProfileBanner: React.Dispatch<React.SetStateAction<string | null>>;

  // Post baru
  newPostContent: string;
  setNewPostContent: (v: string) => void;
  postImage: string | null;
  setPostImage: React.Dispatch<React.SetStateAction<string | null>>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  postImageInputRef: React.RefObject<HTMLInputElement | null>;
  charCount: number;
  MAX_CHARS: number;

  // Reply
  replyingTo: any;
  setReplyingTo: (v: any) => void;
  replyContent: string;
  setReplyContent: (v: string) => void;
  replyImage: string | null;
  setReplyImage: React.Dispatch<React.SetStateAction<string | null>>;
  replyImageInputRef: React.RefObject<HTMLInputElement | null>;


  // Compose modal
  isComposeOpen: boolean;
  setIsComposeOpen: (v: boolean) => void;
  composeContent: string;
  setComposeContent: (v: string) => void;
  composeImage: string | null;
  setComposeImage: React.Dispatch<React.SetStateAction<string | null>>;
  composeEditId: string | null;
  composeEditType: "post" | "comment" | null;
  composeTextareaRef: React.RefObject<HTMLTextAreaElement | null>;
  composeImageInputRef: React.RefObject<HTMLInputElement | null>;
  composeCharCount: number;

  // Emoji
  activeEmojiPicker: "post" | "reply" | "compose" | null;
  setActiveEmojiPicker: (v: any) => void;

  // Handler
  switchView: (v: ViewMode) => void;
  handleLogout: () => void;
  handlePostSubmit: (e: React.FormEvent, isModal?: boolean) => Promise<void>;
  handleReplySubmit: (e: React.FormEvent) => Promise<void>;
  handleLike: (e: React.MouseEvent, id: string, type?: "post" | "comment") => Promise<void>;
  handleDelete: (id: string, type: "post" | "comment") => Promise<void>;
  handleProfileSave: (e: React.FormEvent) => Promise<void>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => void;
  handleInputResize: (e: React.ChangeEvent<HTMLTextAreaElement>, ref: React.RefObject<HTMLTextAreaElement | null>, setter: any) => void;
  loadPostDetailAndComments: (postId: string) => void;
  openEditModal: (item: any, type: "post" | "comment") => void;

  // Komponen
  ItemMenu: React.FC<{ item: any; type: "post" | "comment" }>;
  EmojiDropdown: React.FC<{ target: "post" | "reply" | "compose" }>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext harus dipakai di dalam AppProvider");
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const postImageInputRef = useRef<HTMLInputElement>(null);

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
  const charCount = newPostContent.length;
  const composeCharCount = composeContent.length;

  // ─── Loader ───────────────────────────────────────────────────────────────
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
    const stored = localStorage.getItem("user_data");
    if (stored) setUserData(JSON.parse(stored));
  }, []);

  // ─── Handler ──────────────────────────────────────────────────────────────
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  try {
    const token = localStorage.getItem("jwt_token");
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/presigned-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    
    await fetch(data.data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type }
    });
    
    setter(data.data.fileUrl);
  } catch (err) {
    console.error("Upload gagal:", err);
    setError("Gagal upload gambar.");
  }
};
  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>, ref: React.RefObject<HTMLTextAreaElement | null>, setter: any) => {
    setter(e.target.value);
    if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = `${ref.current.scrollHeight}px`; }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (activeEmojiPicker === "post") setNewPostContent(prev => prev + emoji);
    else if (activeEmojiPicker === "reply") setReplyContent(prev => prev + emoji);
    else if (activeEmojiPicker === "compose") setComposeContent(prev => prev + emoji);
  };

  const handlePostSubmit = async (e: React.FormEvent, isModal = false) => {
    e.preventDefault();
    const content = isModal ? composeContent : newPostContent;
    const imageUrl = isModal ? composeImage : postImage;
    const currentLimit = isModal ? composeCharCount : charCount;
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
      setActiveEmojiPicker(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      setIsSubmitting(false);
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
      await fetchApi(type === "post" ? `/posts/${id}` : `/posts/comments/${id}`, { method: "DELETE" });
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

  // ─── Komponen kecil ───────────────────────────────────────────────────────
  const ItemMenu: React.FC<{ item: any; type: "post" | "comment" }> = ({ item, type }) => {
    if (item.authorId !== userData?.id) return null;
    const isOpen = openMenuId === item.id;
    return (
      <div className="relative">
        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(isOpen ? null : item.id); }} className="text-gray-500 hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 p-1.5 rounded-full transition">
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute right-0 top-8 bg-black border border-gray-700 rounded-xl shadow-lg shadow-white/10 z-20 w-36 overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); openEditModal(item, type); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-sm font-bold text-left"><Edit className="w-4 h-4" /> Edit</button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id, type); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-sm font-bold text-red-500 text-left"><Trash2 className="w-4 h-4" /> Hapus</button>
          </div>
        )}
      </div>
    );
  };

  const EmojiDropdown: React.FC<{ target: "post" | "reply" | "compose" }> = ({ target }) => (
    <div aria-label={`Emoji picker for ${target}`} className="absolute top-12 left-0 z-50 bg-[#16181C] border border-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] p-3 w-[300px]">
      <div className="flex justify-between items-center mb-2 px-1 border-b border-gray-800 pb-2">
        <span className="text-sm font-bold text-gray-300">Pilih Emoji</span>
        <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-gray-500 hover:text-white transition bg-gray-800 rounded-full p-1"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto custom-scrollbar">
        {EMOJI_LIST.map(emoji => (
          <button type="button" key={emoji} onClick={() => handleEmojiSelect(emoji)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl transition transform hover:scale-125">{emoji}</button>
        ))}
      </div>
    </div>
  );

  return (
    <AppContext.Provider value={{
      currentView, error, setError, userData, isSubmitting,
      posts, selectedPostDetail, postComments,
      notifications,
      userProfile, isProfileEditOpen, setIsProfileEditOpen,
      editProfileName, setEditProfileName, editProfileBio, setEditProfileBio,
      editProfileLocation, setEditProfileLocation, editProfileWebsite, setEditProfileWebsite,
      editProfileImage, setEditProfileImage, editProfileBanner, setEditProfileBanner,
      newPostContent, setNewPostContent, postImage, setPostImage,
      textareaRef, postImageInputRef, charCount, MAX_CHARS,
      replyingTo, setReplyingTo, replyContent, setReplyContent,
      replyImage, setReplyImage, replyImageInputRef,
      isComposeOpen, setIsComposeOpen, composeContent, setComposeContent,
      composeImage, setComposeImage, composeEditId, composeEditType,
      composeTextareaRef, composeImageInputRef, composeCharCount,
      activeEmojiPicker, setActiveEmojiPicker,
      switchView, handleLogout, handlePostSubmit, handleReplySubmit,
      handleLike, handleDelete, handleProfileSave, handleImageUpload,
      handleInputResize, loadPostDetailAndComments, openEditModal,
      ItemMenu, EmojiDropdown,
    }}>
      {children}
    </AppContext.Provider>
  );
}