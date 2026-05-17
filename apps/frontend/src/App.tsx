import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Beranda from './pages/Beranda';
import Notifikasi from './pages/Notifikasi';
import EditProfile from './pages/EditProfile';
import LogIn_SignIn from './pages/LogIn_SignIn'


const Explore = () => <div className="text-white p-4">Explore Page</div>;
const Follow = () => <div className="text-white p-4">Follow Page</div>;
const Messages = () => <div className="text-white p-4">Messages Page</div>;
const Grok = () => <div className="text-white p-4">Grok Page</div>;
const Bookmarks = () => <div className="text-white p-4">Bookmarks Page</div>;
const CreatorStudio = () => <div className="text-white p-4">Studio Page</div>;
const Premium = () => <div className="text-white p-4">Premium Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifikasi />} />
        <Route path="/follow" element={<Follow />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/grok" element={<Grok />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/studio" element={<CreatorStudio />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/login" element={<LogIn_SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;