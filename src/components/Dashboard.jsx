import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedPhone = localStorage.getItem("phoneNumber");
    if (storedPhone) {
      setPhone(storedPhone);
    } else {
      // Si no hay número, redirige al inicio
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("phoneNumber"); // Elimina número
    navigate("/"); // Redirige al inicio
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          👋 ¡Hola <span className="text-blue-600">{phone || "usuario"}</span>!
        </h1>
        <p className="text-gray-700 mb-2">Tu estructura está estable ✅</p>
        <p className="text-sm text-gray-500 mb-6">
          Pronto verás sensores en tiempo real.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;



