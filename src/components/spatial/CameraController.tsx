"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraController({ scrollProgress = 0, mobileHero = false }: { scrollProgress?: number; mobileHero?: boolean }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const targetTheta = useRef(0);
  const targetPhi = useRef(0.1);
  const theta = useRef(0);
  const phi = useRef(0.1);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;
    const cam = camera as THREE.PerspectiveCamera;

    const targetDist = (mobileHero ? 1.65 : 2.5) + scrollProgress * 4.5;

    targetTheta.current = t * 0.005 + (mouse.current.x - 0.5) * 0.08;
    targetPhi.current = 0.08 + 0.02 * Math.sin(t * 0.005) + (mouse.current.y - 0.5) * 0.04;

    const lerp = 1 - Math.exp(-delta * 1.5);
    theta.current += (targetTheta.current - theta.current) * lerp;
    phi.current += (targetPhi.current - phi.current) * lerp;

    const dist = targetDist;
    const cx = dist * Math.sin(theta.current) * Math.cos(phi.current);
    const cy = dist * Math.sin(phi.current);
    const cz = dist * Math.cos(theta.current) * Math.cos(phi.current);

    cam.position.set(cx, cy, cz);
    cam.lookAt(0, 0, 0);
    cam.fov = mobileHero ? 34 : 30;
    cam.near = 0.1;
    cam.far = 25;
    cam.updateProjectionMatrix();
  });

  return null;
}
