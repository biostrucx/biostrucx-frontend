// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import Launchpad from './components/Launchpad';
import GlobalWarming from './components/GlobalWarming';

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
   {/* NUEVAS RUTAS INDEPENDIENTES */}
        <Route path="/launchpad" element={<Launchpad />} />
        <Route path="/global-warming" element={<GlobalWarming />} />
      </Routes>
    </BrowserRouter>
  );
}
