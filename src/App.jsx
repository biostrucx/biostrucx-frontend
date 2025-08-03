import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen relative z-0">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <LoginPage />
                <HeroSection />
              </>
            }
          />
          <Route path="/dashboard/cliente_1" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
