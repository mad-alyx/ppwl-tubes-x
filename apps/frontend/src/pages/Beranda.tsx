import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Bell, 
  Users, 
  Mail, 
  Slash, 
  Bookmark, 
  Rocket, 
  BadgeCheck, 
  User, 
  MoreHorizontal, 
  Image as ImageIcon, 
  BarChart2, 
  Smile, 
  Calendar, 
  MapPin, 
  Feather 
} from 'lucide-react';


const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M 21.742 21.75 l -7.563 -11.179 l 7.056 -8.321 h -2.456 l -5.691 6.714 l -4.54 -6.714 H 2.359 l 7.29 10.776 L 2.25 21.75 h 2.456 l 6.035 -7.118 l 4.818 7.118 h 6.191 h -0.008 Z M 7.739 3.818 L 18.81 20.182 h -2.447 L 5.29 3.818 h 2.447 Z" />
  </svg>
);

const GrokIcon = ({ size = 28 }: { size?: number }) => (
  // Menggunakan viewBox 0 0 33 33 karena koordinat path Anda mencapai angka 33
  <svg viewBox="0 0 33 33" width={size} height={size} fill="currentColor">
    <path d="M 12.745 20.54 l 10.97 -8.19 c 0.539 -0.4 1.307 -0.244 1.564 0.38 c 1.349 3.288 0.746 7.241 -1.938 9.955 c -2.683 2.714 -6.417 3.31 -9.83 1.954 l -3.728 1.745 c 5.347 3.697 11.84 2.782 15.898 -1.324 c 3.219 -3.255 4.216 -7.692 3.284 -11.693 l 0.008 0.009 c -1.351 -5.878 0.332 -8.227 3.782 -13.031 L 33 0 l -4.54 4.59 v -0.014 L 12.743 20.544 m -2.263 1.987 c -3.837 -3.707 -3.175 -9.446 0.1 -12.755 c 2.42 -2.449 6.388 -3.448 9.852 -1.979 l 3.72 -1.737 c -0.67 -0.49 -1.53 -1.017 -2.515 -1.387 c -4.455 -1.854 -9.789 -0.931 -13.41 2.728 c -3.483 3.523 -4.579 8.94 -2.697 13.561 c 1.405 3.454 -0.899 5.898 -3.22 8.364 C 1.49 30.2 0.666 31.074 0 32 l 10.478 -9.466" />
  </svg>
);

const Beranda = () => {
  // Mengambil pathname untuk logika active link di sidebar [1], [2]
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState('For you');

  // Daftar Menu 
  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={28} /> },
    { name: "Explore", path: "/explore", icon: <Search size={28} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={28} /> },
    { name: "Follow", path: "/follow", icon: <Users size={28} /> },
    { name: "Chat", path: "/messages", icon: <Mail size={28} /> },
    { name: "Grok", path: "/grok", icon: <GrokIcon size={28} /> },
    { name: "Bookmarks", path: "/bookmarks", icon: <Bookmark size={28} /> },
    { name: "Creator Studio", path: "/studio", icon: <Rocket size={28} /> },
    { name: "Premium", path: "/premium", icon: <XIcon size={28} /> },
    { name: "Profile", path: "/profile", icon: <User size={28} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#E7E9EA] font-sans max-w-325 mx-auto">
      
      {/* 1. SIDEBAR (KIRI) - Desktop Version [1] */}
      <aside className="hidden md:flex flex-col w-68.75 h-screen sticky top-0 px-2 border-r border-[#2F3336]">
        {/* Logo X */}
        <div className="p-3 mb-2 hover:bg-[#0F1419] w-fit rounded-full transition cursor-pointer">
          <XIcon size={30} className="text-white" />
        </div>
        
        {/* Navigasi Utama - Dengan Scroll jika menu terlalu banyak */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
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
            <span className="text-xl hidden lg:block">More</span>
          </div>
        </nav>

        {/* Tombol Post Desktop */}
        <button className="bg-[#1D9BF0] text-white font-bold py-3 px-4 rounded-full mt-4 mb-4 hover:bg-opacity-90 transition w-[90%] hidden lg:block shadow-sm">
          Post
        </button>
        <button className="bg-[#1D9BF0] text-white p-3 rounded-full mt-4 mb-4 hover:bg-opacity-90 transition lg:hidden mx-auto">
          <Feather size={24} />
        </button>

        {/* Profile Mini Popover */}
        <div className="mt-auto mb-4 flex items-center justify-between p-3 rounded-full hover:bg-[#0F1419] cursor-pointer transition">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-[#2F3336]" />
            <div className="hidden lg:block text-sm">
              <p className="font-bold text-white">Irene</p>
              <p className="text-[#71767B]">@irene_dev</p>
            </div>
          </div>
          <MoreHorizontal size={18} className="text-[#71767B] hidden lg:block" />
        </div>
      </aside>

      {/* 2. MAIN FEED (TENGAH)  */}
      <main className="flex-1 border-r border-[#2F3336] max-w-150 mb-15 md:mb-0">
        {/* Header Tab */}
        <div className="sticky top-0 bg-[#000000]/80 backdrop-blur-md border-b border-[#2F3336] z-10">
          <h1 className="p-4 text-xl font-bold text-white">Home</h1>
          <div className="flex text-center font-bold">
            {['For you', 'Following'].map((tab) => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 p-4 hover:bg-[#0F1419] cursor-pointer transition relative"
              >
                <span className={activeTab === tab ? "text-white" : "text-[#71767B]"}>{tab}</span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1D9BF0] rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Postingan (Aturan: No Video) */}
        <div className="p-4 border-b border-[#2F3336] flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2F3336] shrink-0" />
          <div className="flex-1">
            <textarea 
              placeholder="What is happening?!" 
              className="w-full bg-transparent text-xl outline-none resize-none min-h-25 placeholder:text-[#71767B]"
            />
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2F3336]">
              <div className="flex text-[#1D9BF0] gap-4">
                {/* Perbaikan TS Error: Title dipindah ke span pembungkus */}
                <span title="Media"><ImageIcon size={20} className="cursor-pointer hover:bg-[#1D9BF0]/10 rounded-full" /></span>
                <span title="Poll"><BarChart2 size={20} className="cursor-pointer hover:bg-[#1D9BF0]/10 rounded-full" /></span>
                <span title="Emoji"><Smile size={20} className="cursor-pointer hover:bg-[#1D9BF0]/10 rounded-full" /></span>
                <span title="Schedule"><Calendar size={20} className="cursor-pointer hover:bg-[#1D9BF0]/10 rounded-full" /></span>
                <MapPin size={20} className="opacity-50 cursor-not-allowed" />
              </div>
              <button className="bg-[#1D9BF0] text-white px-5 py-2 rounded-full font-bold hover:bg-opacity-90 transition">
                Post
              </button>
            </div>
          </div>
        </div>

        {/* List Feed (Dummy) */}
        <div className="divide-y divide-[#2F3336]">
          {[1, 2].map((i) => (
            <PostCard key={i} user={`User PPWL ${i}`} handle={`dev_student_${i}`} />
          ))}
        </div>
      </main>

      {/* 3. WIDGETS (KANAN) */}
      <aside className="hidden lg:block w-87.5 p-4 space-y-4">
        <div className="sticky top-2">
          <div className="bg-[#16181C] p-3 rounded-full border border-transparent focus-within:border-[#1D9BF0] focus-within:bg-black transition flex items-center gap-3 group">
            <Search size={18} className="text-[#71767B] group-focus-within:text-[#1D9BF0] ml-2" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent outline-none w-full placeholder:text-[#71767B]" 
            />
          </div>
        </div>

        <div className="bg-[#16181C] rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4 text-white">Trends for you</h2>
          <TrendItem category="Technology · Trending" title="#ReactJS" posts="12.4K Posts" />
          <TrendItem category="Education · Trending" title="#UAS_PPWL" posts="5,102 Posts" />
          <TrendItem category="Sports · Trending" title="Persib" posts="8,234 Posts" />
        </div>
      </aside>

      {/* 4. MOBILE NAVIGATION (Bawah) */}
      <div className="md:hidden fixed bottom-0 w-full bg-black border-t border-[#2F3336] flex justify-around p-3 z-50">
        <Link to="/"><Home size={28} className={pathname === "/" ? "text-white" : "text-[#71767B]"} /></Link>
        <Link to="/explore"><Search size={28} className={pathname === "/explore" ? "text-white" : "text-[#71767B]"} /></Link>
        <Link to="/notifications"><Bell size={28} className={pathname === "/notifications" ? "text-white" : "text-[#71767B]"} /></Link>
        <Link to="/messages"><Mail size={28} className={pathname === "/messages" ? "text-white" : "text-[#71767B]"} /></Link>
      </div>
    </div>
  );
};

/**
 *  Sub-komponen NavItem untuk Sidebar [2]
 */
const NavItem = ({ icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link 
    to={path} 
    className={`flex items-center gap-4 p-3 rounded-full hover:bg-[#0F1419] transition w-fit pr-8 cursor-pointer ${
      active ? "font-bold text-white" : "text-[#E7E9EA]"
    }`}
  >
    {icon}
    <span className="text-xl hidden lg:block">{label}</span>
  </Link>
);

/**
 *  Sub-komponen PostCard untuk Feed 
 */
const PostCard = ({ user, handle }: { user: string, handle: string }) => (
  <div className="p-4 hover:bg-[#0F1419]/50 transition cursor-pointer flex gap-3">
    <div className="w-10 h-10 rounded-full bg-[#2F3336] shrink-0" />
    <div className="flex-1">
      <div className="flex gap-2 items-center">
        <span className="font-bold text-white hover:underline">{user}</span>
        <span className="text-[#71767B] text-sm">@{handle} · 2h</span>
      </div>
      <p className="mt-1 text-[#E7E9EA]"> Clone X </p>
      <div className="flex justify-between mt-3 text-[#71767B] max-w-md pr-4">
        <span className="hover:text-[#1D9BF0] transition flex items-center gap-2 text-sm">💬 5</span>
        <span className="hover:text-[#00BA7C] transition flex items-center gap-2 text-sm">🔄 2</span>
        <span className="hover:text-[#F4212E] transition flex items-center gap-2 text-sm">❤️ 10</span>
        <span className="hover:text-[#1D9BF0] transition flex items-center gap-2 text-sm">📊 1.2K</span>
      </div>
    </div>
  </div>
);

const TrendItem = ({ category, title, posts }: any) => (
  <div className="hover:bg-[#2F3336]/30 cursor-pointer p-2 rounded-lg transition">
    <p className="text-xs text-[#71767B]">{category}</p>
    <p className="font-bold text-white">{title}</p>
    <p className="text-xs text-[#71767B]">{posts}</p>
  </div>
);

export default Beranda;