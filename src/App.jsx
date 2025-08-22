// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/dashboard/:clientid" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
