"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { assetPath } from "@/lib/asset-path";
import ScrollHint from "@/components/layout/ScrollHint";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const catchlightRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const nameCnRef = useRef<HTMLParagraphElement>(null);
  const nameEnRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const eye = eyeRef.current;
    const plx = parallaxRef.current;
    const catchlight = catchlightRef.current;
    const mouseGlow = mouseGlowRef.current;
    if (!section || !eye || !plx || !catchlight || !mouseGlow) return;

    let scrollProgress = 0;
    let mx = 0.5, my = 0.5;
    let smx = 0.5, smy = 0.5;
    // Separate, slower smooth for the parallax tilt to feel "heavy" like glass
    let tiltX = 0, tiltY = 0;

    // ── GSAP: entrance + scroll text fade ──
    const ctx = gsap.context(() => {
      gsap.set(eye, { opacity: 0.3, scale: 1.04, filter: "blur(24px)" });
      gsap.set(scrollHintRef.current, { opacity: 0 });
      gsap.set(numberRef.current, { opacity: 0, y: 8 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(eye, { opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.inOut" }, "+=0.05")
        .to(eye, { scale: 1, duration: 1.8, ease: "power1.inOut" }, "-=1.5");

      tl.to(nameCnRef.current, { opacity: 1, y: 0, duration: 0.7 }, "+=0.2")
        .to(nameEnRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .to(subtitleRef.current, { opacity: 1, duration: 0.6 }, "-=0.3")
        .to(scrollHintRef.current, { opacity: 0.4, duration: 0.6 }, "-=0.2")
        .to(numberRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress = self.progress;
          const t = 1 - scrollProgress;
          if (nameCnRef.current) nameCnRef.current.style.opacity = String(t);
          if (nameEnRef.current) nameEnRef.current.style.opacity = String(t);
          if (subtitleRef.current) subtitleRef.current.style.opacity = String(t);
        },
      });
    }, section);

    // Touch devices keep the cinematic entrance without spending battery on
    // mouse-only parallax and glow calculations.
    if (window.matchMedia("(pointer: coarse)").matches) {
      catchlight.style.opacity = "0";
      mouseGlow.style.opacity = "0";
      return () => ctx.revert();
    }

    // ── Continuous micro-animation + 3D parallax loop ──
    let rafId: number;
    let startTime = performance.now();
    const catchlightPhase = Math.random() * Math.PI * 2;

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // ── Responsive mouse follow (for glow + catchlight) ──
      smx += (mx - smx) * 0.08;
      smy += (my - smy) * 0.08;

      // ── Heavy tilt follow (slower, for parallax feeling of mass) ──
      // Map mouse to -1..1 range, then to rotation degrees
      const targetTiltX = (my - 0.5) * -2.4; // max ±1.2°
      const targetTiltY = (mx - 0.5) * 2.4;  // max ±1.2°
      tiltX += (targetTiltX - tiltX) * 0.035;
      tiltY += (targetTiltY - tiltY) * 0.035;

      // ── Breathing ──
      const breathScale = 1 + Math.sin(elapsed * 0.4) * 0.002 + Math.sin(elapsed * 0.23) * 0.001;
      const breathBlur = Math.abs(Math.sin(elapsed * 0.35)) * 0.15 + Math.abs(Math.sin(elapsed * 0.19)) * 0.08;

      // ── Parallax perspective — Apple 3D depth effect ──
      // The image itself gets a subtle 3D tilt
      const tiltMag = Math.abs(tiltX) + Math.abs(tiltY);
      const parallaxScale = 1 + tiltMag * 0.003; // very slight scale-up when tilting
      const scrollScale = 1 + scrollProgress * 0.08;
      const totalScale = scrollScale * breathScale * parallaxScale;

      // After entrance animation (~2s), apply micro-animations + 3D parallax
      if (elapsed > 2) {
        // Eye image container: 3D perspective tilt
        eye.style.transform = `scale(${totalScale})`;
        eye.style.filter = `blur(${breathBlur}px)`;

        // Parallax layer: subtle 3D rotation with perspective
        // This sits above the eye and creates the "glass pane tilting" feel
        plx.style.transform = `
          perspective(800px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale(${1 + tiltMag * 0.002})
        `;
      }

      // ── Catchlight — follows mouse more responsively ──
      // Still has some autonomous drift but now heavily biased by mouse
      const catchX = 0.4 + 0.12 * Math.sin(elapsed * 0.12 + catchlightPhase) + (smx - 0.5) * 0.25;
      const catchY = 0.38 + 0.08 * Math.cos(elapsed * 0.1 + catchlightPhase * 1.3) + (smy - 0.5) * 0.25;
      const catchPulse = 0.5 + 0.25 * Math.sin(elapsed * 0.06 + catchlightPhase * 0.7);

      catchlight.style.opacity = String(catchPulse);
      catchlight.style.left = `${catchX * 100}%`;
      catchlight.style.top = `${catchY * 100}%`;

      // ── Mouse glow ──
      const glowSize = 500 + 60 * Math.sin(elapsed * 0.05);
      mouseGlow.style.width = `${glowSize}px`;
      mouseGlow.style.height = `${glowSize}px`;
      mouseGlow.style.left = `${smx * 100}%`;
      mouseGlow.style.top = `${smy * 100}%`;
      mouseGlow.style.opacity = String(0.3 + 0.15 * Math.sin(elapsed * 0.04));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-fullscreen relative overflow-hidden"
      style={{ background: "oklch(0.04 0.005 300)" }}
    >
      {/* Section number */}
      <div ref={numberRef} className="absolute top-8 left-8 z-20">
        <span className="section-number">00</span>
      </div>

      {/* Eye image — receives breathing + scroll */}
      <div
        ref={eyeRef}
        className="absolute inset-0 z-0"
        style={{
          willChange: "transform, opacity, filter",
          transformOrigin: "center center",
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={assetPath("/optimized-images/hero/hero-desktop.webp")}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Glass parallax layer — 3D tilt creates Apple depth effect */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          willChange: "transform",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Edge highlight — follows 3D tilt to feel like light catching glass */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(200,215,255,0.008) 25%, transparent 50%, rgba(200,215,255,0.005) 75%, rgba(255,255,255,0.01) 100%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Catchlight / iris highlight */}
      <div
        ref={catchlightRef}
        className="absolute z-[2] pointer-events-none"
        style={{
          width: "clamp(40px, 8vw, 120px)",
          height: "clamp(40px, 8vw, 120px)",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 20%, rgba(200,220,255,0.03) 40%, transparent 60%)",
          transform: "translate(-50%, -50%)",
          willChange: "transform, opacity, left, top",
          opacity: 0,
          mixBlendMode: "screen",
        }}
      />

      {/* Mouse glow */}
      <div
        ref={mouseGlowRef}
        className="absolute z-[2] pointer-events-none"
        style={{
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,215,255,0.015) 0%, rgba(180,200,240,0.005) 30%, transparent 60%)",
          transform: "translate(-50%, -50%)",
          willChange: "transform, left, top, opacity",
          mixBlendMode: "screen",
          opacity: 0.3,
        }}
      />

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none z-[3]" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-[3]" />

      {/* Bottom-left name text */}
      <div className="absolute bottom-12 left-4 md:bottom-16 md:left-16 z-20">
        <p
          ref={nameCnRef}
          className="text-4xl md:text-6xl font-semibold tracking-[0.05em] opacity-0 mb-1"
          style={{ fontFamily: "var(--font-inter)", color: "#999", y: 8, willChange: "transform, opacity" }}
        >
          任政宇
        </p>
        <h1
          ref={nameEnRef}
          className="text-lg md:text-xl font-light tracking-[0.12em] opacity-0"
          style={{ fontFamily: "var(--font-inter)", y: 8, willChange: "transform, opacity" }}
        >
          REN ZHENGYU
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl opacity-0 mt-1 font-light"
          style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-secondary)", willChange: "opacity" }}
        >
          Visual Creator
        </p>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="opacity-0 z-20">
        <ScrollHint />
      </div>
    </section>
  );
}
