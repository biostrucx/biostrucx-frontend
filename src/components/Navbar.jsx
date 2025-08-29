// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
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

  // ---- Autoplay fix global para videos de fondo (iOS/Safari/móvil) ----
  useEffect(() => {
    const videos = Array.from(
      document.querySelectorAll('video[autoplay], video[data-bg]')
    );

    const controllers = [];

    videos.forEach((el) => {
      // flags requeridos por iOS
      el.muted = true;
      el.playsInline = true;
      el.setAttribute('webkit-playsinline', 'true');
      el.setAttribute('muted', 'true'); // por si el DOM lo necesita

      const tryPlay = async () => {
        try {
          await el.play();
        } catch {
          // silencioso; reintentamos con eventos
        }
      };

      const onLoaded = () => tryPlay();
      const onVis = () => {
        if (document.visibilityState === 'visible') tryPlay();
      };
      const onResume = () => tryPlay();

      el.addEventListener('loadedmetadata', onLoaded);
      el.addEventListener('stalled', onResume);
      el.addEventListener('pause', onResume);
      el.addEventListener('error', onResume);
      document.addEventListener('visibilitychange', onVis);

      const io = new IntersectionObserver(
        (ents) => ents.forEach((e) => e.isIntersecting && tryPlay()),
        { threshold: 0.25 }
      );
      io.observe(el);

      // primer intento
      tryPlay();

      controllers.push(() => {
        el.removeEventListener('loadedmetadata', onLoaded);
        el.removeEventListener('stalled', onResume);
        el.removeEventListener('pause', onResume);
        el.removeEventListener('error', onResume);
        document.removeEventListener('visibilitychange', onVis);
        io.disconnect();
      });
    });

    return () => controllers.forEach((off) => off());
  }, []); // se ejecuta una sola vez al montar el Navbar
  // --------------------------------------------------------------------

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      {/* Top bar */}
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Left: X + Logo (con aire) */}
        <div className="flex items-center">
          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition"
            aria-label="BioStrucX on X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
            </svg>
          </a>

          <button
            onClick={() => go('/')}
            className="ml-20 text-lg md:text-xl font-extrabold tracking-[0.25em] text-white hover:opacity-80 transition"
            aria-label="Home"
          >
            BIOSTRUCX
          </button>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          onClick={() => setOpen(v => !v)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <div className="relative w-6 h-5">
            <span className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform ${open ? 'translate-y-2.5 rotate-45' : ''}`} />
            <span className={`absolute left-0 top-2.5 h-0.5 w-6 bg-current transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 bottom-0 h-0.5 w-6 bg-current transition-transform ${open ? '-translate-y-2.5 -rotate-45' : ''}`} />
          </div>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider">
          <button onClick={() => go('/')} className={`uppercase ${isHome ? 'text-white' : 'text-white/80 hover:text-white'}`}>Home</button>
          <button onClick={() => go('/launchpad')} className={`uppercase ${isLaunchpad ? 'text-white' : 'text-white/80 hover:text-white'}`}>Launchpad</button>
          <button onClick={() => go('/global-warming')} className={`uppercase ${isGW ? 'text-white' : 'text-white/80 hover:text-white'}`}>Global Warming</button>
          <button
            onClick={() => go('/dashboard/jeimie')}
            className={`uppercase flex items-center ${isLive ? 'text-white' : 'text-white/80 hover:text-white'}`}
          >
            BioStrucX
            <LiveBadge active={isLive} />
          </button>
        </div>
      </div>

      {/* Mobile drawer (overlay + panel) */}
      {/* Overlay click-to-close */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Side panel */}
      <aside
        className={`md:hidden fixed right-0 top-0 z-50 h-full w-72 max-w-[85vw] bg-black/95 border-l border-white/10
                    transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header dentro del drawer */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <span className="text-xs uppercase tracking-widest text-white/60">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 text-white/80 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.3 5.7a1 1 0 0 0-1.4-1.4L12 9.17 7.1 4.3a1 1 0 1 0-1.4 1.4L10.83 12l-5.13 4.9a1 1 0 1 0 1.4 1.4L12 14.83l4.9 5.13a1 1 0 0 0 1.4-1.4L13.17 12l5.13-4.9Z" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <nav className="px-2 py-2">
          <button
            onClick={() => go('/')}
            className={`w-full h-12 px-3 text-left uppercase text-[14px] font-semibold tracking-wider rounded-md
                        ${isHome ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
          >
            Home
          </button>
          <button
            onClick={() => go('/launchpad')}
            className={`w-full h-12 px-3 text-left uppercase text-[14px] font-semibold tracking-wider rounded-md
                        ${isLaunchpad ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
          >
            Launchpad
          </button>
          <button
            onClick={() => go('/global-warming')}
            className={`w-full h-12 px-3 text-left uppercase text-[14px] font-semibold tracking-wider rounded-md
                        ${isGW ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
          >
            Global Warming
          </button>
          <button
            onClick={() => go('/dashboard/jeimie')}
            className={`w-full h-12 px-3 flex items-center justify-between uppercase text-[14px] font-semibold tracking-wider rounded-md
                        ${isLive ? 'text-white bg-white/10' : 'text-white/85 hover:text-white hover:bg-white/5'}`}
          >
            <span>BioStrucX</span>
            <LiveBadge active={isLive} />
          </button>

          {/* Social */}
          <div className="h-px bg-white/10 mx-1 my-3" />
          <div className="px-1 flex items-center gap-3">
            <a
              href="https://x.com/BiostrucX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Open X"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.82l-4.77-6.3L4.6 22H2l7.17-8.2L1.5 2h6.86l4.33 5.7L18.244 2Zm-1.19 18h2.03L8.1 4H6.06l10 16Z"/>
              </svg>
            </a>
          </div>
        </nav>
      </aside>
    </nav>
  );
};

export default Navbar;




