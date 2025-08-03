import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/cliente_1/dashboard_info.json');
        setData(res.data);
      } catch (err) {
        setError('No se pudieron cargar los datos del cliente.');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-500 p-4">Cargando datos del cliente...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">📊 Dashboard – {data.nombre}</h1>

      <div className="space-y-3 text-gray-800">
        <p><strong>Elemento:</strong> {data.elemento}</p>
        <p><strong>Dimensiones (cm):</strong> {data.dimensiones_cm.base} × {data.dimensiones_cm.altura} × {data.dimensiones_cm.largo}</p>
        <p><strong>Material:</strong> {data.material.tipo}</p>
        <ul className="ml-6 list-disc">
          <li><strong>f'c:</strong> {data.material["f'c_MPa"]} MPa</li>
          <li><strong>E:</strong> {data.material.E_MPa} MPa</li>
          <li><strong>Densidad:</strong> {data.material.densidad_kg_m3} kg/m³</li>
        </ul>
        <p><strong>Sensores activos:</strong> {data.sensores.join(', ')}</p>
        <p><strong>Simulación activa:</strong> {data.simulacion_activa ? '✅ Sí' : '⛔ No'}</p>
      </div>
    </div>
  );
};

export default Dashboard;
