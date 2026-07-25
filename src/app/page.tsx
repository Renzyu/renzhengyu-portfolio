"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Hero from "@/components/sections/Hero";
import SelectedWorksSection from "@/components/sections/SelectedWorksSection";
import Archive from "@/components/sections/Archive";
import Closing from "@/components/sections/Closing";
import NavBar from "@/components/layout/NavBar";
import { usePageTransition } from "@/components/layout/PageTransition";

export default function Home() {
  const labRef = useRef<HTMLElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const edgeLightRef = useRef<HTMLDivElement>(null);
  const scatterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { startAiOsTransition } = usePageTransition();

  // Glass volumetric light system
  useEffect(() => {
    const glass = glassRef.current;
    const edge = edgeLightRef.current;
    const scatter = scatterRef.current;
    const glow = glowRef.current;
    if (!glass || !edge || !scatter || !glow) return;

    let rafId: number;
    let mx = 0.5, my = 0.5;
    let scrollProgress = 0;
    let smoothMx = 0.5, smoothMy = 0.5;

    const tick = () => {
      // Slow smooth follow for mouse
      smoothMx += (mx - smoothMx) * 0.08;
      smoothMy += (my - smoothMy) * 0.08;

      const px = smoothMx * 100;
      const py = smoothMy * 100;

      // Edge light — light enters from the side nearest the mouse
      // If mouse is on left half, light enters from left edge; right half from right edge
      const edgeX = smoothMx < 0.5 ? smoothMx * 2 : (1 - smoothMx) * 2;
      const edgeY = smoothMy < 0.5 ? smoothMy * 2 : (1 - smoothMy) * 2;
      
      // Edge light — multi-direction volumetric light entering from glass edges
      const edgeAngle = smoothMx < 0.5 ? 0 : 180;
      const vertAngle = smoothMy < 0.5 ? 270 : 90;
      
      // Smooth edge light — slower, softer, no jitter
      const distX = Math.abs(smoothMx - 0.5) * 2;
      const distY = Math.abs(smoothMy - 0.5) * 2;
      edge.style.background = `
        radial-gradient(ellipse at ${10 + smoothMx * 80}% ${50 + (smoothMy - 0.5) * 20}%, 
          rgba(180,210,245,${0.18 * (1 - distX * 0.3)}) 0%, 
          rgba(160,195,240,${0.08 * (1 - distX * 0.3)}) 20%, 
          transparent 50%
        )
      `;

      // Subsurface scattering — light diffusing through the glass volume
      scatter.style.background = `
        radial-gradient(
          ellipse at ${px}% ${py}%, 
          rgba(220,230,255,${0.12 + 0.08 * (1 - edgeX)}) 0%, 
          rgba(180,200,240,${0.06 * (1 - edgeX)}) 15%, 
          rgba(160,185,230,${0.03}) 30%, 
          rgba(160,180,220,${0.006}) 50%, 
          transparent 70%
        ),
        radial-gradient(
          ellipse at ${100 - px}% ${100 - py}%, 
          rgba(180,190,245,${0.08}) 0%, 
          rgba(180,190,230,${0.01}) 25%, 
          transparent 50%
        ),
        radial-gradient(
          ellipse at ${50 + (smoothMx - 0.5) * 30}% ${50 + (smoothMy - 0.5) * 30}%, 
          rgba(220,225,250,${0.015}) 0%, 
          transparent 40%
        )
      `;

      // Glass layer — subtle parallax shift
      glass.style.transform = `translate(${(smoothMx - 0.5) * 8}px, ${(smoothMy - 0.5) * 8}px)`;
      glass.style.background = `
        radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.02) 0%, transparent 50%)
      `;

      // Mouse glow - very subtle, large, slow
      glow.style.transform = `translate3d(${smoothMx * window.innerWidth - 400}px, ${smoothMy * window.innerHeight - 400}px, 0)`;
    };

    const loop = () => { tick(); rafId = requestAnimationFrame(loop); };

    const onMouse = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      mx = t.clientX / window.innerWidth;
      my = t.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    loop();

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP: AI Lab entry
  useEffect(() => {
    if (!labRef.current) return;
    const ctx = gsap.context(() => {
      const items = labRef.current?.querySelectorAll(".lab-item");
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: labRef.current, start: "top 80%" }
          }
        );
      }
    }, labRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative">
      {/* Layer 0: Deep black base */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "#000" }} />

      {/* Layer 1: Spatial glass panel — edge-lit, full-bleed, no visible boundary */}
      <div
        ref={glassRef}
        className="fixed inset-0 z-[1] pointer-events-none will-change-transform"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(200,215,255,0.025) 0%, transparent 50%)",
          
        }}
      />

      {/* Layer 2: Volumetric edge light — full-page glass illumination */}
      <div
        ref={edgeLightRef}
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 3: Volumetric scatter — light diffusing inside the glass */}
      <div
        ref={scatterRef}
        className="fixed inset-0 z-[3] pointer-events-none"
        style={{
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 4: Subtle noise texture for glass surface */}
      <div className="fixed inset-0 z-[4] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Layer 5: Mouse glow — slow, wide beam */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-[5] will-change-transform"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,215,255,0.03) 0%, rgba(180,200,240,0.01) 30%, transparent 60%)",
          left: "0",
          top: "0",
        }}
      />

      <NavBar />

      <Hero />

      <div id="selected-works">
        <SelectedWorksSection />
      </div>

      <Archive />

      {/* AI Lab Entry */}
      <section
        ref={labRef}
        id="ai-lab-entry"
        className="relative h-[60vh] flex items-center justify-center overflow-hidden group cursor-pointer select-none"
        style={{ background: "transparent" }}
      >
        <div className="absolute inset-0 pointer-events-none transition-all duration-700 group-hover:scale-105"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-x-[20%] bottom-0 h-px bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />

        <div className="text-center z-10 px-4">
          <span
            onClick={(e) => startAiOsTransition(e.currentTarget, "project-card")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startAiOsTransition(e.currentTarget, "project-card");
              }
            }}
            tabIndex={0}
            role="link"
            aria-label="Navigate to AI Creative Lab"
            className="lab-item inline-flex flex-col items-center gap-2 cursor-pointer group"
          >
            <span className="text-3xl md:text-5xl lg:text-6xl text-white font-light tracking-[0.04em] group-hover:text-blue-200/80 transition-all duration-500">
              AI Creative Lab
            </span>
            <span className="flex items-center gap-2 text-sm md:text-base text-gray-500 group-hover:text-gray-300 transition-all duration-500">
              <span className="h-px w-8 bg-gray-600 group-hover:bg-gray-400 transition-all duration-500" />
              EXPLORE
              <span className="h-px w-8 bg-gray-600 group-hover:bg-gray-400 transition-all duration-500" />
            </span>
          </span>
          <p className="lab-item mt-6 text-sm md:text-base font-light text-gray-500 max-w-md mx-auto">
            A cinematic laboratory where human vision meets machine intelligence.
          </p>
        </div>
      </section>

      <Closing />
    </main>
  );
}
