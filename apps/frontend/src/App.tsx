// apps/frontend/src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Timeline from "./pages/Timeline";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Timeline />
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
                  
                  if (isNewUser === "true") {
                    localStorage.setItem("needs_onboarding", "true");
                    // Arahkan kembali ke halaman Login untuk menampilkan Pop-up Onboarding
                    window.location.href = "/login";
                  } else {
                    // Jika pengguna lama, langsung masuk ke Beranda
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
    </BrowserRouter>
  );
}