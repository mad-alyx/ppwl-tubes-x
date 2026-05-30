// pages/Login.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Xlogo from "../components/rola/XLogo";
import { AuthFlowModal } from "../components//rola/Authflowmodal";
import { LoginModal } from "../components/rola/Loginmodal";
import { useGoogleAuth } from "../hooks/useGoogleAuth"; // TAMBAH INI

type AuthMode = "landing" | "login";
type FlowType = "google" | "manual";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("landing");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [flowType, setFlowType] = useState<FlowType>("manual");
  const { loginWithGoogle, isLoading } = useGoogleAuth(); // TAMBAH INI

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
      {showOnboarding && (
        <AuthFlowModal type={flowType} onComplete={handleFinishOnboarding} />
      )}

      {mode === "login" && (
        <LoginModal
          onSuccess={() => navigate("/")}
          onClose={() => setMode("landing")}
          onSwitchToRegister={handleStartManualFlow}
        />
      )}

      <div className="flex flex-col lg:flex-row min-h-screen bg-black text-[#E7E9EA]">
        <div className="flex-1 flex items-center justify-center p-8 lg:p-0">
          <Xlogo className="h-16 lg:h-[380px] max-w-full" />
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-12">Sedang terjadi sekarang</h1>
          <h2 className="text-3xl font-bold mb-8">Gabung sekarang.</h2>

          <div className="w-full max-w-[300px] flex flex-col gap-3">
            {/* GANTI BAGIAN INI */}
            <button
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-[#D7DBDC] font-bold py-2.5 rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <img
                src="https://www.gstatic.com/images/branding/googleg/svg/google_g_normal.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {isLoading ? "Memuat..." : "Daftar dengan Google"}
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