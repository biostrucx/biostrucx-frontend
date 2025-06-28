import React, { useState } from "react";
import LoginModal from "./LoginPage";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Our Mission", href: "#mission" },
    { label: "BioStruct Design", href: "#design" },
    { label: "BioX Materials", href: "#materials" },
    { label: "Modular Structures", href: "#modular" },
    { label: "Launchpad", href: "#launchpad" },
    { label: "Impact", href: "#impact" },
  ];

  return (
    <header className="bg-white shadow-md px-6 py-4 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 tracking-wide">
          BioStrucX
        </div>

        {/* Menú central */}
        <nav className="flex flex-wrap justify-center gap-x-6 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-gray-800 hover:text-blue-400 transition-all duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:opacity-0 hover:after:opacity-100"
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-1">
            <span className="text-gray-800">BioStrucX</span>
            <a
              href="#platform"
              className="px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-sm transition-all duration-300 hover:text-red-600 hover:bg-transparent border border-transparent hover:border-red-600"
            >
              LIVE
            </a>
          </div>
        </nav>

        {/* Botón de Login */}
        <div className="flex items-center gap-1">
          <button
            className="bg-black text-cyan-400 px-4 py-2 rounded-full hover:bg-cyan-900 transition"
            onClick={() => setShowLogin(true)}
          >
            BioStrucX Live
          </button>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}

export default Navbar;
