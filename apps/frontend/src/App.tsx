import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LogIn_SignIn';
// 1. Import komponen Toaster dari sonner
import { Toaster } from 'sonner'; 

// Halaman-halaman sementara (Dummy) buat ngetes rute kalau berhasil login
const Beranda = () => <div className="text-white p-5 text-2xl font-bold">Halaman Beranda (Irene)</div>;
const Explore = () => <div className="text-white p-4">Explore Page</div>;
const Notifikasi = () => <div className="text-white p-4">Halaman Notifikasi (Ale)</div>;
const Follow = () => <div className="text-white p-4">Follow Page</div>;
const Messages = () => <div className="text-white p-4">Messages Page</div>;
const Grok = () => <div className="text-white p-4">Grok Page</div>;
const Bookmarks = () => <div className="text-white p-4">Bookmarks Page</div>;
const CreatorStudio = () => <div className="text-white p-4">Studio Page</div>;
const Premium = () => <div className="text-white p-4">Premium Page</div>;
const EditProfile = () => <div className="text-white p-4">Halaman Edit Profile (Ale)</div>;

export default function App() {
  return (
    <Router>
      {/* 2. Taruh Toaster di sini agar popup bisa muncul di atas semua halaman */}
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Pintu masuk utama: localhost:5173 langsung nampilin halaman Login Rola */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rute-rute ini baru bisa diakses kalau dialihkan/diketik manual */}
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifikasi />} />
        <Route path="/follow" element={<Follow />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/grok" element={<Grok />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/studio" element={<CreatorStudio />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/profile" element={<EditProfile />} />

        {/* Jika nyasar ke URL aneh, balikin ke halaman Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}