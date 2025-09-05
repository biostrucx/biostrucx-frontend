// src/components/FEMViewer.jsx
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function FEMViewer({ viz }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = (viz?.vertices || []).flat();             // [x,y,z,...]
    const idx   = viz?.indices || [];
    const u     = viz?.u_mag || [];

    const pos = new Float32Array(verts);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(idx);

    // Colores opcionales por u_mag (azul→rojo)
    if (u.length === (verts.length / 3)) {
      const umin = Math.min(...u), umax = Math.max(...u);
      const span = umax - umin || 1;
      const colors = new Float32Array(u.length * 3);
      for (let i = 0; i < u.length; i++) {
        const t = (u[i] - umin) / span;
        colors[i * 3 + 0] = t;        // R
        colors[i * 3 + 1] = 0.2;      // G
        colors[i * 3 + 2] = 1 - t;    // B
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }

    geo.computeVertexNormals();
    return geo;
  }, [viz]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [1.2, 1.0, 1.4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 4]} intensity={0.9} />
        <mesh geometry={geometry}>
          <meshStandardMaterial roughness={0.5} metalness={0.1} vertexColors={!!viz?.u_mag?.length} />
        </mesh>
        <OrbitControls makeDefault enableDamping />
      </Canvas>
    </div>
  );
}
