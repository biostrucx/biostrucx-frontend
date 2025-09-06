// src/components/FEMViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * props:
 *  - viz: {
 *      vertices: number[] | number[][], // [x0,y0,z0,x1,y1,z1,...] o array de arrays
 *      indices: number[],               // triángulos (indexados)
 *      u_mag?: number[],                // desplazamiento por vértice (para color)
 *      marker?: [number, number, number]// posición del sensor (opcional)
 *    }
 *  - height: alto del canvas (px)
 *  - background: color de fondo
 */
export default function FEMViewer({ viz, height = 220, background = '#0b0b0b' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // limpiar render previo
    mount.innerHTML = '';

    // renderer / escena / cámara
    const w = mount.clientWidth || 600;
    const h = height;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    // luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    // === Geometría desde viz ===
    if (viz && Array.isArray(viz.vertices) && viz.vertices.length) {
      // aplanar si viene [[x,y,z],...]
      const flatVerts = Array.isArray(viz.vertices[0]) ? viz.vertices.flat() : viz.vertices;

      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(flatVerts);
      geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      if (Array.isArray(viz.indices) && viz.indices.length) {
        geom.setIndex(viz.indices);
      }
      geom.computeVertexNormals();

      // Colorear por desplazamiento (u_mag) si viene
      if (Array.isArray(viz.u_mag) && viz.u_mag.length * 3 === pos.length) {
        const u = viz.u_mag;
        const uMin = Math.min(...u);
        const uMax = Math.max(...u);
        const colors = new Float32Array(u.length * 3);
        for (let i = 0; i < u.length; i++) {
          const t = (u[i] - uMin) / ((uMax - uMin) || 1); // 0..1
          // gradiente simple azul→verde→rojo
          const r = t;
          const g = Math.max(0, 1 - Math.abs(t - 0.5) * 2);
          const b = 1 - t;
          colors[i * 3 + 0] = r;
          colors[i * 3 + 1] = g;
          colors[i * 3 + 2] = b;
        }
        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      }

      const mat = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        vertexColors: !!geom.getAttribute('color'),
      });
      const mesh = new THREE.Mesh(geom, mat);
      scene.add(mesh);

      // Marcador de sensor (opcional)
      if (Array.isArray(viz.marker) && viz.marker.length === 3) {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        s.position.set(viz.marker[0], viz.marker[1], viz.marker[2]);
        scene.add(s);
      }

      // encuadrar la cámara
      geom.computeBoundingSphere();
      const bs = geom.boundingSphere;
      if (bs) {
        const dist = bs.radius * 2.5;
        camera.position.set(bs.center.x + dist, bs.center.y + dist * 0.8, bs.center.z + dist);
        camera.lookAt(bs.center);
      }
    }

    // controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // render loop
    let raf;
    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // responsive
    const onResize = () => {
      const W = mount.clientWidth || 600;
      renderer.setSize(W, h);
      camera.aspect = W / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [viz, height, background]);

  return <div ref={mountRef} style={{ width: '100%', height }} />;
}
