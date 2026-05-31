//components/rola/Loginmodal.tsx 

import { useState } from "react";
import Xlogo from "./XLogo";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

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

  const { loginWithEmail, isLoading, errorData } = useEmailAuth();
  const { loginWithGoogle } = useGoogleAuth();

  const isId1Email = isValidEmailFormat(identifier1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = isId1Email ? identifier1 : identifier2;
    const success = await loginWithEmail(finalEmail, password);
    if (success) onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-[#242d34]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-white">
      <div className="bg-black w-full max-w-150 min-h-125 p-8 rounded-2xl flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 hover:bg-gray-900 rounded-full transition text-white"
        >
          ✕
        </button>
        <Xlogo className="h-8 mx-auto mb-8" />

        {/* TAHAP 1 */}
        {loginStep === 1 && (
          <div className="flex-1 flex flex-col sm:px-12">
            <h2 className="text-3xl font-bold mb-8">Masuk ke X</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => loginWithGoogle()}
                className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Masuk dengan Google
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

        {/* TAHAP 2 */}
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

        {/* TAHAP 3 */}
        {loginStep === 3 && (
          <div className="flex-1 flex flex-col sm:px-12">
            <h2 className="text-3xl font-bold mb-8">Masukkan kata sandi Anda</h2>
            {errorData && <div className="bg-red-500/20 text-red-500 p-3 rounded mb-6 text-sm">{errorData?.message || 'Login gagal'}</div>}

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
                  disabled={!password || isLoading}
                  className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
                >
                  {isLoading ? "Memuat..." : "Masuk"}
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