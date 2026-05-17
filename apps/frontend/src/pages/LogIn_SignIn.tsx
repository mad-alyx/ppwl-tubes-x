import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

// IMPORT KOMPONEN MODULAR YANG BARU SAJA DIPISAHKAN
import AuthInput from '../components/rola/AuthInput';
import XLogo from '../components/rola/XLogo';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false); // Toggle antara Login dan Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fungsi saat tombol login/register manual ditekan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister ? { email, password, name } : { email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan');

      if (!isRegister) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Selamat Datang Kembali di X!', {
          description: `Halo ${data.user?.name || 'User'}, senang melihat Anda kembali.`,
        });

        setTimeout(() => {
          window.location.href = '/beranda'; 
        }, 1500);
      } else {
        toast.info('Registrasi Berhasil!', {
          description: 'Silakan masuk menggunakan akun baru Anda.',
        });
        setIsRegister(false);
      }
    } catch (err: any) {
      // --- MODE BYPASS SEMENTARA (JIKA BACKEND MATI) ---
      if (!isRegister) {
        localStorage.setItem('token', 'token-palsu-ale');
        localStorage.setItem('user', JSON.stringify({ name: 'Ale (Simulasi)', email }));
        
        toast.success('Selamat Datang Kembali di X! (Mode Simulasi)', {
          description: 'Berhasil masuk tanpa backend untuk keperluan testing.',
        });

        setTimeout(() => {
          window.location.href = '/beranda';
        }, 1500);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi jika Google Login Berhasil
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    try {
      const response = await fetch('http://localhost:3000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Google Login Gagal di Server');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login via Google Berhasil!');
      window.location.href = '/beranda';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#000000] text-[#E7E9EA] font-sans antialiased">
      <div className="w-full max-w-md p-8 bg-[#000000] rounded-2xl border border-[#2F3336]">
        
        {/* Logo X Hasil Pemisahan Komponen */}
        <div className="flex justify-center mb-6">
          <XLogo className="h-12 w-12 fill-[#FFFFFF]" />
        </div>

        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight text-[#E7E9EA]">
          {isRegister ? 'Gabung di X sekarang' : 'Masuk ke X'}
        </h2>

        {error && (
          <div className="p-3 bg-[#F4212E]/10 border border-[#F4212E] rounded-lg mb-4 text-center">
            <p className="text-[#F4212E] text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Komponen Tombol Google Sign In */}
        <div className="flex justify-center mb-5 w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Gagal melakukan autentikasi dengan Google')}
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

        {/* Form Login / Register Menggunakan AuthInput Modular */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <AuthInput
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          
          <AuthInput
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <AuthInput
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FFFFFF] text-[#000000] font-bold rounded-full hover:bg-[#E7E9EA] transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : isRegister ? 'Buat Akun' : 'Masuk'}
          </button>
        </form>

        {/* Toggle pemindah Mode Form */}
        <p className="mt-8 text-sm text-[#71767B] text-center">
          {isRegister ? 'Sudah memiliki akun? ' : 'Belum memiliki akun? '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-[#1D9BF0] font-medium hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            {isRegister ? 'Masuk saja' : 'Daftar di sini'}
          </button>
        </p>

      </div>
    </div>
  );
}