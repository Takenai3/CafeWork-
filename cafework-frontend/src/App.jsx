import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import các trang (Pages) của ứng dụng
import HomePage from './pages/HomePage';
import CafeDetailPage from './pages/CafeDetailPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Nơi chứa các Route điều hướng trang */}
        <Routes>
          {/* Route cho trang chủ */}
          <Route path="/" element={<HomePage />} />

          {/* Route cho trang chi tiết quán cafe, có tham số động :id */}
          <Route path="/cafes/:id" element={<CafeDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;