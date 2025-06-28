import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Mantén esto
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import HeroSection from './components/HeroSection';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;




