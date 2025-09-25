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
  const isVision = pathname.startsWith('/aboutus'); // mantiene Our Vision

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
          className="md:hidden text-white text-2xl leading-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
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
            onClick={() => go('/aboutus')}
            className={`uppercase ${isVision ? 'text-white' : 'text-white/70 hover:text-white'}`}
          >
            Our Vision
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

          {/* NEW: StrucX.ai external link (desktop) */}
          <a
            href="https://strucx.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase text-white/70 hover:text-white"
            aria-label="Open StrucX.ai in a new tab"
          >
            StrucX.ai
          </a>

          <button
            onClick={() => go('/dashboard/jeimie')}
            className="uppercase text-white hover:opacity-80 flex items-center"
          >
            BioStrucX
            <LiveBadge active={isLive} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown — modern overlay + sheet */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[60]"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          {/* Sheet */}
          <div className="
              absolute left-0 right-0 top-0
              pt-[env(safe-area-inset-top)]
              bg-[#0b0b0b] border-b border-white/10
              rounded-b-2xl shadow-2xl
              translate-y-0
              transition-transform
            ">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-white/70 text-sm tracking-widest uppercase">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 text-xl px-3 py-1 rounded-lg hover:bg-white/10"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col px-3 pb-4">
              <MobileItem active={isHome} onClick={() => go('/')}>Home</MobileItem>
              <MobileItem active={isVision} onClick={() => go('/aboutus')}>Our Vision</MobileItem>
              <MobileItem active={isLaunchpad} onClick={() => go('/launchpad')}>Launchpad</MobileItem>
              <MobileItem active={isGW} onClick={() => go('/global-warming')}>Global Warming</MobileItem>

              {/* NEW: StrucX.ai external link (mobile) */}
              <a
                href="https://strucx.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-4 py-4 text-base rounded-xl
                           text-white bg-white/5 hover:bg-white/10 active:bg-white/15 mt-2"
                aria-label="Open StrucX.ai in a new tab"
                onClick={() => setOpen(false)}
              >
                <span className="uppercase">StrucX.ai</span>
                <span className="text-white/40 text-xs">opens new tab</span>
              </a>

              <div className="mt-2 border-t border-white/10" />
              <button
                onClick={() => go('/dashboard/jeimie')}
                className="w-full flex items-center justify-between px-4 py-4 text-base rounded-xl
                           text-white bg-white/5 hover:bg-white/10 active:bg-white/15 mt-2"
              >
                <span className="uppercase">BioStrucX</span>
                <LiveBadge active={isLive} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileItem = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-4 text-base rounded-xl
      ${active ? 'text-white bg-white/10' : 'text-white/80 bg-transparent hover:text-white hover:bg-white/5'}
      transition
    `}
  >
    {children}
  </button>
);

export default Navbar;


