"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AmbientParticles({ count = 20 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return [pos];
  }, [count]);

  useFrame(() => {
    if (!points.current) return;
    const p = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      p[i * 3] += Math.sin(performance.now() * 0.0002 + i) * 0.0003;
      p[i * 3 + 1] += Math.cos(performance.now() * 0.00015 + i * 0.5) * 0.0002;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        transparent
        opacity={0.06}
        color="#7088a0"
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
