"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { usePageTransition } from "@/components/layout/PageTransition";
import { gsap } from "gsap";
import * as THREE from "three";
import CameraController from "./CameraController";
import HeroObject from "./HeroObject";
import HeroText3D from "./HeroText3D";
import DynamicLight from "./DynamicLight";
import AmbientParticles from "./AmbientParticles";
import SceneEnvironment from "./SceneEnvironment";
import ProjectNode from "./ProjectNode";

/* ── Entrance Controller ──
   - Initial transforms set in JSX (first frame already at entry pose)
   - Tracks rendered frame count
   - On sceneReady, GSAP-animates to final pose
   - No useFrame overrides after entrance completes */
function EntranceController({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { sceneReady, markSceneReady } = usePageTransition();
  const frameCount = useRef(0);
  const entranceDone = useRef(false);
  const { gl } = useThree();

  // Track rendered frames + signal ready after 5 frames
  useFrame(() => {
    frameCount.current++;
    if (frameCount.current === 5) {
      markSceneReady();
    }
  });

  // GSAP entrance when sceneReady flips
  useEffect(() => {
    if (!sceneReady || entranceDone.current || !groupRef.current) return;
    entranceDone.current = true;

    const el = groupRef.current;
    gsap.to(el.position, {
      z: 0,
      duration: 1.1,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(el.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.1,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(el.rotation, {
      x: 0,
      y: 0,
      duration: 1.0,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [sceneReady]);

  return (
    <group
      ref={groupRef}
      scale={[0.91, 0.91, 0.91]}
      position={[0, 0, -0.35]}
      rotation={[0.035, -0.045, 0]}
    >
      {children}
    </group>
  );
}

export default function AISpace({ scrollProgress = 0, hoveredChapter = null, stageProgress = 0, mobileHero = false }: { scrollProgress?: number; hoveredChapter?: string | null; stageProgress?: number; mobileHero?: boolean }) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: true, toneMapping: 3, toneMappingExposure: 0.7 }}
        dpr={mobileHero ? 1 : [1, 2]}
        performance={{ min: 0.6 }}
        style={{ width: "100%", height: "100%" }}
      >
        <CameraController scrollProgress={scrollProgress} mobileHero={mobileHero} />
        <SceneEnvironment />
        {!mobileHero && <AmbientParticles />}
        <DynamicLight />
        <EntranceController>
          <HeroObject scrollProgress={scrollProgress} hoveredChapter={hoveredChapter} stageProgress={stageProgress} />
          {!mobileHero && <HeroText3D scrollProgress={scrollProgress} stageProgress={stageProgress} />}
        </EntranceController>
        {!mobileHero && (
          <>
            <ProjectNode index={0} title="AI-BRAIN" position={[1.2, 1.5, 1.2]} />
            <ProjectNode index={1} title="AI-CREATION" position={[-1.5, 3, 1.8]} />
            <ProjectNode index={2} title="AI-WORKFLOW" position={[1.8, 4.5, 2.2]} />
            <ProjectNode index={3} title="AI-THINKING" position={[-2, 6, 2.5]} />
            <EffectComposer>
              <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.05} intensity={0.5} mipmapBlur />
            </EffectComposer>
          </>
        )}
      </Canvas>
    </div>
  );
}
