// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-black/80">
      {/* izquierda: logo + twitter */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">BioStrucX</div>
        <button
          onClick={() => window.open('https://twitter.com/tu_cuenta', '_blank')}
          className="px-2 py-1 rounded-full border border-white/30 text-sm hover:bg-white/10"
        >
          ✕ Twitter
        </button>
      </div>

      {/* derecha: links */}
      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={() => navigate('/')}
          className="hover:opacity-80"
        >
          Home
        </button>

        {/* NUEVOS BOTONES */}
        <button
          onClick={() => navigate('/launchpad')}
          className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10"
        >
          LAUNCHPAD
        </button>

        <button
          onClick={() => navigate('/global-warming')}
          className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10"
        >
          GLOBAL&nbsp;WARMING
        </button>

        {/* badge LIVE opcional */}
        <span className="ml-2 px-2 py-0.5 text-xs rounded-md border border-red-500/70 text-red-300">
          LIVE
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
