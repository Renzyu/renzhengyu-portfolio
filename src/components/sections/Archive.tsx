"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const archiveYears = [
  { year: "2025", label: "更多作品" },
  { year: "2024", label: "更多作品" },
  { year: "2023", label: "更多作品" },
];

export default function Archive() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Chapter number
      if (numberRef.current) {
        gsap.fromTo(numberRef.current,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true }
          }
        );
      }

      // Title characters
      const chars = sectionRef.current?.querySelectorAll<HTMLElement>(".ac-char");
      if (chars) {
        gsap.set(chars, { opacity: 0, y: 20 });
        gsap.to(chars, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        });
      }

      // Year items
      const items = sectionRef.current?.querySelectorAll<HTMLElement>(".ac-item");
      if (items) {
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.to(items, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="h-screen relative flex flex-col items-center justify-center overflow-hidden select-none"
      
    >
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 60%)" }}
      />

      {/* Chapter number */}
      <div
        ref={numberRef}
        className="absolute top-10 right-10 md:top-14 md:right-16 z-10"
      >
        <span
          className="text-sm tracking-[0.15em] font-mono"
          style={{ color: "#666" }}
        >
          12
        </span>
      </div>

      {/* Title */}
      <div className="text-center px-8 z-10 mb-12 md:mb-16">
        <h2 className="flex flex-wrap justify-center gap-x-[0.12em]">
          {"ARCHIVE".split("").map((char, i) => (
            <span
              key={i}
              className="ac-char inline-block"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2rem, 7vw, 5rem)",
                fontWeight: 400,
                letterSpacing: "0.04em",
                color: "#f5f5f5",
                lineHeight: 1.2,
              }}
            >
              {char}
            </span>
          ))}
        </h2>
      </div>

      {/* Year list — minimal, text-only */}
      <div className="flex flex-col items-center gap-6 z-10">
        {archiveYears.map((item) => (
          <div
            key={item.year}
            className="ac-item flex items-baseline gap-6 md:gap-10"
          >
            <span
              className="text-lg md:text-2xl font-mono tracking-[0.1em]"
              style={{ color: "#555" }}
            >
              {item.year}
            </span>
            <span
              className="text-xs md:text-sm tracking-[0.12em] font-light uppercase"
              style={{ color: "#444" }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
