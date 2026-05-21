import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSuccess: (credentialResponse: any) => void;
  onGoogleError: () => void;
  onToggle: () => void;
}

export default function LoginForm({
  email, password, loading, error,
  onEmailChange, onPasswordChange,
  onSubmit, onGoogleSuccess, onGoogleError, onToggle
}: LoginFormProps) {
  return (
    <>
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight text-[#E7E9EA]">
        Masuk ke X
      </h2>

      {error && (
        <div className="p-3 bg-[#F4212E]/10 border border-[#F4212E] rounded-lg mb-4 text-center">
          <p className="text-[#F4212E] text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex justify-center mb-5 w-full">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
          theme="filled_black"
          shape="circle"
          width="380px"
        />
      </div>

      <div className="flex items-center my-5">
        <hr className="grow border-[#2F3336]" />
        <span className="px-3 text-xs text-[#71767B] uppercase font-bold tracking-wider">atau</span>
        <hr className="grow border-[#2F3336]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Alamat Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full p-3.5 bg-[#000000] border border-[#2F3336] rounded-md text-[#E7E9EA] placeholder-[#536471] focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] focus:outline-none transition"
          required
        />
        <input
          type="password"
          placeholder="Kata Sandi"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full p-3.5 bg-[#000000] border border-[#2F3336] rounded-md text-[#E7E9EA] placeholder-[#536471] focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] focus:outline-none transition"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#FFFFFF] text-[#000000] font-bold rounded-full hover:bg-[#E7E9EA] transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-8 text-sm text-[#71767B] text-center">
        Belum memiliki akun?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-[#1D9BF0] font-medium hover:underline bg-transparent border-none p-0 cursor-pointer"
        >
          Daftar di sini
        </button>
      </p>
    </>
  );
}