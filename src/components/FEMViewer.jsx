// src/components/FEMViewer.jsx
import React from 'react';

export default function FEMViewer({ viz }) {
  if (!viz || !Array.isArray(viz.vertices) || !Array.isArray(viz.indices)) {
    return <div className="w-full h-full flex items-center justify-center text-sm">sin modelo</div>;
  }

  // aquí puedes integrar three.js más adelante; por ahora, simple estado
  return (
    <div className="w-full h-full flex items-center justify-center text-sm">
      modelo listo (triángulos: {viz.indices.length / 3}, vertices: {viz.vertices.length / 3})
    </div>
  );
}

