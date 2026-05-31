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
          <Xlogo className="h-16 lg:h-95 max-w-full" />
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-12">Sedang terjadi sekarang</h1>
          <h2 className="text-3xl font-bold mb-8">Gabung sekarang.</h2>

          <div className="w-full max-w-75 flex flex-col gap-3">
            {/* GANTI BAGIAN INI */}
            <button
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-[#D7DBDC] font-bold py-2.5 rounded-full transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>

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