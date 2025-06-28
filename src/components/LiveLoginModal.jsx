import React, { useState } from 'react';
import axios from 'axios';

const LiveLoginModal = ({ onSuccess, onClose }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' o 'code'
  const [message, setMessage] = useState('');

  const handleSendCode = async () => {
    try {
      await axios.post('https://biostrucx-backend.onrender.com/send-code', { phoneNumber: phone });
      setStep('code');
      setMessage('Código enviado por SMS');
    } catch (err) {
      console.error(err);
      setMessage('Error al enviar SMS');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post('https://biostrucx-backend.onrender.com/verify-code', {
        phoneNumber: phone,
        code: code,
      });

      if (res.data.success) {
        setMessage('Código verificado correctamente');
        onSuccess();
      } else {
        setMessage('Código incorrecto');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error al verificar');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-xl w-[320px] text-center">
        <h2 className="text-xl font-bold mb-4">BioStrucX LIVE</h2>

        {step === 'phone' && (
          <>
            <input
              className="border w-full p-2 rounded mb-4"
              placeholder="+44..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={handleSendCode}
              className="bg-blue-600 text-white w-full py-2 rounded mb-2"
            >
              Enviar Código
            </button>
          </>
        )}

        {step === 'code' && (
          <>
            <input
              className="border w-full p-2 rounded mb-4"
              placeholder="Código recibido"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleVerifyCode}
              className="bg-green-600 text-white w-full py-2 rounded mb-2"
            >
              Verificar
            </button>
          </>
        )}

        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}

        <button
          className="text-xs text-gray-500 mt-4 underline"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LiveLoginModal;

