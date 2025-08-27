// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ItemPill = ({ active, children }) => (
  <span
    className={
      // Alto/espaciado consistente + borde sutil
      `inline-flex h-9 items-center px-4 rounded-full text-[12px] tracking-[0.14em] uppercase
       border transition
       ${active
         ? 'bg-white/12 border-white/25 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
         : 'bg-white/[0.04] border-white/10 text-white/90 hover:bg-white/[0.08] hover:border-white/20'}`
    }
  >
    {children}
  </span>
);

const ItemGhost = ({ active, children }) => (
  <span
    className={
      `inline-flex h-9 items-center px-2 text-[12px] tracking-[0.18em] uppercase
       transition
       ${active ? 'text-white' : 'text-white/80 hover:text-white'}`
    }
  >
    {children}
  </span>
);

const LiveBadge = ({ boosted }) => (
  <span
    className={
      `inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[11px] font-semibold tracking-wider
       border ${boosted ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)]' : 'border-red-500/70'}
       text-red-400`
    }
  >
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
    LIVE
  </span>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const isHome = pathname === '/';
  const isLaunchpad = pathname.startsWith('/launchpad');
  const isGW = pathname.startsWith('/global-warming');
  const isLive = pathname.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-50 bg-black/75 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Brand + X */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('/')}
            className="text-xl md:text-[20px] font-extrabold tracking-[0.28em] text-white hover:opacity-90 transition"
            aria-label="BioStrucX Home"
          >
            BIOSTRUCX
          </button>

          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-8 items-center gap-2 px-3 rounded-full border border-white/10 text-white/85
                       bg-white/[0.02] hover:bg-white/[0.08] transition"
            aria-label="Abrir Twitter de BioStrucX"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
            <span className="text-[12px] tracking-wide">Twitter</span>
          </a>
        </div>

        {/* Mobile: More */}
        <button
          className="md:hidden inline-flex items-center justify-center gap-2 p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <div className="flex flex-col">
            <span className={`block h-0.5 w-6 bg-current transition ${open ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current my-1 transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? '-rotate-45 -translate-y-1' : ''}`} />
          </div>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => go('/')}><ItemGhost active={isHome}>Home</ItemGhost></button>

          <button onClick={() => go('/launchpad')}>
            <ItemPill active={isLaunchpad}>Launchpad</ItemPill>
          </button>

          <button onClick={() => go('/global-warming')}>
            <ItemPill active={isGW}>Global&nbsp;Warming</ItemPill>
          </button>

          <div
            onClick={() => go('/dashboard/jeimie')}
            className={
              `inline-flex items-center gap-3 h-9 px-4 rounded-full cursor-pointer border transition 
               ${isLive ? 'bg-white/12 border-white/25' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'}`
            }
            title="Open BioStrucX LIVE"
          >
            <span className="text-[12px] tracking-[0.14em] uppercase text-white">BioStrucX</span>
            <LiveBadge boosted={isLive} />
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-4 pb-4 pt-2 flex flex-col gap-2 text-sm border-t border-white/10 bg-black/80 backdrop-blur-xl">
          <button
            onClick={() => go('/')}
            className={`text-left rounded-lg ${isHome ? 'bg-white/10' : 'hover:bg-white/06'} px-3 py-3`}
          >
            Home
          </button>
          <button
            onClick={() => go('/launchpad')}
            className={`text-left rounded-lg ${isLaunchpad ? 'bg-white/10' : 'hover:bg-white/06'} px-3 py-3`}
          >
            Launchpad
          </button>
          <button
            onClick={() => go('/global-warming')}
            className={`text-left rounded-lg ${isGW ? 'bg-white/10' : 'hover:bg-white/06'} px-3 py-3`}
          >
            Global Warming
          </button>
          <button
            onClick={() => go('/dashboard/jeimie')}
            className={`flex items-center justify-between rounded-lg ${isLive ? 'bg-white/10' : 'hover:bg-white/06'} px-3 py-3`}
          >
            <span>BioStrucX</span>
            <LiveBadge boosted={isLive} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

