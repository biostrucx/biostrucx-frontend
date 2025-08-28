// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LiveBadge = ({ active }) => (
  <span
    className={`ml-2 text-[12px] font-bold tracking-widest uppercase ${
      active ? 'text-red-500 animate-pulse' : 'text-red-500'
    }`}
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
        
        {/* Left: X + Logo */}
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition"
            aria-label="BioStrucX Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
          </a>

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
            className={`uppercase ${isHome ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            Home
          </button>
          <button
            onClick={() => go('/launchpad')}
            className={`uppercase ${isLaunchpad ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            Launchpad
          </button>
          <button
            onClick={() => go('/global-warming')}
            className={`uppercase ${isGW ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            Global Warming
          </button>
          <button
            onClick={() => go('/dashboard/jeimie')}
            className={`uppercase flex items-center ${
              isLive ? 'text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            BioStrucX
            <LiveBadge active={isLive} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 flex flex-col px-4 py-3 space-y-2 text-sm font-semibold">
          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-5 w-5"
            >
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
          </a>
          <button onClick={() => go('/')} className={`${isHome ? 'text-white' : 'text-white/80 hover:text-white'}`}>Home</button>
          <button onClick={() => go('/launchpad')} className={`${isLaunchpad ? 'text-white' : 'text-white/80 hover:text-white'}`}>Launchpad</button>
          <button onClick={() => go('/global-warming')} className={`${isGW ? 'text-white' : 'text-white/80 hover:text-white'}`}>Global Warming</button>
          <button onClick={() => go('/dashboard/jeimie')} className={`flex items-center ${isLive ? 'text-white' : 'text-white/80 hover:text-white'}`}>
            BioStrucX
            <LiveBadge active={isLive} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


