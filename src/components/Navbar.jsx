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
        
        {/* Left: Logo */}
        <button
          onClick={() => go('/')}
          className="text-lg md:text-xl font-extrabold tracking-[0.25em] text-white hover:opacity-80 transition"
        >
          BIOSTRUCX
        </button>

        {/* Mobile menu button (hamburguesa animada) */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">Open main menu</span>
          <div className="relative w-6 h-5">
            <span className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform ${open ? 'translate-y-2.5 rotate-45' : ''}`} />
            <span className={`absolute left-0 top-2.5 h-0.5 w-6 bg-current transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 bottom-0 h-0.5 w-6 bg-current transition-transform ${open ? '-translate-y-2.5 -rotate-45' : ''}`} />
          </div>
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

          {/* Twitter button (desktop, tal cual) */}
          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/80 hover:text-white transition uppercase text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-4 w-4"
            >
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
            Twitter
          </a>
        </div>
      </div>

      {/* Mobile dropdown (slide-down mejorado) */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[60vh]' : 'max-h-0'}`}
      >
        <div className="bg-black/95 backdrop-blur-xl border-top border-white/10">
          <div className="px-4 pt-3 pb-2 text-xs uppercase text-white/50">Menu</div>
          <div className="px-2">
            <button
              onClick={() => go('/')}
              className={`w-full h-12 px-3 text-left uppercase text-[14px] font-semibold tracking-wider rounded-md
                          ${isHome ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
            >
              Home
            </button>
            <div className="h-px bg-white/10 mx-3" />
            <button
              onClick={() => go('/launchpad')}
              className={`w-full h-12 px-3 text-left uppercase text-[14px] font-semibold tracking-wider rounded-md
                          ${isLaunchpad ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
            >
              Launchpad
            </button>
            <div className="h-px bg-white/10 mx-3" />
            <button
              onClick={() => go('/global-warming')}
              className={`w-full h-12 px-3 text-left uppercase text-[14px] font-semibold tracking-wider rounded-md
                          ${isGW ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
            >
              Global Warming
            </button>
            <div className="h-px bg-white/10 mx-3" />
            <button
              onClick={() => go('/dashboard/jeimie')}
              className={`w-full h-12 px-3 flex items-center justify-between uppercase text-[14px] font-semibold tracking-wider rounded-md
                          ${isLive ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
            >
              <span>BioStrucX</span>
              <LiveBadge active={isLive} />
            </button>

            {/* Social row */}
            <div className="h-px bg-white/10 mx-3 my-2" />
            <div className="px-1 py-3 flex items-center gap-3">
              <a
                href="https://x.com/BiostrucX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition"
                aria-label="Open BioStrucX on X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="pb-2" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



