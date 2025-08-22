export default function Navbar({ on_open_login }) {
  return (
    <nav className="w-full flex items-center justify-between p-4">
      {/* …tu marca / links… */}

      <button
        type="button"
        onClick={on_open_login}
        className="px-4 py-2 rounded-md bg-cyan-500 text-black font-medium hover:opacity-90"
      >
        BioStrucX Live
      </button>
    </nav>
  );
}

