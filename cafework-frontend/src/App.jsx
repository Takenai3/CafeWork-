import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import CafeDetailPage from './pages/CafeDetailPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cafes/:id" element={<CafeDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;