import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LiveLoginModal = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const sendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${backendURL}/send-code`, { phoneNumber });
      if (res.data.success) {
        setStep(2);
      } else {
        setError('No se pudo enviar el código.');
      }
    } catch (err) {
      setError('Error al enviar código.');
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${backendURL}/verify-code`, { phoneNumber, code });
      if (res.data.status === 'allowed') {
        navigate(res.data.redirect); // Ej: /dashboard/cliente_1
      } else if (res.data.status === 'denied') {
        setError(res.data.message);
      } else {
        setError('Código incorrecto o expirado.');
      }
    } catch (err) {
      setError('Error al verificar el código.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Acceso a BioStrucX LIVE</h2>

      {step === 1 && (
        <>
          <input
            type="tel"
            placeholder="+447XXXXXX650"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={sendCode}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Enviando...' : 'Enviar código SMS'}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Ingresa el código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={verifyCode}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Verificando...' : 'Verificar y entrar'}
          </button>
        </>
      )}

      {error && (
        <div className="text-red-600 text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default LiveLoginModal;

