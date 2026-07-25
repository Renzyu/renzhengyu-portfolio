"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function AICreativeLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleRef.current;
      if (!title) return;

      const words = title.querySelectorAll(".lab-word");
      words.forEach((word, i) => {
        const chars = word.querySelectorAll(".lab-char");
        gsap.fromTo(
          chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.03,
            delay: i * 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "center center",
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-fullscreen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Section number */}
      <div className="absolute top-8 left-8 z-10">
        <span className="section-number">01</span>
      </div>

      {/* Title */}
      <div ref={titleRef} className="text-center z-10 px-4">
        <div className="lab-word inline-block">
          {"AI".split("").map((char, i) => (
            <span
              key={`ai-${i}`}
              className="lab-char inline-block text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text)" }}
            >
              {char}
            </span>
          ))}
        </div>
        <br className="md:hidden" />
        <div className="lab-word inline-block mt-2 md:mt-0">
          {"CREATIVE".split("").map((char, i) => (
            <span
              key={`creative-${i}`}
              className="lab-char inline-block text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mt-4"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-secondary)" }}
            >
              {char}
            </span>
          ))}
        </div>
        <br />
        <div className="lab-word inline-block">
          {"LAB".split("").map((char, i) => (
            <span
              key={`lab-${i}`}
              className="lab-char inline-block text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mt-4"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
            >
              {char}
            </span>
          ))}
        </div>

        <div
          className="mt-12 text-sm md:text-base font-light max-w-md mx-auto px-4"
          style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
        >
          Exploring new visual workflows
          <br />
          between cinema and intelligence.
        </div>
      </div>
    </section>
  );
}
