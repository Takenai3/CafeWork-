import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CafeDetailPage from './pages/CafeDetailPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import Header from './components/layout/Header';
import OwnerLayout from './components/layout/OwnerLayout';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import CafeManagementPage from './pages/owner/CafeManagementPage';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Header /> {/* Fixed Global Header */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/cafes/:id" element={<CafeDetailPage />} />
        
        {/* Owner Routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route path="dashboard" element={<OwnerDashboardPage />} />
          <Route path="cafe-management" element={<CafeManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
