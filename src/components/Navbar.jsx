// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LiveBadge = ({ active }) => (
  <span
    className={
      `ml-2 text-[12px] font-bold tracking-widest uppercase
       ${active ? 'text-red-500 animate-pulse' : 'text-red-500'}`
    }
  >
    ● Live
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
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => go('/')}
            className="text-lg md:text-xl font-extrabold tracking-[0.25em] text-white hover:opacity-80 transition"
          >
            BIOSTRUCX
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        {/* Right: Menu (desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider">
          <button
            onClick={() => go('/')}
            className={`uppercase ${isHome ? 'text-white' : 'text-white/70 hover:text-white'}`}
          >
            Home
          </button>
          <button
            onClick={() => go('/launchpad')}
            className={`uppercase ${isLaunchpad ? 'text-white' : 'text-white/70 hover:text-white'}`}
          >
            Launchpad
          </button>
          <button
            onClick={() => go('/global-warming')}
            className={`uppercase ${isGW ? 'text-white' : 'text-white/70 hover:text-white'}`}
          >
            Global Warming
          </button>
          <button
            onClick={() => go('/dashboard/jeimie')}
            className="uppercase text-white hover:opacity-80 flex items-center"
          >
            BioStrucX
            <LiveBadge active={isLive} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 flex flex-col px-4 py-3 space-y-2 text-sm font-semibold">
          <button onClick={() => go('/')} className={`${isHome ? 'text-white' : 'text-white/70 hover:text-white'}`}>Home</button>
          <button onClick={() => go('/launchpad')} className={`${isLaunchpad ? 'text-white' : 'text-white/70 hover:text-white'}`}>Launchpad</button>
          <button onClick={() => go('/global-warming')} className={`${isGW ? 'text-white' : 'text-white/70 hover:text-white'}`}>Global Warming</button>
          <button onClick={() => go('/dashboard/jeimie')} className="flex items-center text-white">
            BioStrucX
            <LiveBadge active={isLive} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

