import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/cliente_1" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
