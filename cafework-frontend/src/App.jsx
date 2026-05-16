import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CafeDetailPage from './pages/CafeDetailPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import Header from './components/layout/Header';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        {/* You can add more routes here, like /owner/dashboard */}
        <Route path="/cafes/:id" element={<CafeDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
