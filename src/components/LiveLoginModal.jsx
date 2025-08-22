// src/components/LiveLoginModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE as backendURL } from '../services/api';

// Cliente axios con baseURL fijo
const api = axios.create({
  baseURL: backendURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

const LiveLoginModal = ({ is_open = true, on_close = () => {} }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Valida formato E.164: + seguido de 8–15 dígitos
  const validPhone = (v) => /^\+\d{8,15}$/.test(v.trim());

  const sendCode = async () => {
    setLoading(true);
    setError('');
    try {
      if (!validPhone(phoneNumber)) {
        throw new Error('Usa formato internacional, ej: +447471256650');
      }
      const { data } = await api.post('/send-code', { phoneNumber: phoneNumber.trim() });
      if (data?.success) {
        setStep(2);
      } else {
        setError(data?.message || 'No se pudo enviar el código.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al enviar código.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/verify-code', {
        phoneNumber: phoneNumber.trim(),
        code: code.trim(),
      });

      if (data?.status === 'allowed' && data?.redirect) {
        navigate(data.redirect); // p.ej. /dashboard/cliente_1
      } else if (data?.status === 'denied') {
        setError(data?.message || 'Acceso denegado.');
      } else {
        setError(data?.message || 'Código incorrecto o expirado.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  if (!is_open) return null;

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">Acceso a BioStrucX LIVE</h2>

      {step === 1 && (
        <>
          <input
            type="tel"
            placeholder="+447471256650"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded bg-white text-black placeholder-gray-400 caret-black"
            autoComplete="tel"
            inputMode="tel"
          />
          <button
            onClick={sendCode}
            disabled={loading || !phoneNumber}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Enviando…' : 'Enviar código SMS'}
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
            className="w-full p-2 border rounded bg-white text-black placeholder-gray-400 caret-black"
            autoComplete="one-time-code"
            inputMode="numeric"
          />
          <button
            onClick={verifyCode}
            disabled={loading || !code}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Verificando…' : 'Verificar y entrar'}
          </button>
        </>
      )}

      {error && <div className="text-red-600 text-center mt-2">{error}</div>}

      <button
        onClick={on_close}
        className="w-full mt-2 py-2 border rounded hover:bg-gray-50"
      >
        Cerrar
      </button>
    </div>
  );
};

export default LiveLoginModal;
