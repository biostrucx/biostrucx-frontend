// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Launchpad from './components/Launchpad';
import GlobalWarming from './components/GlobalWarming';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:clientid" element={<Dashboard />} />

        {/* NUEVAS RUTAS INDEPENDIENTES */}
        <Route path="/launchpad" element={<Launchpad />} />
        <Route path="/global-warming" element={<GlobalWarming />} />
      </Routes>
    </BrowserRouter>
  );
}

