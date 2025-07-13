import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDashboard from './pages/ProductDashboard';
import QRSummary from './pages/QRSummary';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDashboard />} />
          <Route path="/qr/:productId" element={<QRSummary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
