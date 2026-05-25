// apps/frontend/src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login"; // Menggunakan Login Google Auth kelompokmu
import Beranda from "./pages/Beranda";
import { Toaster } from "sonner";

// --- PROTECTED ROUTE DARI NABIL ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// --- HALAMAN DUMMY DARI BRANCH DEV ---
const Explore = () => <div className="text-white p-4">Explore Page</div>;
const Notifikasi = () => <div className="text-white p-4">Halaman Notifikasi</div>;
const Follow = () => <div className="text-white p-4">Follow Page</div>;
const Messages = () => <div className="text-white p-4">Messages Page</div>;
const Grok = () => <div className="text-white p-4">Grok Page</div>;
const Bookmarks = () => <div className="text-white p-4">Bookmarks Page</div>;
const CreatorStudio = () => <div className="text-white p-4">Studio Page</div>;
const Premium = () => <div className="text-white p-4">Premium Page</div>;
const EditProfile = () => <div className="text-white p-4">Halaman Edit Profile</div>;

export default function App() {
  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Rute Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rute Utama Beranda (Dilindungi ProtectedRoute Nabil) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Beranda />
            </ProtectedRoute>
          } 
        />
        
        {/* Rute Pendukung Dummy Lainnya */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifikasi />} />
        <Route path="/follow" element={<Follow />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/grok" element={<Grok />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/studio" element={<CreatorStudio />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* --- RUTE PROSES GOOGLE AUTH KELOMPOKMU --- */}
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
                  
                  if (isNewUser === "true") {
                    localStorage.setItem("needs_onboarding", "true");
                    window.location.href = "/login";
                  } else {
                    window.location.href = "/";
                  }
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
                    {(() => {
                      const params = new URLSearchParams(window.location.search);
                      return params.get("message") || "Terjadi kesalahan yang tidak diketahui saat mencoba masuk.";
                    })()}
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
    </Router>
  );
}