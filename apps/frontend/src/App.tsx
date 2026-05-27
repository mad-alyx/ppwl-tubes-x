import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman utama (/) langsung menampilkan login */}
        <Route path="/" element={<Login />} />
        
        {/* Jika user mengetik url aneh-aneh, paksa balik ke login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}