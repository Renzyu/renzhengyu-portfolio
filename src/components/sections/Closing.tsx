"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { assetPath } from "@/lib/asset-path";

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

      // Collaboration and contact details
      const contact = sectionRef.current?.querySelector<HTMLElement>(".cc-contact");
      if (contact) {
        gsap.fromTo(contact,
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
      className="min-h-screen relative flex items-center justify-center overflow-hidden select-none py-16 md:py-24"
      
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

        {/* Collaboration and direct contact */}
        <div className="cc-contact flex flex-col items-center gap-3 font-light" style={{ fontFamily: "var(--font-inter)" }}>
          <p className="text-lg md:text-2xl tracking-[0.1em]" style={{ color: "#d0d0d0" }}>
            期待与您合作。
          </p>
          <div className="flex flex-col items-center gap-2 text-base md:text-xl tracking-[0.06em]" style={{ color: "#aaa" }}>
            <a href="tel:18695233332" className="transition-colors duration-300 hover:text-white">
              186 9523 3332
            </a>
            <a href="mailto:705618783@qq.com" className="transition-colors duration-300 hover:text-white">
              705618783@qq.com
            </a>
          </div>
          <div className="mt-5 flex flex-col items-center">
            <p className="text-sm md:text-base tracking-[0.16em]" style={{ color: "rgba(225,230,242,0.72)" }}>
              我的微信号
            </p>
            <span className="mt-2 text-xl leading-none animate-breathe" style={{ color: "rgba(190,160,235,0.78)" }} aria-hidden>
              ↓
            </span>
            <div
              className="relative mt-4 rounded-[28px] p-3 md:p-4"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.13), rgba(176,126,226,0.055))",
                border: "1px solid rgba(221,194,255,0.35)",
                boxShadow: "0 0 22px rgba(177,103,224,0.18), 0 0 64px rgba(97,141,238,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[34px]"
                style={{
                  background: "linear-gradient(135deg, rgba(205,105,194,0.16), rgba(116,134,246,0.14))",
                  filter: "blur(18px)",
                }}
              />
              <img
                src={assetPath("/images/contact/wechat-qr.jpg")}
                alt="任政宇的微信二维码"
                width={709}
                height={707}
                loading="lazy"
                decoding="async"
                className="block h-auto w-[min(72vw,320px)] rounded-[18px] md:w-[360px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
