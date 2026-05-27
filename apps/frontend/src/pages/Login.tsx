// pages/Login.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Xlogo from "../components/rola/Xlogo";
import { AuthFlowModal } from "../components//rola/Authflowmodal";
import { LoginModal } from "../components/rola/Loginmodal";

type AuthMode = "landing" | "login";
type FlowType = "google" | "manual";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("landing");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [flowType, setFlowType] = useState<FlowType>("manual");

  useEffect(() => {
    if (localStorage.getItem("needs_onboarding") === "true") {
      setFlowType("google");
      setShowOnboarding(true);
    }
  }, []);

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

  return (
    <>
      {/* Modal Register / Onboarding */}
      {showOnboarding && (
        <AuthFlowModal type={flowType} onComplete={handleFinishOnboarding} />
      )}

      {/* Modal Login */}
      {mode === "login" && (
        <LoginModal
          onSuccess={() => navigate("/")}
          onClose={() => setMode("landing")}
          onSwitchToRegister={handleStartManualFlow}
        />
      )}

      {/* Halaman Landing */}
      <div className="flex flex-col lg:flex-row min-h-screen bg-black text-[#E7E9EA]">
        {/* Kolom Kiri: Logo */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-0">
          <Xlogo className="h-16 lg:h-[380px] max-w-full" />
        </div>

        {/* Kolom Kanan: CTA */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-12">Sedang terjadi sekarang</h1>
          <h2 className="text-3xl font-bold mb-8">Gabung sekarang.</h2>

          <div className="w-full max-w-[300px] flex flex-col gap-3">
            <button
              onClick={() => (window.location.href = import.meta.env.VITE_API_BASE_URL + "/api/auth/google")}
              className="w-full bg-white text-black hover:bg-[#D7DBDC] font-bold py-2.5 rounded-full transition flex items-center justify-center gap-2"
            >
              <img
                src="https://www.gstatic.com/images/branding/googleg/svg/google_g_normal.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Daftar dengan Google
            </button>

            <button className="w-full bg-white text-black hover:bg-[#D7DBDC] font-bold py-2.5 rounded-full transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              Daftar dengan Apple
            </button>

            <div className="flex items-center gap-2 my-1">
              <hr className="flex-1 border-gray-800" />
              <span className="text-sm">atau</span>
              <hr className="flex-1 border-gray-800" />
            </div>

            <button
              onClick={handleStartManualFlow}
              className="w-full bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white font-bold py-2.5 rounded-full transition"
            >
              Buat akun
            </button>

            <div className="mt-10">
              <h3 className="font-bold mb-4">Sudah punya akun?</h3>
              <button
                onClick={() => setMode("login")}
                className="w-full border border-gray-700 text-[#1D9BF0] hover:bg-[#1D9BF0]/10 font-bold py-2.5 rounded-full transition"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}