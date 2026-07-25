"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DynamicLight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((_, delta) => {
    const lerp = 1 - Math.exp(-delta * 2);
    smoothPos.current.x += (mouse.current.x * 1.8 - smoothPos.current.x) * lerp;
    smoothPos.current.y += (mouse.current.y * 1.2 - smoothPos.current.y) * lerp;

    if (lightRef.current) {
      lightRef.current.position.x = smoothPos.current.x;
      lightRef.current.position.y = smoothPos.current.y + 2;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 2, 3]}
      angle={0.35}
      penumbra={0.6}
      intensity={0.12}
      color="#90b0d0"
      distance={8}
      decay={1}
    />
  );
}
