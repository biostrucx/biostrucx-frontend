// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/80">
      <div className="text-2xl font-bold">BioStrucX</div>

      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={() => navigate('/')}
          className="hover:opacity-80"
        >
          Home
        </button>

        <div
          onClick={() => navigate('/dashboard/jeimie')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="font-semibold text-white">BioStrucX</span>
          <span className="px-2 py-0.5 text-xs font-bold border border-red-600 text-red-600 rounded-sm hover:bg-red-600 hover:text-white transition">
            LIVE
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


