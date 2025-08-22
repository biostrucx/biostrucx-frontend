import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Dashboard from './components/Dashboard';
import LiveLoginModal from './components/LiveLoginModal';

export default function App() {
  const [show_login, set_show_login] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar on_open_login={() => set_show_login(true)} />

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/dashboard/:clientid" element={<Dashboard />} />
      </Routes>

      <LiveLoginModal
        is_open={show_login}
        on_close={() => set_show_login(false)}
      />
    </div>
  );
}
