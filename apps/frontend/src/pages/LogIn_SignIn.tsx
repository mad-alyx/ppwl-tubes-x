import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignInForm from '../components/SignInForm';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        alert('Login Berhasil!');
        window.location.href = '/beranda';
      } else {
        alert('Registrasi Berhasil! Silakan masuk menggunakan akun baru Anda.');
        setIsRegister(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#000000] text-[#E7E9EA] font-sans antialiased">
      <div className="w-full max-w-md p-8 bg-[#000000] rounded-2xl border border-[#2F3336]">
        
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" className="h-12 w-12 fill-[#FFFFFF]">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>

        {isRegister ? (
          <SignInForm
            email={email} password={password} name={name}
            loading={loading} error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onNameChange={setName}
            onSubmit={handleSubmit}
            onToggle={handleToggle}
          />
        ) : (
          <LoginForm
            email={email} password={password}
            loading={loading} error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            onGoogleSuccess={handleGoogleSuccess}
            onGoogleError={() => setError('Gagal melakukan autentikasi dengan Google')}
            onToggle={handleToggle}
          />
        )}

      </div>
    </div>
  );
}