import React, { useState } from 'react';

const API = process.env.REACT_APP_BACKEND_URL || '';

export default function LiveLoginModal({ is_open, on_close }) {
  const [phone, set_phone] = useState('');
  const [code, set_code] = useState('');
  const [step, set_step] = useState('phone'); // 'phone' | 'code'
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState('');

  if (!is_open) return null;

  const send_code = async () => {
    set_error('');
    if (!phone) { set_error('Ingresa tu número'); return; }
    try {
      set_loading(true);
      const r = await fetch(`${API}/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.error || 'No se pudo enviar');
      set_step('code');
    } catch (e) {
      set_error(e.message || 'Error');
    } finally { set_loading(false); }
  };

  const verify_code = async () => {
    set_error('');
    try {
      set_loading(true);
      const r = await fetch(`${API}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, code })
      });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.error || 'Código inválido');
      // aquí rediriges a tu dashboard por defecto:
      window.location.href = '/dashboard/cliente_1';
    } catch (e) {
      set_error(e.message || 'Error');
    } finally { set_loading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay clickable para cerrar */}
      <div className="absolute inset-0 bg-black/60" onClick={on_close} />
      {/* caja modal */}
      <div className="relative z-50 w-[360px] rounded-xl bg-white text-black p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Acceso seguro</h3>

        {step === 'phone' && (
          <>
            <input
              className="w-full border rounded-md px-3 py-2 mb-3"
              placeholder="Número (+44...)"
              value={phone}
              onChange={(e) => set_phone(e.target.value)}
            />
            <button
              onClick={send_code}
              disabled={loading}
              className="w-full rounded-md bg-cyan-600 text-white py-2 font-medium disabled:opacity-50"
            >
              {loading ? 'Enviando…' : 'Enviar código SMS'}
            </button>
          </>
        )}

        {step === 'code' && (
          <>
            <input
              className="w-full border rounded-md px-3 py-2 mb-3"
              placeholder="Código"
              value={code}
              onChange={(e) => set_code(e.target.value)}
            />
            <button
              onClick={verify_code}
              disabled={loading}
              className="w-full rounded-md bg-emerald-600 text-white py-2 font-medium disabled:opacity-50"
            >
              {loading ? 'Verificando…' : 'Verificar'}
            </button>
          </>
        )}

        {!!error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <button
          onClick={on_close}
          className="mt-4 w-full text-sm text-gray-600 hover:underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
