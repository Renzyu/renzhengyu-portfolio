"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import { assetPath } from "@/lib/asset-path";
import * as THREE from "three";

export default function HeroText3D({ scrollProgress = 0, stageProgress = 0 }: { scrollProgress?: number; stageProgress?: number }) {
  const scaleRef = useRef<THREE.Group>(null);
  const swayRef = useRef<THREE.Group>(null);
  const innerMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const hoverIntensity = useRef(0);
  const floatPhase = useRef(Math.random() * Math.PI * 2);
  const prefersReduced = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { prefersReduced.current = e.matches; };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const sp = scrollProgress ?? 0;
    const rm = prefersReduced.current;
    const amp = 1 - sp * 0.3;

    // Scroll scale
    if (scaleRef.current) {
      const targetScale = 0.85 - sp * 0.20;
      const cur = scaleRef.current.scale.x;
      scaleRef.current.scale.setScalar(cur + (targetScale - cur) * Math.min(1, delta * 4));
    }

    // Stage-driven left translation
    const aiOsMoveProgress = Math.max(0, Math.min(1, (stageProgress - 0.65) / 0.25));
    const targetLeft = -aiOsMoveProgress * 0.7;

    // ±3° subtle horizontal sway — barely perceptible, NOT continuous rotation
    if (swayRef.current) {
      const swayRange = THREE.MathUtils.degToRad(15);
      const swaySpeed = rm ? 0 : 0.2;
      const sway = Math.sin(t * swaySpeed + floatPhase.current) * swayRange;
      const hoverReduce = 1 - hoverIntensity.current * 0.5;
      swayRef.current.rotation.y = sway * hoverReduce;
      // Explicitly zero out other rotation axes
      swayRef.current.rotation.x = 0;
      swayRef.current.rotation.z = 0;
    }

    // Primary horizontal drift — this is the main visible motion
    if (swayRef.current) {
      const driftX = Math.sin(t * 0.12 + floatPhase.current * 0.7) * 0.06 * amp + targetLeft;
      const driftY = Math.cos(t * 0.08 + floatPhase.current * 1.3) * 0.015 * amp;
      swayRef.current.position.set(driftX, driftY, 0);
    }

    // Hover — emissive boost + slight scale, NO rotation
    const dist = Math.sqrt(mouse.current.x ** 2 + mouse.current.y ** 2);
    const proximity = Math.max(0, 1 - dist / 0.35);
    const targetHover = dist < 0.35 ? 1 : 0;
    hoverIntensity.current += (targetHover - hoverIntensity.current) * Math.min(1, delta * 4);

    if (swayRef.current) {
      const hoverScale = 1 + hoverIntensity.current * 0.015;
      swayRef.current.scale.setScalar(hoverScale);
    }

    // Emissive boost
    if (innerMatRef.current) {
      const pulse = 0.3 + 0.2 * Math.sin(t * 0.04);
      const hoverBonus = proximity * 0.3;
      innerMatRef.current.emissiveIntensity = 0.8 + hoverBonus + 0.08 * pulse;
    }
  });

  return (
    <group position={[0, 0.15, 0.35]}>
      <group ref={scaleRef}>
        <group ref={swayRef}>
          <Text3D font={assetPath("/fonts/helvetiker_bold.typeface.json")} size={0.22} height={0.1} bevelEnabled bevelThickness={0.04} bevelSize={0.015} bevelSegments={6} curveSegments={20}>
            AI-OS
            <meshPhysicalMaterial color="#c0d8f0" metalness={0} roughness={0.06} transparent opacity={0.12} envMapIntensity={3.0} clearcoat={1} clearcoatRoughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
          </Text3D>
          <Text3D font={assetPath("/fonts/helvetiker_bold.typeface.json")} size={0.214} height={0.095} bevelEnabled bevelThickness={0.02} bevelSize={0.008} bevelSegments={4} curveSegments={20}>
            AI-OS
            <meshPhysicalMaterial ref={innerMatRef} color="#c8e8ff" metalness={0} roughness={0.1} emissive="#6688dd" emissiveIntensity={0.8} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
          </Text3D>
        </group>
      </group>
    </group>
  );
}
