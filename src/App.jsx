import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Launchpad from "./components/Launchpad";
import GlobalWarming from "./components/GlobalWarming";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/global-warming" element={<GlobalWarming />} />
          <Route path="*" element={<div className="p-10">Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
