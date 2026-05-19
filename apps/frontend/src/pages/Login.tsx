// apps/frontend/src/pages/Login.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/api";

type AuthMode = "landing" | "login";
type FlowType = "google" | "manual";

const isValidEmailFormat = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- KOMPONEN MODAL OTENTIKASI & ONBOARDING ---
const AuthFlowModal = ({ type, onComplete }: { type: FlowType, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: { month: "", day: "", year: "" },
    username: "",
    selectedTopics: [] as string[]
  });
  const [error, setError] = useState("");

  const showEmailError = formData.email.length > 0 && !isValidEmailFormat(formData.email);

  const handleNext = () => setStep(step + 1);

  const handleManualRegister = async () => {
    try {
      setError("");
      if (formData.password !== formData.confirmPassword) {
        setError("Kata sandi tidak cocok.");
        return;
      }
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        }),
      });
      const loginRes = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      localStorage.setItem("jwt_token", loginRes.token);
      localStorage.setItem("user_data", JSON.stringify(loginRes.data));
      handleNext();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFinish = async () => {
    try {
      if (formData.username.trim()) {
        await fetchApi("/user/profile", {
          method: "PUT",
          body: JSON.stringify({ name: formData.username }),
        });
      }
    } catch (e) {
      console.error("Gagal simpan profil", e);
    } finally {
      onComplete();
    }
  };

  const toggleTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTopics: prev.selectedTopics.includes(topic) 
        ? prev.selectedTopics.filter(t => t !== topic)
        : [...prev.selectedTopics, topic]
    }));
  };

  const XLogo = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 fill-white mx-auto mb-6">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-white">
      <div className="bg-black w-full max-w-[600px] min-h-[500px] max-h-[90vh] rounded-2xl flex flex-col p-8 relative overflow-y-auto">
        <button onClick={() => window.location.reload()} className="absolute top-4 left-4 p-2 hover:bg-gray-900 rounded-full transition text-white">✕</button>
        <XLogo />

        {type === "manual" && step === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-8">Buat akun Anda</h2>
            <div className="flex flex-col gap-6 mb-8">
               <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                  <div className="absolute top-2 w-full flex justify-between px-3 pointer-events-none">
                    <label className="text-xs text-gray-500 group-focus-within:text-[#1D9BF0]">Nama</label>
                    <span className="text-xs text-gray-500 hidden group-focus-within:block">{formData.name.length} / 50</span>
                  </div>
                  <input type="text" maxLength={50} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3" />
               </div>
               <div>
                 <div className={`relative border rounded transition group ${showEmailError ? 'border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' : 'border-gray-700 focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0]'}`}>
                    <label className={`absolute top-2 left-3 text-xs pointer-events-none ${showEmailError ? 'text-red-500' : 'text-gray-500 group-focus-within:text-[#1D9BF0]'}`}>Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3" />
                 </div>
                 {showEmailError && <p className="text-red-500 text-sm mt-1 ml-1">Silakan masukkan email yang valid.</p>}
               </div>
            </div>
            <h3 className="font-bold mb-1">Tanggal lahir</h3>
            <p className="text-[#71767B] text-xs mb-4">Informasi ini tidak akan ditampilkan secara publik. Konfirmasikan usia Anda sendiri, meskipun akun ini untuk bisnis, hewan peliharaan, atau hal lainnya.</p>
            <div className="flex gap-4">
              <div className="flex-2 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
                <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Bulan</label>
                <select className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, dob: {...formData.dob, month: e.target.value}})}>
                  <option value="" disabled selected className="hidden"></option>
                  {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => <option key={m} className="bg-black">{m}</option>)}
                </select>
              </div>
              <div className="flex-1 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
                <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Hari</label>
                <select className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, dob: {...formData.dob, day: e.target.value}})}>
                  <option value="" disabled selected className="hidden"></option>
                  {Array.from({length: 31}, (_, i) => <option key={i+1} className="bg-black">{i+1}</option>)}
                </select>
              </div>
              <div className="flex-1 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
                <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Tahun</label>
                <select className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, dob: {...formData.dob, year: e.target.value}})}>
                  <option value="" disabled selected className="hidden"></option>
                  {Array.from({length: 100}, (_, i) => <option key={i} className="bg-black">{2024 - i}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-auto pt-8 flex justify-end">
                <button disabled={!formData.name || !formData.email || showEmailError || !formData.dob.month || !formData.dob.day || !formData.dob.year} onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:bg-gray-500 transition">Berikutnya</button>
            </div>
          </div>
        )}

        {type === "manual" && step === 2 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Anda memerlukan kata sandi</h2>
            <p className="text-[#71767B] mb-8">Pastikan kata sandi Anda memiliki 6 karakter atau lebih agar tetap aman.</p>
            <div className="flex flex-col gap-5">
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                  <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Kata Sandi</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3" />
              </div>
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                  <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Konfirmasi Kata Sandi</label>
                  <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3" />
              </div>
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-2 ml-1">Kata sandi tidak cocok.</p>
            )}
            {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
            <div className="mt-auto pt-8 flex justify-end">
                <button disabled={formData.password.length < 6 || formData.password !== formData.confirmPassword} onClick={handleManualRegister} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition">Daftar</button>
            </div>
          </div>
        )}

        {type === "google" && step === 1 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Kapan tanggal lahir Anda?</h2>
            <p className="text-[#71767B] mb-8">Ini tidak akan ditampilkan secara publik.</p>
            <div className="flex gap-4">
               <div className="flex-2 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
                <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Bulan</label>
                <select className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, dob: {...formData.dob, month: e.target.value}})}>
                  <option value="" disabled selected className="hidden"></option>
                  {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map(m => <option key={m} className="bg-black">{m}</option>)}
                </select>
              </div>
              <div className="flex-1 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
                <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Hari</label>
                <select className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, dob: {...formData.dob, day: e.target.value}})}>
                  <option value="" disabled selected className="hidden"></option>
                  {Array.from({length: 31}, (_, i) => <option key={i+1} className="bg-black">{i+1}</option>)}
                </select>
              </div>
              <div className="flex-1 relative border border-gray-700 rounded focus-within:border-[#1D9BF0] group">
                <label className="absolute top-1 left-2 text-[10px] text-gray-500 group-focus-within:text-[#1D9BF0]">Tahun</label>
                <select className="w-full bg-transparent p-2 pt-5 rounded outline-none text-white appearance-none cursor-pointer" onChange={(e) => setFormData({...formData, dob: {...formData.dob, year: e.target.value}})}>
                  <option value="" disabled selected className="hidden"></option>
                  {Array.from({length: 100}, (_, i) => <option key={i} className="bg-black">{2024 - i}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-auto pt-8 flex justify-end">
                <button disabled={!formData.dob.month || !formData.dob.day || !formData.dob.year} onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition">Berikutnya</button>
            </div>
          </div>
        )}

        {((type === "google" && step === 2) || (type === "manual" && step === 3)) && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Siapa nama panggilan Anda?</h2>
            <p className="text-[#71767B] mb-8">Username @ Anda unik. Anda selalu bisa mengubahnya nanti.</p>
            <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
              <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Nama Pengguna</label>
              <span className="absolute left-3 top-6 text-white">@</span>
              <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 pl-8 pr-3" />
            </div>
            <button className="text-[#1D9BF0] text-sm mt-4 text-left hover:underline" onClick={handleNext}>Lewati untuk saat ini</button>
            <div className="mt-auto pt-8 flex justify-end">
                <button onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition">Berikutnya</button>
            </div>
          </div>
        )}

        {((type === "google" && step === 3) || (type === "manual" && step === 4)) && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold mb-2">Nyalakan notifikasi</h2>
            <p className="text-[#71767B] mb-8">Dapatkan hasil maksimal dari X dengan tetap mengikuti perkembangan terkini.</p>
            <button onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full mb-4 hover:bg-gray-200 transition">Izinkan notifikasi</button>
            <button onClick={handleNext} className="w-full border border-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-900 transition">Nanti saja</button>
          </div>
        )}

        {((type === "google" && step === 4) || (type === "manual" && step === 5)) && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Apa yang ingin Anda lihat di X?</h2>
            <p className="text-[#71767B] mb-8">Pilih yang Anda suka, dan kami akan menyesuaikan pengalaman Anda.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['Tarian', 'Bola Basket', 'Bisnis', 'Kripto', 'Sains', 'Mode', 'Makanan', 'Musik', 'Permainan'].map(topic => {
                const isSelected = formData.selectedTopics.includes(topic);
                return (
                  <button key={topic} onClick={() => toggleTopic(topic)} className={`relative border rounded-xl p-4 h-20 flex items-end font-bold transition text-left ${isSelected ? 'bg-[#1D9BF0] border-[#1D9BF0]' : 'border-gray-700 hover:bg-[#1D9BF0]/10'}`}>
                    {isSelected && <div className="absolute top-2 right-2 bg-white text-[#1D9BF0] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</div>}
                    {topic}
                  </button>
                );
              })}
            </div>
            <div className="mt-auto pt-4 flex justify-end">
                <button disabled={formData.selectedTopics.length === 0} onClick={handleNext} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition">Berikutnya</button>
            </div>
          </div>
        )}

        {((type === "google" && step === 5) || (type === "manual" && step === 6)) && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-2">Pilih bahasa</h2>
            <p className="text-[#71767B] mb-8">Postingan, orang, dan tren akan disesuaikan dengan bahasa pilihan Anda.</p>
            <label className="flex items-center justify-between p-4 border border-[#1D9BF0] rounded-xl">
              <span className="font-bold">Bahasa Indonesia</span>
              <input type="checkbox" checked readOnly className="w-5 h-5 accent-[#1D9BF0]" />
            </label>
            <div className="mt-auto pt-8 flex justify-end">
                <button onClick={handleFinish} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition">Selesai</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA HALAMAN LOGIN ---
export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("landing");
  
  // State Login Multi-Step
  const [loginStep, setLoginStep] = useState(1);
  const [identifier1, setIdentifier1] = useState("");
  const [identifier2, setIdentifier2] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [flowType, setFlowType] = useState<FlowType>("manual");

  useEffect(() => {
    if (localStorage.getItem("needs_onboarding") === "true") {
      setFlowType("google");
      setShowOnboarding(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Menentukan data mana yang berisi struktur email untuk dikirim ke API
      const finalEmail = isValidEmailFormat(identifier1) ? identifier1 : identifier2;

      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: finalEmail, password }),
      });
      localStorage.setItem("jwt_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.data));
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStartManualFlow = () => {
    setMode("landing");
    setFlowType("manual");
    setShowOnboarding(true);
  };

  const handleFinishOnboarding = () => {
    localStorage.removeItem("needs_onboarding");
    setShowOnboarding(false);
    navigate("/");
  };

  const isId1Email = isValidEmailFormat(identifier1);

  const XLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
  );

  return (
    <>
      {showOnboarding && <AuthFlowModal type={flowType} onComplete={handleFinishOnboarding} />}

      <div className="flex flex-col lg:flex-row min-h-screen bg-black text-[#E7E9EA]">
        <div className="flex-1 flex items-center justify-center p-8 lg:p-0">
          <XLogo className="h-16 lg:h-[380px] max-w-full" />
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-12">Sedang terjadi sekarang</h1>
          <h2 className="text-3xl font-bold mb-8">Gabung sekarang.</h2>

          <div className="w-full max-w-[300px] flex flex-col gap-3">
            <button onClick={() => window.location.href = "http://localhost:3000/api/auth/google"} className="w-full bg-white text-black hover:bg-[#D7DBDC] font-bold py-2.5 rounded-full transition flex items-center justify-center gap-2">
              <img src="https://www.gstatic.com/images/branding/googleg/svg/google_g_normal.svg" alt="Google" className="w-5 h-5" />
              Daftar dengan Google
            </button>
            
            <button className="w-full bg-white text-black hover:bg-[#D7DBDC] font-bold py-2.5 rounded-full transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              Daftar dengan Apple
            </button>

            <div className="flex items-center gap-2 my-1">
              <hr className="flex-1 border-gray-800" />
              <span className="text-sm">atau</span>
              <hr className="flex-1 border-gray-800" />
            </div>

            <button onClick={handleStartManualFlow} className="w-full bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white font-bold py-2.5 rounded-full transition">Buat akun</button>
            
            <div className="mt-10">
              <h3 className="font-bold mb-4">Sudah punya akun?</h3>
              <button onClick={() => { setMode("login"); setLoginStep(1); setError(""); setIdentifier1(""); setIdentifier2(""); setPassword(""); }} className="w-full border border-gray-700 text-[#1D9BF0] hover:bg-[#1D9BF0]/10 font-bold py-2.5 rounded-full transition">Masuk</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL LOGIN MULTI-STEP --- */}
      {mode === "login" && (
        <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-white">
          <div className="bg-black w-full max-w-[600px] min-h-[500px] p-8 rounded-2xl flex flex-col relative">
            <button onClick={() => { setMode("landing"); setLoginStep(1); setError(""); }} className="absolute top-4 left-4 p-2 hover:bg-gray-900 rounded-full transition text-white">✕</button>
            <XLogo className="h-8 mx-auto mb-8" />
            
            {/* TAHAP 1: Identifier Awal */}
            {loginStep === 1 && (
              <div className="flex-1 flex flex-col sm:px-12">
                <h2 className="text-3xl font-bold mb-8">Masuk ke X</h2>
                
                <div className="flex flex-col gap-4">
                  <button onClick={() => window.location.href = "http://localhost:3000/api/auth/google"} className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition flex items-center justify-center gap-2">
                    <img src="https://www.gstatic.com/images/branding/googleg/svg/google_g_normal.svg" alt="Google" className="w-5 h-5" />
                    Masuk dengan Google
                  </button>
                  <button className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                    Masuk dengan Apple
                  </button>

                  <div className="flex items-center gap-2 my-2">
                    <hr className="flex-1 border-gray-800" />
                    <span className="text-sm text-gray-500">atau</span>
                    <hr className="flex-1 border-gray-800" />
                  </div>

                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Nomor telepon, email, atau nama pengguna</label>
                    <input type="text" value={identifier1} onChange={(e) => setIdentifier1(e.target.value)} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3" required />
                  </div>

                  <button disabled={!identifier1.trim()} onClick={() => setLoginStep(2)} className="w-full bg-white text-black font-bold py-3 mt-2 rounded-full hover:bg-gray-200 disabled:opacity-50 transition">Berikutnya</button>
                  <button className="w-full border border-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-900 transition">Lupa kata sandi?</button>
                </div>
                
                <p className="mt-8 text-[#71767B]">Belum punya akun? <button onClick={handleStartManualFlow} className="text-[#1D9BF0] hover:underline">Daftar</button></p>
              </div>
            )}

            {/* TAHAP 2: Identifier Pelengkap */}
            {loginStep === 2 && (
              <div className="flex-1 flex flex-col sm:px-12">
                <h2 className="text-3xl font-bold mb-8">
                  {isId1Email ? "Masukkan nama pengguna Anda" : "Masukkan email Anda"}
                </h2>
                
                <div className="flex flex-col flex-1">
                  <p className="text-[#71767B] text-sm mb-6">Terdapat aktivitas masuk yang tidak biasa di akun Anda. Untuk membantu menjaga keamanan akun Anda, silakan masukkan {isId1Email ? "nama pengguna" : "nomor telepon atau email"} Anda untuk memverifikasi bahwa ini memang Anda.</p>
                  
                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">
                      {isId1Email ? "Nama pengguna" : "Nomor telepon atau email"}
                    </label>
                    <input type="text" value={identifier2} onChange={(e) => setIdentifier2(e.target.value)} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3" required />
                  </div>

                  <div className="mt-auto pt-8">
                    <button disabled={!identifier2.trim()} onClick={() => setLoginStep(3)} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition">Berikutnya</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAHAP 3: Kata Sandi */}
            {loginStep === 3 && (
              <div className="flex-1 flex flex-col sm:px-12">
                <h2 className="text-3xl font-bold mb-8">Masukkan kata sandi Anda</h2>
                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}
                
                <form onSubmit={handleLogin} className="flex flex-col flex-1">
                  <div className="flex flex-col gap-6">
                    <div className="relative border border-gray-700 bg-gray-900/50 rounded transition group cursor-not-allowed">
                      <label className="absolute top-2 left-3 text-xs text-gray-500 pointer-events-none">
                        {isId1Email ? "Email" : "Nama Pengguna"}
                      </label>
                      <input type="text" className="w-full bg-transparent text-gray-500 outline-none text-lg pt-6 pb-2 px-3 cursor-not-allowed" value={identifier1} disabled />
                    </div>

                    <div>
                      <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group flex items-center">
                        <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">Kata Sandi</label>
                        <input type={showPassword ? "text" : "password"} className="w-full bg-transparent outline-none text-lg pt-6 pb-2 pl-3 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500 hover:text-white focus:outline-none">
                          {showPassword ? (
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M12 4.5C6.48 4.5 1.73 8.35 0 12c1.73 3.65 6.48 7.5 12 7.5s10.27-3.85 12-7.5c-1.73-3.65-6.48-7.5-12-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M12 4.5C6.48 4.5 1.73 8.35 0 12c1.73 3.65 6.48 7.5 12 7.5s10.27-3.85 12-7.5c-1.73-3.65-6.48-7.5-12-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path><path d="M2.71 3.16l18.13 18.13-1.41 1.41-3.65-3.65C14.62 19.34 13.34 19.5 12 19.5c-5.52 0-10.27-3.85-12-7.5 1.15-2.43 3.12-4.47 5.51-5.76L3.16 2.71 2.71 3.16zm7.25 7.25l4.08 4.08c-.46.33-1.02.51-1.62.51-1.66 0-3-1.34-3-3 0-.6.18-1.16.51-1.62l-2.97-2.97z" fill="#000" className="hidden"></path></svg>
                          )}
                        </button>
                      </div>
                      <button type="button" className="text-[#1D9BF0] text-sm mt-3 hover:underline text-left">Lupa kata sandi?</button>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <button type="submit" disabled={!password} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition">Masuk</button>
                  </div>
                </form>
                
                <p className="mt-8 text-[#71767B]">Belum punya akun? <button onClick={handleStartManualFlow} className="text-[#1D9BF0] hover:underline">Daftar</button></p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}