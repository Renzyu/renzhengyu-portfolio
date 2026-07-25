"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  index: number;
  title: string;
  position: [number, number, number];
}

export default function ProjectNode({ index, title, position }: Props) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    if (glowRef.current) {
      const pulse = 0.4 + 0.6 * Math.sin(t * 0.06 + index * 1.5);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.025 * pulse;
    }
  });

  return (
    <group position={position}>
      {/* Micro glow orb */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color="#7088b0"
          transparent
          opacity={0.02}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
