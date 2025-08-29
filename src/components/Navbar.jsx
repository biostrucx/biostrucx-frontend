// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-black/80">
      {/* Izquierda: Brand + Twitter */}
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-white">BioStrucX</div>

        {/* Botón Twitter */}
        <a
          href="https://x.com/BiostrucX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 text-white/90 hover:bg-white hover:text-black transition"
          aria-label="Abrir Twitter de BioStrucX"
        >
          {/* Icono X/Twitter */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
          </svg>
          <span className="text-sm font-medium">Twitter</span>
        </a>
      </div>

      {/* Derecha: Home + Launchpad + Global Warming + BioStrucX LIVE */}
      <div className="flex items-center gap-6 text-sm">
        <button onClick={() => navigate('/')} className="text-white/90 hover:opacity-80">
          Home
        </button>

        {/* Botón Launchpad */}
        <button
          onClick={() => navigate('/launchpad')}
          className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10"
        >
          LAUNCHPAD
        </button>

        {/* Botón Global Warming */}
        <button
          onClick={() => navigate('/global-warming')}
          className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10"
        >
          GLOBAL&nbsp;WARMING
        </button>

        {/* BioStrucX LIVE estilo NASA */}
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





