// apps/frontend/src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // File Tailwind CSS kelompokmu
import { GoogleOAuthProvider } from '@react-oauth/google';

// Tetap pakai Client ID aktif kelompok kalian yang kemarin (Ini contoh ID dari .env backend lu tadi)
const GOOGLE_CLIENT_ID = "770753319528-ifkm4g4oj8cqj51ef3apn58a9dfg4olo.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);