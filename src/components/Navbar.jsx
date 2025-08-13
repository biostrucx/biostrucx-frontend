import React, { useState } from "react";
import LoginModal from "./LoginPage";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "OUR MiSSION", href: "#mission" },
    { label: "BiOSTRUCX DESIGN", href: "#design" },
    { label: "BiOX MATERIALS", href: "#materials" },
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
    <header className="bg-white shadow-md px-6 py-4 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 tracking-wide">
          BiOSTRUCX
        </div>

        {/* Menú central */}
        <nav className="flex items-center gap-x-6 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-gray-800 hover:text-blue-400 transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:opacity-0 hover:after:opacity-100"
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
            <span className="text-gray-800 hover:text-blue-400 transition">More ▾</span>
            {isMoreOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg py-2 w-40 z-50">
                {moreItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Botón BioStrucX Live */}
          <button
            onClick={() => setShowLogin(true)}
            className="ml-4 bg-black text-cyan-400 px-4 py-2 rounded-full hover:bg-cyan-900 transition"
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
