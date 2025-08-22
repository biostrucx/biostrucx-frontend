// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/80">
      <div className="text-2xl font-bold">BioStrucX</div>

      <div className="flex items-center gap-6 text-sm">
        <button onClick={() => navigate('/')} className="hover:opacity-80">Home</button>
        {/* ...otros links si quieres... */}
        <button
          onClick={() => navigate('/dashboard/jeimie')}
          className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:opacity-90"
        >
          BioStrucX Live
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

