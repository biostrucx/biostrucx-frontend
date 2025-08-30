// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import Launchpad from './components/Launchpad';
import Launchpad from './components/AboutUs';
import GlobalWarming from './components/GlobalWarming';

export default function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/dashboard/:clientid" element={<Dashboard />} />
        <Route path="/launchpad" element={<Launchpad />} />
         <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/global-warming" element={<GlobalWarming />} />
        {/* opcional: redirige/cae al home */}
        <Route path="*" element={<HeroSection />} />
      </Routes>
    </div>
  );
}
