import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // File Tailwind CSS kelompokmu
import { GoogleOAuthProvider } from '@react-oauth/google'

// Ganti string di bawah ini dengan Client ID dari Google Cloud Console nantinya
const GOOGLE_CLIENT_ID = "123456789-contohidgoogle.apps.googleusercontent.com"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
