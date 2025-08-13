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
    <header className="bg-black px-8 py-4 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-white tracking-wider">
          BiOSTRUCX
        </div>

        {/* Menú central */}
        <nav className="flex items-center gap-x-8 text-sm font-medium text-white">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative hover:text-cyan-400 transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-cyan-400 after:opacity-0 hover:after:opacity-100"
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
              <div className="absolute right-0 mt-2 bg-black border border-gray-700 rounded shadow-lg py-2 w-44 z-50">
                {moreItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Botón de Twitter */}
          <a
            href="https://x.com/BiostrucX"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            Twitter
          </a>

          {/* Botón BioStrucX Live */}
          <button
            onClick={() => setShowLogin(true)}
            className="ml-4 bg-cyan-500 text-black px-4 py-2 rounded-full hover:bg-cyan-700 hover:text-white transition"
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


