//components/LoginModal.tsx 

import { useState } from "react";
import { fetchApi } from "../../utils/api";
import { XLogo } from "./XLogo";

const isValidEmailFormat = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface LoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal = ({ onSuccess, onClose, onSwitchToRegister }: LoginModalProps) => {
  const [loginStep, setLoginStep] = useState(1);
  const [identifier1, setIdentifier1] = useState("");
  const [identifier2, setIdentifier2] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isId1Email = isValidEmailFormat(identifier1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const finalEmail = isId1Email ? identifier1 : identifier2;
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: finalEmail, password }),
      });
      localStorage.setItem("jwt_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.data));
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-white">
      <div className="bg-black w-full max-w-[600px] min-h-[500px] p-8 rounded-2xl flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 hover:bg-gray-900 rounded-full transition text-white"
        >
          ✕
        </button>
        <XLogo className="h-8 mx-auto mb-8" />

        {/* TAHAP 1: Identifier Awal */}
        {loginStep === 1 && (
          <div className="flex-1 flex flex-col sm:px-12">
            <h2 className="text-3xl font-bold mb-8">Masuk ke X</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => (window.location.href = "http://localhost:3000/api/auth/google")}
                className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <img src="https://www.gstatic.com/images/branding/googleg/svg/google_g_normal.svg" alt="Google" className="w-5 h-5" />
                Masuk dengan Google
              </button>
              <button className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                Masuk dengan Apple
              </button>

              <div className="flex items-center gap-2 my-2">
                <hr className="flex-1 border-gray-800" />
                <span className="text-sm text-gray-500">atau</span>
                <hr className="flex-1 border-gray-800" />
              </div>

              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">
                  Nomor telepon, email, atau nama pengguna
                </label>
                <input
                  type="text"
                  value={identifier1}
                  onChange={(e) => setIdentifier1(e.target.value)}
                  className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3"
                  required
                />
              </div>

              <button
                disabled={!identifier1.trim()}
                onClick={() => setLoginStep(2)}
                className="w-full bg-white text-black font-bold py-3 mt-2 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
              >
                Berikutnya
              </button>
              <button className="w-full border border-gray-700 text-white font-bold py-3 rounded-full hover:bg-gray-900 transition">
                Lupa kata sandi?
              </button>
            </div>
            <p className="mt-8 text-[#71767B]">
              Belum punya akun?{" "}
              <button onClick={onSwitchToRegister} className="text-[#1D9BF0] hover:underline">
                Daftar
              </button>
            </p>
          </div>
        )}

        {/* TAHAP 2: Identifier Pelengkap */}
        {loginStep === 2 && (
          <div className="flex-1 flex flex-col sm:px-12">
            <h2 className="text-3xl font-bold mb-8">
              {isId1Email ? "Masukkan nama pengguna Anda" : "Masukkan email Anda"}
            </h2>
            <div className="flex flex-col flex-1">
              <p className="text-[#71767B] text-sm mb-6">
                Terdapat aktivitas masuk yang tidak biasa di akun Anda. Untuk membantu menjaga keamanan akun Anda,
                silakan masukkan {isId1Email ? "nama pengguna" : "nomor telepon atau email"} Anda untuk memverifikasi bahwa ini memang Anda.
              </p>
              <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group">
                <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">
                  {isId1Email ? "Nama pengguna" : "Nomor telepon atau email"}
                </label>
                <input
                  type="text"
                  value={identifier2}
                  onChange={(e) => setIdentifier2(e.target.value)}
                  className="w-full bg-transparent outline-none text-lg pt-6 pb-2 px-3"
                  required
                />
              </div>
              <div className="mt-auto pt-8">
                <button
                  disabled={!identifier2.trim()}
                  onClick={() => setLoginStep(3)}
                  className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  Berikutnya
                </button>
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
                  <input
                    type="text"
                    className="w-full bg-transparent text-gray-500 outline-none text-lg pt-6 pb-2 px-3 cursor-not-allowed"
                    value={identifier1}
                    disabled
                  />
                </div>

                <div>
                  <div className="relative border border-gray-700 rounded focus-within:border-[#1D9BF0] focus-within:ring-1 focus-within:ring-[#1D9BF0] transition group flex items-center">
                    <label className="absolute top-2 left-3 text-xs text-gray-500 group-focus-within:text-[#1D9BF0] pointer-events-none">
                      Kata Sandi
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-transparent outline-none text-lg pt-6 pb-2 pl-3 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-500 hover:text-white focus:outline-none"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                          <path d="M12 4.5C6.48 4.5 1.73 8.35 0 12c1.73 3.65 6.48 7.5 12 7.5s10.27-3.85 12-7.5c-1.73-3.65-6.48-7.5-12-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                          <path d="M12 4.5C6.48 4.5 1.73 8.35 0 12c1.73 3.65 6.48 7.5 12 7.5s10.27-3.85 12-7.5c-1.73-3.65-6.48-7.5-12-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          <path d="M2.71 3.16l18.13 18.13-1.41 1.41-3.65-3.65C14.62 19.34 13.34 19.5 12 19.5c-5.52 0-10.27-3.85-12-7.5 1.15-2.43 3.12-4.47 5.51-5.76L3.16 2.71 2.71 3.16zm7.25 7.25l4.08 4.08c-.46.33-1.02.51-1.62.51-1.66 0-3-1.34-3-3 0-.6.18-1.16.51-1.62l-2.97-2.97z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button type="button" className="text-[#1D9BF0] text-sm mt-3 hover:underline text-left">
                    Lupa kata sandi?
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <button
                  type="submit"
                  disabled={!password}
                  className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  Masuk
                </button>
              </div>
            </form>

            <p className="mt-8 text-[#71767B]">
              Belum punya akun?{" "}
              <button onClick={onSwitchToRegister} className="text-[#1D9BF0] hover:underline">
                Daftar
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};