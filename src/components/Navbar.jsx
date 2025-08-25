import { NavLink } from "react-router-dom";

export default function Navbar() {
  const base = "px-3 py-2 rounded-md text-sm font-medium transition hover:opacity-80";
  const active = "text-white";
  const normal = "text-gray-300";

  return (
    <nav className="w-full bg-black/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xl">BioStrucX</span>
          <a href="https://twitter.com/biostrucx" target="_blank" rel="noreferrer"
             className="text-xs border border-gray-600 px-2 py-1 rounded">
            X Twitter
          </a>
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/" end className={({isActive}) => `${base} ${isActive?active:normal}`}>Home</NavLink>
          <NavLink to="/launchpad" className={({isActive}) => `${base} ${isActive?active:normal}`}>Launchpad</NavLink>
          <NavLink to="/global-warming" className={({isActive}) => `${base} ${isActive?active:normal}`}>Global Warming</NavLink>
          <NavLink to="/live" className={({isActive}) =>
            `${base} ${isActive ? "bg-red-600 text-white" : "bg-red-700/70"}`
          }>LIVE</NavLink>
        </div>
      </div>
    </nav>
  );
}


