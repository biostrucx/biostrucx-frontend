import React, { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    window.location.href = '/dashboard_x';
  }, []);

  return null; // No renderiza nada, solo redirige
};

export default Dashboard;

