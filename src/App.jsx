// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import RealtimeDemo from './components/RealtimeDemo';

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/dashboard/:clientid" element={<Dashboard />} />
        <Route path="/realtime-demo" element={<RealtimeDemo />} /> {/* ✅ ahora sí dentro de Routes */}
      </Routes>
    </div>
  );
}
