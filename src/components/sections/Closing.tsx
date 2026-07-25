"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Closing() {
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

      // Name characters — Playfair Display, character-by-character
      const nameChars = sectionRef.current?.querySelectorAll<HTMLElement>(".cc-name");
      if (nameChars) {
        gsap.set(nameChars, { opacity: 0, y: 28 });
        gsap.to(nameChars, {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        });
      }

      // Subtitle
      const subtitle = sectionRef.current?.querySelector<HTMLElement>(".cc-sub");
      if (subtitle) {
        gsap.fromTo(subtitle,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true }
          }
        );
      }

      // Email
      const email = sectionRef.current?.querySelector<HTMLElement>(".cc-email");
      if (email) {
        gsap.fromTo(email,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nameCN = "任政宇";
  const nameEN = "REN ZHENGYU";

  return (
    <section
      ref={sectionRef}
      id="closing"
      className="h-screen relative flex items-center justify-center overflow-hidden select-none"
      
    >
      {/* Very subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)" }}
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
          13
        </span>
      </div>

      {/* Center content */}
      <div className="text-center z-10 px-8">
        {/* Chinese name — Playfair character animation */}
        <div className="overflow-hidden mb-1">
          <h2 className="flex flex-wrap justify-center gap-x-[0.04em]">
            {nameCN.split("").map((char, i) => (
              <span
                key={`cn-${i}`}
                className="cc-name inline-block"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(2.5rem, 7vw, 5rem)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  color: "#f5f5f5",
                  lineHeight: 1.2,
                }}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* English name */}
        <div className="overflow-hidden mb-4">
          <h2 className="flex flex-wrap justify-center gap-x-[0.06em]">
            {nameEN.split("").map((char, i) => (
              <span
                key={`en-${i}`}
                className="cc-name inline-block"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
                  fontWeight: 300,
                  letterSpacing: "0.12em",
                  color: "#999",
                  lineHeight: 1.4,
                }}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="cc-sub text-xs md:text-sm tracking-[0.15em] font-light mt-2"
          style={{ color: "#555", fontFamily: "var(--font-inter)" }}
        >
          VISUAL CREATOR
        </p>

        {/* Divider — thin line */}
        <div className="cc-sub mx-auto my-6 md:my-8 w-6 h-px" style={{ background: "#444" }} />

        {/* Contact email */}
        <div className="cc-email">
          <a
            href="mailto:hi@renzhengyu.com"
            className="relative inline-block text-xs md:text-sm tracking-[0.08em] font-light transition-all duration-300 hover:opacity-60 group"
            style={{ color: "#777", fontFamily: "var(--font-inter)" }}
          >
            hi@renzhengyu.com
          </a>
        </div>
      </div>
    </section>
  );
}
