"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HeroObject({ scrollProgress = 0, stageProgress = 0, hoveredChapter = null }: { scrollProgress?: number; stageProgress?: number; hoveredChapter?: string | null }) {
  const groupRef = useRef<THREE.Group>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothRot = useRef({ x: 0, y: 0, z: 0 });
  const targetRot = useRef({ x: 0, y: 0, z: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const chapterRot = useRef({ x: 0, y: 0 });
  const stageRotY = useRef(0);
  const idleRotY = useRef(0);

  const chapterDirs: Record<string, { x: number; y: number }> = {
    "understanding-ai-agents": { x: -0.025, y: 0.03 },
    "ai-brain": { x: 0.03, y: 0.025 },
    "built-with-ai": { x: -0.025, y: -0.02 },
    "future-of-agents": { x: 0.025, y: -0.02 },
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = performance.now() / 1000;
    const sp = scrollProgress;
    const amp = 1 - sp * 0.25;
    const mFactor = isMobile ? 0.4 : 1.0;

    // Stage rotation.y (180° spin)
    stageRotY.current += (stageProgress * Math.PI - stageRotY.current) * Math.min(1, delta * 4);

    // Slow pendulum motion: readable at all times, never a continuous spin.
    idleRotY.current = Math.sin(t * 0.2) * THREE.MathUtils.degToRad(15);

    // Scale: only changes 0.08→0.30, then freezes at 0.82
    const scaleClamp = Math.max(0, Math.min(1, (sp - 0.08) / 0.22));
    const freezeScale = 1 - scaleClamp * 0.15;
    const finalScale = Math.max(0.85, freezeScale);
    const curS = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(curS + (finalScale - curS) * Math.min(1, delta * 4));

    // Exit Y: after 0.66, whole group moves up (DEPRECATED — using screen-space CSS transform instead)
    // Kept as 0 to avoid breaking model position logic
    const exitClamp = Math.max(0, Math.min(1, (sp - 0.66) / 0.18));
    const exitY = 0;
    const curY = groupRef.current.position.z;
    groupRef.current.position.z = curY + (exitY - curY) * Math.min(1, delta * 3);

    // Mouse rotation
    targetRot.current.y = mouse.current.x * 0.13 * amp * mFactor;
    targetRot.current.x = -mouse.current.y * 0.08 * amp * mFactor;
    targetRot.current.z = mouse.current.x * 0.02 * amp * mFactor;
    const rLerp = 1 - Math.exp(-delta * 3);
    smoothRot.current.x += (targetRot.current.x - smoothRot.current.x) * rLerp;
    smoothRot.current.y += (targetRot.current.y - smoothRot.current.y) * rLerp;
    smoothRot.current.z += (targetRot.current.z - smoothRot.current.z) * rLerp;

    groupRef.current.rotation.x = smoothRot.current.x + chapterRot.current.x;
    groupRef.current.rotation.y = smoothRot.current.y + chapterRot.current.y + stageRotY.current + idleRotY.current;
    groupRef.current.rotation.z = smoothRot.current.z;

    // Mouse position parallax
    targetPos.current.x = mouse.current.x * 0.06 * amp * mFactor;
    targetPos.current.y = -mouse.current.y * 0.035 * amp * mFactor;
    const pLerp = 1 - Math.exp(-delta * 2);
    smoothPos.current.x += (targetPos.current.x - smoothPos.current.x) * pLerp;
    smoothPos.current.y += (targetPos.current.y - smoothPos.current.y) * pLerp;
    groupRef.current.position.x = smoothPos.current.x;
    groupRef.current.position.y = smoothPos.current.y;

    // Chapter hover
    const dir = hoveredChapter ? chapterDirs[hoveredChapter] : null;
    const cLerp = 1 - Math.exp(-delta * 4);
    chapterRot.current.x += ((dir ? dir.x : 0) - chapterRot.current.x) * cLerp;
    chapterRot.current.y += ((dir ? dir.y : 0) - chapterRot.current.y) * cLerp;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.4, 0.14, 128, 24]} />
        <meshPhysicalMaterial color="#829CAD" metalness={0.82} roughness={0.22} envMapIntensity={1.05} clearcoat={0.4} clearcoatRoughness={0.18} />
      </mesh>
    </group>
  );
}
