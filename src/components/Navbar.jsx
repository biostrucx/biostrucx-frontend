// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // menú móvil

  const go = (path) => {
    setOpen(false);        // cierra menú al navegar en móvil
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Izquierda: Brand + Twitter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('/')}
            className="text-2xl font-bold text-white"
            aria-label="BioStrucX Home"
          >
            BioStrucX
          </button>

          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/30 text-white/90 hover:bg-white hover:text-black transition"
            aria-label="Abrir Twitter de BioStrucX"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
            <span className="text-sm font-medium">Twitter</span>
          </a>
        </div>

        {/* Botón "More" (hamburguesa) solo móvil */}
        <button
          className="md:hidden inline-flex items-center justify-center gap-2 p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {/* Icono hamburguesa / X */}
          <div className="flex flex-col">
            <span className={`block h-0.5 w-5 bg-current transition ${open ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block h-0.5 w-5 bg-current my-1 transition ${open ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-5 bg-current transition ${open ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>

          {/* Texto "More" con subrayado fijo */}
          <span className="relative text-sm font-semibold">
            More
            <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-white"></span>
          </span>
        </button>

        {/* Derecha: menú desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => go('/')} className="text-white/90 hover:opacity-80">Home</button>

          <button
            onClick={() => go('/launchpad')}
            className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10"
          >
            LAUNCHPAD
          </button>

          <button
            onClick={() => go('/global-warming')}
            className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10"
          >
            GLOBAL&nbsp;WARMING
          </button>

          <div
            onClick={() => go('/dashboard/jeimie')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="font-semibold text-white">BioStrucX</span>
            <span className="px-2 py-0.5 text-xs font-bold border border-red-600 text-red-600 rounded-sm hover:bg-red-600 hover:text-white transition">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-64' : 'max-h-0'}`}
      >
        <div className="px-4 pb-4 pt-2 flex flex-col gap-2 text-sm border-t border-white/10">
          <button onClick={() => go('/')} className="text-left px-3 py-2 rounded hover:bg-white/10">Home</button>
          <button onClick={() => go('/launchpad')} className="text-left px-3 py-2 rounded hover:bg-white/10">LAUNCHPAD</button>
          <button onClick={() => go('/global-warming')} className="text-left px-3 py-2 rounded hover:bg-white/10">GLOBAL WARMING</button>
          <button onClick={() => go('/dashboard/jeimie')} className="text-left px-3 py-2 rounded hover:bg-white/10">
            BioStrucX <span className="ml-2 px-2 py-0.5 text-[10px] font-bold border border-red-600 text-red-400 rounded-sm">LIVE</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




