import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn_SignIn from './pages/LogIn_SignIn';
import  from './pages/Beranda';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/page-2" element={<Page2 />} />
        </Routes>
    </Router>
  );
}
export default App;