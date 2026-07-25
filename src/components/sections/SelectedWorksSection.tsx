"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SelectedWorksTitle from "./SelectedWorksTitle";
import ProjectSlide from "./ProjectSlide";
import NarrativeSlide from "./NarrativeSlide";
import { selectedWorks, narrativeWorks } from "@/data/projects";

export default function SelectedWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLElement>(null);
  const narrativeTitleRef = useRef<HTMLDivElement>(null);

  const commercialProjects = selectedWorks;
  const narrativeProjects = narrativeWorks;

  // GSAP: narrative section entry
  useEffect(() => {
    const el = narrativeRef.current;
    const titleEl = narrativeTitleRef.current;
    if (!el || !titleEl) return;

    const ctx = gsap.context(() => {
      // Title characters
      const chars = titleEl.querySelectorAll<HTMLElement>(".nc-char");
      if (chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 24 });

        ScrollTrigger.create({
          trigger: el,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out",
            });
          },
        });
      }

      // Chapter number
      const num = titleEl.querySelector<HTMLElement>(".nc-number");
      if (num) {
        gsap.set(num, { opacity: 0, x: -12 });
        ScrollTrigger.create({
          trigger: el, start: "top 70%", once: true,
          onEnter: () => {
            gsap.to(num, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" });
          },
        });
      }

      // Narrative project cards — staggered fade-up
      const cards = el.querySelectorAll<HTMLElement>(".nc-card");
      cards.forEach((card, i) => {
        gsap.set(card, { opacity: 0, y: 60 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1, y: 0, duration: 0.9, delay: i * 0.12, ease: "power3.out",
            });
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative" id="selected-works">
      {/* === CHAPTER TITLE CARD: SELECTED WORKS === */}
      <SelectedWorksTitle />

      {/* === COMMERCIAL FILM CHAPTERS (02–08) === */}
      {commercialProjects.map((project, i) => (
        <ProjectSlide key={project.id} project={project} index={i} />
      ))}

      {/* === NARRATIVE / DOCUMENTARY CHAPTER === */}
      <section
        ref={narrativeRef}
        className="relative"
        style={{ background: "#000" }}
      >
        {/* Title screen for narrative section */}
        <div
          ref={narrativeTitleRef}
          className="h-[54vw] md:h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
        >
          {/* Ambient light */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.03) 0%, transparent 65%)" }}
          />

          {/* Chapter number */}
          <div className="nc-number absolute top-10 right-10 md:top-14 md:right-16">
            <span
              className="text-sm tracking-[0.15em] font-mono"
              style={{ color: "#666" }}
            >
              {`${String(commercialProjects.length + 2).padStart(2, "0")}`}
            </span>
          </div>

          {/* Title */}
          <div className="text-center px-8 z-10">
            <div className="overflow-hidden">
              <h2 className="flex flex-wrap justify-center gap-x-[0.1em]">
                {"NARRATIVE".split("").map((char, i) => (
                  <span
                    key={`n-${i}`}
                    className="nc-char inline-block"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.8rem, 6vw, 4.5rem)",
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
            <div className="overflow-hidden mt-[-0.05em]">
              <h2 className="flex flex-wrap justify-center gap-x-[0.1em]">
                {"DOCUMENTARY".split("").map((char, i) => (
                  <span
                    key={`d-${i}`}
                    className="nc-char inline-block"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.8rem, 6vw, 4.5rem)",
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                      color: "#999",
                      lineHeight: 1.2,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </div>

        {/* Narrative project film strips — full-bleed image chapters */}
        <div className="flex flex-col">
          {narrativeProjects.map((project, i) => {
            const coverSrc = project.images.cover.desktop;
            const chapterNum = String(commercialProjects.length + 3 + i);

            // Build gallery for projects with multiple images
            const galleryImgs =
              project.images.gallery.length > 0
                ? project.images.gallery
                : [coverSrc];
            const hasGallery = galleryImgs.length > 1;

            return (
              <div
                key={project.id}
                className="nc-card relative h-[56.25vw] md:h-screen w-full overflow-hidden select-none"
                style={{ background: "#000" }}
              >
                <NarrativeSlide
                  project={project}
                  coverSrc={coverSrc}
                  galleryImgs={galleryImgs}
                  hasGallery={hasGallery}
                  chapterNum={chapterNum}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
