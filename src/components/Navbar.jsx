// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkUnderline = ({ children }) => (
  <span className="relative inline-block tracking-[0.08em]">
    <span className="opacity-90">{children}</span>
    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white/90 transition-all duration-300 group-hover:w-full"></span>
  </span>
);

const PillButton = ({ children }) => (
  <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm
                   hover:bg-white/10 hover:border-white/20 transition shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
    {children}
  </span>
);

const LiveBadge = () => (
  <span className="inline-flex items-center gap-1 pl-2 pr-2.5 py-0.5 rounded-full
                   border border-red-500/70 text-red-400 text-[11px] font-black tracking-wider
                   shadow-[0_0_0_1px_rgba(239,68,68,0.25)]">
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
    LIVE
  </span>
);

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl supports-[backdrop-filter]:bg-black/55 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Brand + X */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('/')}
            className="text-[22px] md:text-2xl font-extrabold tracking-widest text-white hover:opacity-90 transition"
            aria-label="BioStrucX Home"
          >
            BIOSTRUCX
          </button>

          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white/90
                       bg-white/0 hover:bg-white/10 transition"
            aria-label="Abrir Twitter de BioStrucX"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
            <span className="text-xs font-medium tracking-wide">Twitter</span>
          </a>
        </div>

        {/* More (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center gap-2 p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <div className="flex flex-col">
            <span className={`block h-0.5 w-6 bg-current transition ${open ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-current my-1 transition ${open ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-current transition ${open ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
          <span className="relative text-sm font-semibold">
            More
            <span className="absolute left-0 -bottom-0.5 w-full h-[2px] bg-white"></span>
          </span>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-7 text-[13px]">
          <button onClick={() => go('/')} className="group text-white/90 hover:text-white transition">
            <LinkUnderline>HOME</LinkUnderline>
          </button>

          <button onClick={() => go('/launchpad')} className="group text-white/90 hover:text-white transition">
            <PillButton>
              <span className="tracking-[0.12em]">LAUNCHPAD</span>
            </PillButton>
          </button>

          <button onClick={() => go('/global-warming')} className="group text-white/90 hover:text-white transition">
            <PillButton>
              <span className="whitespace-nowrap tracking-[0.12em]">GLOBAL&nbsp;WARMING</span>
            </PillButton>
          </button>

          <div
            onClick={() => go('/dashboard/jeimie')}
            className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-full
                       bg-white/0 hover:bg-white/10 border border-white/10 transition"
            title="Open BioStrucX LIVE"
          >
            <span className="font-semibold text-white tracking-[0.14em]">BIOSTRUCX</span>
            <LiveBadge />
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-72' : 'max-h-0'}`}>
        <div className="px-4 pb-4 pt-2 flex flex-col gap-2 text-sm border-t border-white/10 bg-black/70 backdrop-blur-xl">
          <button onClick={() => go('/')} className="text-left px-3 py-3 rounded-lg hover:bg-white/10">
            <span className="tracking-wider">HOME</span>
          </button>
          <button onClick={() => go('/launchpad')} className="text-left px-3 py-3 rounded-lg hover:bg-white/10">
            <span className="tracking-wider">LAUNCHPAD</span>
          </button>
          <button onClick={() => go('/global-warming')} className="text-left px-3 py-3 rounded-lg hover:bg-white/10">
            <span className="tracking-wider">GLOBAL&nbsp;WARMING</span>
          </button>
          <button onClick={() => go('/dashboard/jeimie')} className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-white/10">
            <span className="tracking-wider">BIOSTRUCX</span>
            <LiveBadge />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



