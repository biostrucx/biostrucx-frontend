import React, { useState } from "react";
import LoginModal from "./LoginPage";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "OUR MISSION", href: "#mission" },
    { label: "BIOSTRUCX DESIGN", href: "#design" },
    { label: "BIOX MATERIALS", href: "#materials" },
    { label: "MODULAR STRUCTURES", href: "#modular" },
    { label: "LAUNCHPAD", href: "#launchpad" },
    { label: "GLOBAL WARMING IMPACT", href: "#impact" },
  ];

  const moreItems = [
    { label: "Shop", href: "#shop" },
    { label: "Be a Supplier", href: "#supplier" },
    { label: "Careers", href: "#careers" },
  ];

  return (
    <header className="bg-black text-white shadow-md px-6 py-4 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          BiOSTRUCX
        </div>

        {/* Menú central */}
        <nav className="flex items-center gap-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative hover:text-cyan-400 transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-cyan-500 after:opacity-0 hover:after:opacity-100"
            >
              {item.label}
            </a>
          ))}

          {/* More dropdown */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={() => setIsMoreOpen(false)}
          >
            <span className="hover:text-cyan-400 transition">More ▾</span>
            {isMoreOpen && (
              <div className="absolute right-0 mt-2 bg-black border border-gray-700 rounded shadow-lg py-2 w-40 z-50">
                {moreItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-800"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Botón Twitter */}
          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black border border-white px-4 py-2 rounded-full hover:bg-gray-900 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1200 1227" className="w-4 h-4">
              <path d="M714.163 519.284 1160.89 0H1055.8L667.137 450.887 357.328 0H0l468.71 682.625L0 1226.95h105.09l408.36-474.78 329.473 474.78H1200L714.137 519.284h.026Zm-144.326 167.88-47.386-67.92L143.052 79.694h162.984l304.35 436.236 47.387 67.92 393.224 563.456H888.013L569.837 687.165Z"/>
            </svg>
            Twitter
          </a>

          {/* Botón BioStrucX Live */}
          <button
            onClick={() => setShowLogin(true)}
            className="ml-4 bg-cyan-500 text-black px-4 py-2 rounded-full hover:bg-cyan-400 transition"
          >
            BioStrucX Live
          </button>
        </nav>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}

export default Navbar;

