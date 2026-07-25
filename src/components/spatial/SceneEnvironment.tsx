"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function SceneEnvironment() {
  return (
    <>
      <fog attach="fog" args={["#000", 4, 12]} />

      <ambientLight intensity={0.04} color="#506888" />

      {/* Key light — upper-left, cool */}
      <directionalLight position={[5, 7, 4]} intensity={0.5} color="#b0c8e0" />

      {/* Rim — right-back */}
      <directionalLight position={[-4, 1, -4]} intensity={0.15} color="#7098b8" />

      {/* Front fill */}
      <pointLight position={[0, 2, 5]} intensity={0.06} color="#507090" distance={10} />{/* Local HDR + Lightformers for controlled reflections */}
      <Environment files="/studio.hdr" resolution={256}>
        {/* Top-wide cold reflection band — creates main highlight on ring */}
        <Lightformer
          form="rect"
          position={[0, 6, -3]}
          intensity={0.6}
          color="#e4f0ff"
          scale={[6, 1.5, 1]}
        />

        {/* Front-left fill card — midtones */}
        <Lightformer
          form="rect"
          position={[-4, 1, 4]}
          intensity={0.25}
          color="#c8e0f8"
          scale={[3, 3, 1]}
        />

        {/* Right-back rim card — edge separation */}
        <Lightformer
          form="rect"
          position={[4, 0, -5]}
          intensity={0.15}
          color="#7890b8"
          scale={[1.5, 4, 1]}
        />

        {/* Low cool under-light — subtle bottom fill */}
        <Lightformer
          form="rect"
          position={[0, -4, 2]}
          intensity={0.08}
          color="#6080a8"
          scale={[2, 1, 1]}
        />
      </Environment>
    </>
  );
}
