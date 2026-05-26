import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Users, Mail, Slash, Bookmark, 
  Rocket, BadgeCheck, User, MoreHorizontal, Feather 
} from 'lucide-react';

// 1. Ikon X Original
const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M 21.742 21.75 l -7.563 -11.179 l 7.056 -8.321 h -2.456 l -5.691 6.714 l -4.54 -6.714 H 2.359 l 7.29 10.776 L 2.25 21.75 h 2.456 l 6.035 -7.118 l 4.818 7.118 h 6.191 h -0.008 Z M 7.739 3.818 L 18.81 20.182 h -2.447 L 5.29 3.818 h 2.447 Z" />
  </svg>
);

// 2. Ikon Home Ori Twitter hasil temuan Ale kemarin
const HomeIconOri = ({ size = 28, active = false }: { size?: number, active?: boolean }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"}>
    <path d="M 19.993 9.042 C 19.48 5.017 16.054 2 11.996 2 s -7.49 3.021 -7.999 7.051 L 2.866 18 H 7.1 c 0.463 2.282 2.481 4 4.9 4 s 4.437 -1.718 4.9 -4 h 4.236 l -1.143 -8.958 Z M 12 20 c -1.306 0 -2.417 -0.835 -2.829 -2 h 5.658 c -0.412 1.165 -1.523 2 -2.829 2 Z m -6.866 -4 l 0.847 -6.698 C 6.364 6.272 8.941 4 11.996 4 s 5.627 2.268 6.013 5.295 L 18.864 16 H 5.134 z"></path>
  </svg>
);

/**
 * FIX VISUAL: Ikon Notifikasi (Lonceng) Original Versi Tipis Estetik
 * strokeWidth diturunkan ke 1.5 agar ramping, ditambah round agar lekukannya halus.
 */
export const NotificationIconOri = ({ size = 28, active = false }: { size?: number, active?: boolean }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={active ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth={active ? "0" : "1.5"} // UNTUK MENIPISKAN: Ganti angka ini (bisa 1.5 atau 1.2 kalau mau super tipis)
    strokeLinecap="round"              // Biar ujung garis halus
    strokeLinejoin="round"             // Biar sudut tekukan rapi
  >
    <path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"></path>
  </svg>
);

const SidebarLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-5 p-3 rounded-full hover:bg-[#16181C] transition w-fit xl:pr-5 ${
      active ? "font-bold text-white" : "text-[#E7E9EA]"
    }`}
  >
    {icon}
    <span className="text-xl hidden xl:block">{label}</span>
  </Link>
);

export default function SideBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Menentukan tab mana yang sedang aktif berdasarkan URL browser
  const isHomeActive = currentPath === '/beranda' || currentPath === '/';
  const isNotificationsActive = currentPath === '/notifications';

  return (
    <div className="flex flex-col justify-between h-screen p-2 sticky top-0 xl:w-64 border-r border-[#2F3336]">
      <div className="flex flex-col gap-2 mt-1">
        <Link to="/beranda" className="p-3 hover:bg-[#16181C] rounded-full w-fit transition text-white mb-2 block">
          <XIcon size={28} />
        </Link>
        
        {/* Menggunakan Ikon Home Ori */}
        <SidebarLink to="/beranda" icon={<HomeIconOri size={28} active={isHomeActive} />} label="Home" active={isHomeActive} />
        
        <SidebarLink to="/explore" icon={<Search size={28} />} label="Explore" active={currentPath === '/explore'} />
        
        {/* Menggunakan Ikon Notifikasi Ori buatan Ale */}
        <SidebarLink to="/notifications" icon={<NotificationIconOri size={28} active={isNotificationsActive} />} label="Notifications" active={isNotificationsActive} />
        
        <SidebarLink to="/follow" icon={<Users size={28} />} label="Follow" active={currentPath === '/follow'} />
        <SidebarLink to="/messages" icon={<Mail size={28} />} label="Messages" active={currentPath === '/messages'} />
        <SidebarLink to="/grok" icon={<Slash size={28} />} label="Grok" active={currentPath === '/grok'} />
        <SidebarLink to="/bookmarks" icon={<Bookmark size={28} />} label="Bookmarks" active={currentPath === '/bookmarks'} />
        <SidebarLink to="/studio" icon={<Rocket size={28} />} label="Creator Studio" active={currentPath === '/studio'} />
        <SidebarLink to="/premium" icon={<BadgeCheck size={28} />} label="Premium" active={currentPath === '/premium'} />
        <SidebarLink to="/profile" icon={<User size={28} />} label="Profile" active={currentPath === '/profile'} />
        
        <button className="bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold rounded-full p-3 mt-4 w-full hidden xl:block shadow-md transition">
          Post
        </button>
        <button className="bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-full p-3 mt-4 w-fit xl:hidden block shadow-md transition mx-auto">
          <Feather size={22} />
        </button>
      </div>
      
      <div className="flex items-center justify-between p-3 hover:bg-[#16181C] rounded-full cursor-pointer transition mb-2">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-[#2F3336]" />
          <div className="hidden xl:block">
            <p className="text-white font-bold text-sm">Ale</p>
            <p className="text-[#71767B] text-sm">@alee_panji</p>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-[#E7E9EA] hidden xl:block" />
      </div>
    </div>
  );
}