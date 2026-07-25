"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function SelectedWorksTitle() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Chapter number fade-in
      if (numberRef.current) {
        gsap.fromTo(
          numberRef.current,
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true }
          }
        );
      }

      // SplitText-style character animation
      const chars = sectionRef.current?.querySelectorAll<HTMLElement>(".ic-char");
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 24, rotateX: 12 });
        gsap.to(chars, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
        });
      }

      // Subtitle fade-in
      const sub = sectionRef.current?.querySelector<HTMLElement>(".ic-sub");
      if (sub) {
        gsap.fromTo(sub,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const enTitle = "SELECTED WORKS";
  const words = enTitle.split(" ");

  return (
    <section
      ref={sectionRef}
      className="h-[54vw] md:h-screen relative overflow-hidden select-none"
      style={{ background: "#000" }}
    >
      {/* Ambient light — very subtle center glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.04) 0%, transparent 65%)" }}
      />

      {/* Chapter number — top-right in mono */}
      <div
        ref={numberRef}
        className="absolute top-4 right-4 md:top-14 md:right-16 z-10"
      >
        <span
          className="text-sm tracking-[0.15em] font-mono"
          style={{ color: "#666" }}
        >
          01
        </span>
      </div>

      {/* Title — centered, two-word typography hierarchy */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10">
        {/* Line 1: SELECTED */}
        <div className="overflow-hidden">
          <h2 className="flex flex-wrap justify-center gap-x-[0.15em]">
            {words[0].split("").map((char, i) => (
              <span
                key={`a-${i}`}
                className="ic-char inline-block"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2rem, 6vw, 5rem)",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  color: "#f5f5f5",
                  lineHeight: 1.15,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {/* Line 2: WORKS — slightly smaller, same style */}
        <div className="overflow-hidden mt-[-0.08em]">
          <h2 className="flex flex-wrap justify-center gap-x-[0.15em]">
            {words[1].split("").map((char, i) => (
              <span
                key={`b-${i}`}
                className="ic-char inline-block"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2rem, 6vw, 5rem)",
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  color: "#f5f5f5",
                  lineHeight: 1.15,
                }}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Chinese subtitle */}
        <p
          className="ic-sub mt-3 md:mt-10 text-base md:text-4xl tracking-[0.25em] font-light"
          style={{ color: "#555", fontFamily: "var(--font-inter)" }}
        >
          精选作品
        </p>
      </div>
    </section>
  );
}
