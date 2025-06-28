import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginModal({ onClose }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const sendCode = async () => {
    try {
      const cleanedPhone = phone.replace(/\s+/g, "");
      await axios.post('https://biostrucx-backend.onrender.com/send-code', { phoneNumber });
      setStep(2);
      setMessage("✅ Código enviado. Revisa tu SMS.");
    } catch (error) {
      console.error("Error al enviar código:", error.response?.data || error.message);
      setMessage("❌ Error al enviar código.");
    }
  };

  const verifyCode = async () => {
    try {
      const cleanedPhone = phone.replace(/\s+/g, "");
      await axios.post("http://localhost:5000/verify-code", {
        phone: cleanedPhone,
        code,
      });

      localStorage.setItem("phoneNumber", cleanedPhone);

      setMessage("✅ Verificación exitosa. Redirigiendo...");
      setTimeout(() => {
        onClose(); // Cierra el modal
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error en verificación:", error.response?.data || error.message);
      setMessage("❌ Código incorrecto.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-2xl animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 text-center">🔐 Ingreso Seguro</h2>

        {step === 1 && (
          <>
            <input
              type="tel"
              placeholder="Número (+447...)"
              className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={sendCode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 w-full rounded"
            >
              Enviar código SMS
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Código recibido"
              className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={verifyCode}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 w-full rounded"
            >
              Verificar
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}

        <button
          onClick={onClose}
          className="mt-6 text-sm text-gray-500 hover:underline w-full"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
