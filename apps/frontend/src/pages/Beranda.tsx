// apps/frontend/src/pages/Beranda.tsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { fetchApi } from "../utils/api";
import {
  Home, Search, Bell, Users, Mail, Bookmark, Rocket, User,
  MoreHorizontal, Image as ImageIcon, Smile, X,
  Edit, Trash2, LogOut, Feather
} from "lucide-react";
import HomeView from "../components/irene/ViewBeranda";

// ── Custom Icons ──────────────────────────────────────────

const XIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M 21.742 21.75 l -7.563 -11.179 l 7.056 -8.321 h -2.456 l -5.691 6.714 l -4.54 -6.714 H 2.359 l 7.29 10.776 L 2.25 21.75 h 2.456 l 6.035 -7.118 l 4.818 7.118 h 6.191 h -0.008 Z M 7.739 3.818 L 18.81 20.182 h -2.447 L 5.29 3.818 h 2.447 Z" />
  </svg>
);

const GrokIcon = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 33 33" width={size} height={size} fill="currentColor">
    <path d="M 12.745 20.54 l 10.97 -8.19 c 0.539 -0.4 1.307 -0.244 1.564 0.38 c 1.349 3.288 0.746 7.241 -1.938 9.955 c -2.683 2.714 -6.417 3.31 -9.83 1.954 l -3.728 1.745 c 5.347 3.697 11.84 2.782 15.898 -1.324 c 3.219 -3.255 4.216 -7.692 3.284 -11.693 l 0.008 0.009 c -1.351 -5.878 0.332 -8.227 3.782 -13.031 L 33 0 l -4.54 4.59 v -0.014 L 12.743 20.544 m -2.263 1.987 c -3.837 -3.707 -3.175 -9.446 0.1 -12.755 c 2.42 -2.449 6.388 -3.448 9.852 -1.979 l 3.72 -1.737 c -0.67 -0.49 -1.53 -1.017 -2.515 -1.387 c -4.455 -1.854 -9.789 -0.931 -13.41 2.728 c -3.483 3.523 -4.579 8.94 -2.697 13.561 c 1.405 3.454 -0.899 5.898 -3.22 8.364 C 1.49 30.2 0.666 31.074 0 32 l 10.478 -9.466" />
  </svg>
);

// ── NavItem ───────────────────────────────────────────────

const NavItem = ({ icon, label, path, active }: { icon: any; label: string; path: string; active: boolean }) => (
  <Link
    to={path}
    className={`flex items-center gap-4 p-3 rounded-full hover:bg-[#0F1419] transition w-fit pr-8 cursor-pointer ${
      active ? "font-bold text-white" : "text-[#E7E9EA]"
    }`}
  >
    {icon}
    <span className="text-xl hidden md:block">{label}</span>
  </Link>
);

// ── Main Component ────────────────────────────────────────

type ViewMode = "home" | "notifications" | "detail" | "profile";

export default function Beranda() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [currentView, setCurrentView] = useState<ViewMode>("home");
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPostContent, setNewPostContent] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeContent, setComposeContent] = useState("");
  const [composeImage, setComposeImage] = useState<string | null>(null);
  const [composeEditId, setComposeEditId] = useState<string | null>(null);
  const [composeEditType, setComposeEditType] = useState<"post" | "comment" | null>(null);
  const composeTextareaRef = useRef<HTMLTextAreaElement>(null);
  const composeImageInputRef = useRef<HTMLInputElement>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<"post" | "reply" | "compose" | null>(null);

  const MAX_CHARS = 280;
  const composeCharCount = composeContent.length;

  const EMOJI_LIST = [
    '😀','😂','🤣','😊','😍','🥰','😘','💕','😁','😉','😎','😋','🤗','🤔','🤨','😐','😑','😶','🙄','😏',
    '😣','😥','😮','🤐','😯','😪','😫','🥱','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑',
    '😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳',
    '🤪','😵','😡','😠','🤬','😷','🤒','🤕','🤢','🤮','🤧','😇','🥳','🥺','🤠','🤡','🤥','🤫','🤭','🧐',
    '🤓','😈','👿','👻','💀','☠️','👽','👾','🤖','💩','❤️','🔥','✨','💯','👍','👎','✌️','🤞','🙏','👏','🙌'
  ];

  const menuItems = [
    { name: "Home", path: "/beranda", icon: <Home size={28} /> },
    { name: "Explore", path: "/explore", icon: <Search size={28} /> },
    { name: "Notifications", path: "/notifikasi", icon: <Bell size={28} /> },
    { name: "Follow", path: "/follow", icon: <Users size={28} /> },
    { name: "Chat", path: "/messages", icon: <Mail size={28} /> },
    { name: "Grok", path: "/grok", icon: <GrokIcon size={28} /> },
    { name: "Bookmarks", path: "/bookmarks", icon: <Bookmark size={28} /> },
    { name: "Creator Studio", path: "/studio", icon: <Rocket size={28} /> },
    { name: "Premium", path: "/premium", icon: <XIcon size={28} /> },
    { name: "Profile", path: "/profil", icon: <User size={28} /> },
  ];

  // ── Data Loaders ──────────────────────────────────────────

  const loadTimeline = async () => {
    try {
      const response = await fetchApi("/posts");
      setPosts(response.data || []);
    } catch (err: any) { setError(err.message); }
  };

  useEffect(() => {
    loadTimeline();
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("User data from local storage:", parsedUser);
      
      // Mengantisipasi struktur data login Google yang menggunakan nama variabel berbeda
      if (!parsedUser.name && parsedUser.displayName) {
        parsedUser.name = parsedUser.displayName;
      }
      
      setUserData(parsedUser);
    }
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
      setActiveEmojiPicker(null); setIsSubmitting(false);
      loadTimeline();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string, type: "post" | "comment" = "post") => {
    e.stopPropagation();
    try {
      if (type === "post") {
        setPosts(cur => cur.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, _count: { ...p._count, likes: p.isLiked ? Math.max(0, p._count.likes - 1) : p._count.likes + 1 } } : p));
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
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      const endpoint = type === "post" ? `/posts/${id}` : `/posts/comments/${id}`;
      await fetchApi(endpoint, { method: "DELETE" });
      setOpenMenuId(null);
      loadTimeline();
    } catch (err: any) { alert(err.message); }
  };

  const switchView = (view: ViewMode) => {
    setError(""); setCurrentView(view); setOpenMenuId(null); setActiveEmojiPicker(null);
    if (view === "home") loadTimeline();
    if (view === "notifications") navigate("/notifikasi");
    if (view === "profile") navigate("/profil");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };

  // ── Sub-components ────────────────────────────────────────

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
            <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id, type); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-sm font-bold text-red-500 text-left"><Trash2 className="w-4 h-4"/> Delete</button>
          </div>
        )}
      </div>
    );
  };

  const EmojiDropdown = () => (
    <div className="absolute top-12 left-0 z-50 bg-[#16181C] border border-gray-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] p-3 w-[300px]">
      <div className="flex justify-between items-center mb-2 px-1 border-b border-gray-800 pb-2">
        <span className="text-sm font-bold text-gray-300">Choose Emoji</span>
        <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-gray-500 hover:text-white transition bg-gray-800 rounded-full p-1"><X className="w-4 h-4"/></button>
      </div>
      <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
        {EMOJI_LIST.map(emoji => (
          <button type="button" key={emoji} onClick={() => setComposeContent(prev => prev + emoji)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-xl transition transform hover:scale-125">{emoji}</button>
        ))}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-black text-[#E7E9EA] max-w-[1300px] mx-auto" onClick={() => setOpenMenuId(null)}>

      {/* Modal Compose / Edit */}
      {isComposeOpen && (
        <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-16">
          <div className="bg-black w-full max-w-[600px] rounded-2xl flex flex-col relative border border-gray-800">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <button onClick={() => { setIsComposeOpen(false); setComposeContent(""); setComposeImage(null); setComposeEditId(null); setComposeEditType(null); setActiveEmojiPicker(null); }} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5"/></button>
                {composeEditId && <h2 className="font-bold text-lg">Edit {composeEditType === "post" ? "Post" : "Comment"}</h2>}
              </div>
              <button onClick={(e) => handlePostSubmit(e, true)} disabled={(!composeContent.trim() && !composeImage) || isSubmitting || composeCharCount > MAX_CHARS} className="bg-[#1D9BF0] text-white font-bold py-1.5 px-4 rounded-full disabled:opacity-50 transition">{composeEditId ? "Save" : "Post"}</button>
            </div>
            <div className="p-4 flex gap-3 overflow-y-auto max-h-[80vh]">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                {userData?.avatarUrl ? <img src={userData.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{userData?.name?.charAt(0) || "?"}</div>}
              </div>
              <div className="flex flex-col flex-1 gap-3 w-full">
                <textarea ref={composeTextareaRef} className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 pt-2" placeholder="What is happening?!" rows={4} autoFocus value={composeContent} onChange={(e) => handleInputResize(e, composeTextareaRef, setComposeContent)} />
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
                      {activeEmojiPicker === "compose" && <EmojiDropdown />}
                    </div>
                  </div>
                  <span className={`text-sm ${composeCharCount > MAX_CHARS ? "text-red-500" : "text-gray-500"}`}>{composeCharCount}/{MAX_CHARS}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Kiri */}
      <aside className="hidden md:flex flex-col w-[88px] lg:w-[275px] h-screen sticky top-0 px-2 border-r border-[#2F3336]">
        <div className="p-3 mb-2 hover:bg-[#0F1419] w-fit rounded-full transition cursor-pointer" onClick={() => switchView("home")}>
          <XIcon size={30} className="text-white" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavItem
              key={item.name}
              icon={item.icon}
              label={item.name}
              path={item.path}
              active={pathname === item.path}
            />
          ))}
          <div className="flex items-center gap-4 p-3 rounded-full hover:bg-[#0F1419] transition w-fit pr-8 cursor-pointer text-[#E7E9EA]">
            <MoreHorizontal size={28} />
            <span className="text-xl hidden md:block">More</span>
          </div>
        </nav>

        {/* Tombol Post */}
        <button onClick={() => setIsComposeOpen(true)} className="bg-[#1D9BF0] text-white font-bold py-3 px-4 rounded-full mt-4 mb-4 hover:bg-opacity-90 transition w-[90%] hidden md:block shadow-sm">
          Post
        </button>
        <button onClick={() => setIsComposeOpen(true)} className="bg-[#1D9BF0] text-white p-3 rounded-full mt-4 mb-4 hover:bg-opacity-90 transition lg:hidden mx-auto">
          <Feather size={24} />
        </button>

        {/* Profile Mini + Logout */}
        <div className="mt-auto mb-4 flex items-center justify-between p-3 rounded-full hover:bg-[#0F1419] cursor-pointer transition" onClick={handleLogout}>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-[#2F3336] overflow-hidden flex items-center justify-center">
              {userData?.avatarUrl ? (
                <img src={userData.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold bg-gray-700 text-white">
                  {userData?.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
              <div className=" text-sm">
                <p className="font-bold text-white">
                  {userData?.name || userData?.displayName || "User"}
                </p>
                <p className="text-[#71767B]">
                  @{userData?.username || (userData?.name || userData?.displayName)?.replace(/\s+/g, '').toLowerCase() || "user"}
              </p>
            </div>
          </div>
          <LogOut size={18} className="text-[#71767B] hidden md:block" />
        </div>
      </aside>

      {/* Konten Tengah */}
      <main className="flex-1 border-r border-[#2F3336] max-w-[600px] min-h-screen mb-[60px] md:mb-0">
        {error && (
          <div className="m-4 p-4 text-white bg-[#F4212E]/20 border border-[#F4212E]/40 rounded-xl relative">
            <div className="flex gap-2"><span className="font-bold text-[#F4212E]">System:</span><p className="text-[#E7E9EA]">{error}</p></div>
            <button onClick={() => setError("")} className="absolute top-3 right-4 text-gray-500 hover:text-white transition">✕</button>
          </div>
        )}

        <HomeView
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
          loadPostDetailAndComments={(postId) => navigate(`/post/${postId}`)}
          switchView={switchView}
          setReplyingTo={setReplyingTo}
          ItemMenu={ItemMenu}
        />
      </main>

      {/* Sidebar Kanan */}
      <aside className="hidden md:block w-[350px] p-4 space-y-4">
        <div className="sticky top-2">
          <div className="bg-[#16181C] p-3 rounded-full border border-transparent focus-within:border-[#1D9BF0] focus-within:bg-black transition flex items-center gap-3 group">
            <Search size={18} className="text-[#71767B] group-focus-within:text-[#1D9BF0] ml-2" />
            <input type="text" placeholder="Search" className="bg-transparent outline-none w-full placeholder:text-[#71767B]" />
          </div>
        </div>
        <div className="bg-[#16181C] rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4 text-white">Trends for you</h2>
          <div className="py-3 border-b border-[#2F3336]">
            <p className="text-xs text-[#71767B]">Technology · Trending</p>
            <p className="font-bold text-white">#ReactJS</p>
            <p className="text-xs text-[#71767B]">12.4K Posts</p>
          </div>
          <div className="py-3 border-b border-[#2F3336]">
            <p className="text-xs text-[#71767B]">Education · Trending</p>
            <p className="font-bold text-white">#UAS_PPWL</p>
            <p className="text-xs text-[#71767B]">5,102 Posts</p>
          </div>
          <div className="py-3">
            <p className="text-xs text-[#71767B]">Sports · Trending</p>
            <p className="font-bold text-white">Persib</p>
            <p className="text-xs text-[#71767B]">8,234 Posts</p>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-black border-t border-[#2F3336] flex justify-around p-3 z-50">
        <Link to="/beranda"><Home size={28} className={pathname === "/beranda" ? "text-white" : "text-[#71767B]"} /></Link>
        <Link to="/explore"><Search size={28} className={pathname === "/explore" ? "text-white" : "text-[#71767B]"} /></Link>
        <Link to="/notifikasi"><Bell size={28} className={pathname === "/notifikasi" ? "text-white" : "text-[#71767B]"} /></Link>
        <Link to="/messages"><Mail size={28} className={pathname === "/messages" ? "text-white" : "text-[#71767B]"} /></Link>
      </div>

    </div>
  );
}