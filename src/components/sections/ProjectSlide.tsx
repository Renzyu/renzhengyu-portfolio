"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { Project } from "@/data/projects";

interface ProjectSlideProps {
  project: Project;
  index: number;
}

export default function ProjectSlide({ project, index }: ProjectSlideProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const watchLabelRef = useRef<HTMLDivElement>(null);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [arrowHovered, setArrowHovered] = useState<"left" | "right" | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Build gallery from project.images.gallery, fallback to cover
  const gallery =
    project.images.gallery.length > 0
      ? project.images.gallery
      : [project.images.cover.desktop];

  const total = gallery.length;
  const currentSrc = gallery[galleryIndex];

  // Navigation
  const prevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setGalleryIndex((prev) => (prev - 1 + total) % total);
    },
    [total]
  );

  const nextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setGalleryIndex((prev) => (prev + 1) % total);
    },
    [total]
  );

  // Open film URL on click
  const handleClick = useCallback(() => {
    if (project.filmUrl) {
      window.open(project.filmUrl, "_blank", "noopener,noreferrer");
    }
  }, [project.filmUrl]);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        scale: 1.05,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setArrowHovered(null);
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, []);

  // Counter label (film-strip format: 01 / 05)
  const counter =
    total > 1
      ? `${String(galleryIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
      : "";

  // Chapter number — Iconoclast-style digital anchor (01, 02, 03...)
  const chapterNum = String(project.index).padStart(2, "0");

  // GSAP ScrollTrigger entry/leave
  useEffect(() => {
    const section = sectionRef.current;
    const image = imageContainerRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const number = numberRef.current;

    if (!section || !image || !overlay || !content || !number) return;

    const ctx = gsap.context(() => {
      gsap.set(image, { scale: 1.1, opacity: 0 });
      gsap.set(overlay, { opacity: 0 });
      gsap.set(number, { opacity: 0 });

      // Text reveal elements
      const revealInners = content.querySelectorAll<HTMLElement>(
        "[data-reveal-inner]"
      );
      gsap.set(revealInners, { y: "100%", opacity: 0 });

      gsap.set(content, { opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top-=20%",
        onEnter: () => {
          setIsVisible(true);

          gsap.to(image, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" });
          gsap.to(overlay, { opacity: 1, duration: 0.8, ease: "power2.out" });
          gsap.to(number, { opacity: 1, duration: 0.6, delay: 0.2 });

          gsap.to(content, { opacity: 1, duration: 0.01 });

          gsap.to(revealInners, {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
        onLeave: () => {
          setIsVisible(false);
          gsap.to(image, { scale: 1.05, opacity: 0.3, duration: 0.8, ease: "power2.in" });
          gsap.to(overlay, { opacity: 0, duration: 0.6 });
          gsap.to(content, { opacity: 0, duration: 0.4 });
          gsap.to(number, { opacity: 0, duration: 0.4 });

          gsap.to(revealInners, {
            y: "-40%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            stagger: 0.03,
          });
        },
        onEnterBack: () => {
          setIsVisible(true);
          gsap.set(image, { scale: 1.1, opacity: 0 });
          gsap.to(image, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" });
          gsap.to(overlay, { opacity: 1, duration: 0.8 });
          gsap.to(number, { opacity: 1, duration: 0.6, delay: 0.2 });

          gsap.set(revealInners, { y: "100%", opacity: 0 });
          gsap.to(content, { opacity: 1, duration: 0.01 });
          gsap.to(revealInners, {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          setIsVisible(false);
          gsap.to(image, { scale: 1.05, opacity: 0.3, duration: 0.8 });
          gsap.to(overlay, { opacity: 0, duration: 0.6 });
          gsap.to(content, { opacity: 0, duration: 0.4 });
          gsap.to(number, { opacity: 0, duration: 0.4 });

          gsap.to(revealInners, {
            y: "-40%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            stagger: 0.03,
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // GSAP watch label fade on hover
  useEffect(() => {
    if (!watchLabelRef.current) return;
    gsap.to(watchLabelRef.current, {
      opacity: hovered ? 1 : 0,
      y: hovered ? 0 : 8,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [hovered]);

  // Touch swipe for mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) {
          setGalleryIndex((prev) => (prev - 1 + total) % total);
        } else {
          setGalleryIndex((prev) => (prev + 1) % total);
        }
      }
    },
    [total]
  );

  return (
    <section
      ref={sectionRef}
      className="section-fullscreen relative overflow-hidden select-none bg-black"
    >
      {/* Interactive image area — full bleed */}
      <div
        className="absolute inset-0 z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* Gallery image */}
        <div
          ref={imageContainerRef}
          className="absolute inset-0"
          style={{ willChange: "transform, opacity", transform: "scale(1.1)" }}
        >
          <Image
            src={currentSrc}
            alt={project.title}
            fill
            className="object-cover"
            style={{ objectPosition: "center 25%" }}
            loading={index > 2 ? "lazy" : undefined}
            sizes="100vw"
            priority={index <= 2}
          />
        </div>

        {/* Black gradient overlays — deep cinema fade for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Dark overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.3)" }}
        />

        {/* "Watch Film" label on hover — cinemascope center */}
        <div
          ref={watchLabelRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border border-white/30 bg-black/30 backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <polygon points="6,3 19,11 6,19" fill="white" />
              </svg>
            </div>
            <span className="text-white/70 text-xs md:text-sm tracking-[0.12em] uppercase font-light">
              Watch Film
            </span>
          </div>
        </div>
      </div>

      {/* Left arrow */}
      {total > 1 && (
        <button
          onClick={prevImage}
          onMouseEnter={() => setArrowHovered("left")}
          onMouseLeave={() => setArrowHovered(null)}
          className="absolute left-3 md:left-10 top-1/2 z-20 p-3 cursor-pointer bg-transparent border-0 outline-0"
          style={{
            opacity: hovered ? 0.8 : 0.3,
            transform: `translateY(-50%) ${arrowHovered === "left" ? "translateX(-5px)" : "translateX(0)"}`,
          }}
          aria-label="Previous image"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="transition-all duration-300">
            <line x1="22" y1="10" x2="14" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <line x1="22" y1="26" x2="14" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {total > 1 && (
        <button
          onClick={nextImage}
          onMouseEnter={() => setArrowHovered("right")}
          onMouseLeave={() => setArrowHovered(null)}
          className="absolute right-3 md:right-10 top-1/2 z-20 p-3 cursor-pointer bg-transparent border-0 outline-0"
          style={{
            opacity: hovered ? 0.8 : 0.3,
            transform: `translateY(-50%) ${arrowHovered === "right" ? "translateX(5px)" : "translateX(0)"}`,
          }}
          aria-label="Next image"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="transition-all duration-300">
            <line x1="14" y1="10" x2="22" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round" />
            <line x1="14" y1="26" x2="22" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Image counter — bottom right, film-strip counter */}
      {total > 1 && (
        <div className="absolute bottom-6 md:bottom-12 right-5 md:right-12 z-20 pointer-events-none">
          <span className="text-[11px] md:text-sm tracking-[0.12em] font-light text-white/50">
            {counter}
          </span>
        </div>
      )}

      {/* Chapter number — top right, Iconoclast-style digital anchor */}
      <div
        ref={numberRef}
        className="absolute top-6 right-6 md:top-10 md:right-12 z-20 pointer-events-none"
      >
        <span className="text-[4rem] md:text-[7rem] font-light tracking-[0.05em] text-white/70 select-none">
          {chapterNum}
        </span>
      </div>

      {/* Content — bottom left, Iconoclast-style minimal film credits */}
      <div className="absolute bottom-6 md:bottom-16 left-5 md:left-12 z-20 pointer-events-none">
        <div
          ref={contentRef}
          className="relative max-w-[75%] md:max-w-lg"
          style={{ willChange: "transform, opacity" }}
        >
          {/* Brand (English) — dominant text, light weight */}
          <div className="text-reveal">
            <h2
              data-reveal-inner
              className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light tracking-wide text-white mb-0.5 md:mb-1"
              style={{ willChange: "transform, opacity" }}
            >
              {project.brand}
            </h2>
          </div>

          {/* Brand (Chinese) — subtle secondary */}
          {project.brandCn && (
            <div className="text-reveal">
              <p
                data-reveal-inner
                className="text-sm md:text-base font-light tracking-wide text-gray-400 mb-0.5"
                style={{ willChange: "transform, opacity" }}
              >
                {project.brandCn}
              </p>
            </div>
          )}

          {/* Title · Year */}
          <div className="text-reveal">
            <p
              data-reveal-inner
              className="text-sm md:text-base font-light tracking-wide text-gray-500"
              style={{ willChange: "transform, opacity" }}
            >
              {project.title} · 2025
            </p>
          </div>

          {/* Role */}
          <div className="text-reveal">
            <p
              data-reveal-inner
              className="text-sm md:text-base font-light tracking-wide text-gray-600 mt-0.5"
              style={{ willChange: "transform, opacity" }}
            >
              {project.role}
            </p>
          </div>

          {/* Watch Film link */}
          {project.filmUrl && (
            <div className="text-reveal">
              <div
                data-reveal-inner
                className="mt-3 md:mt-5"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="inline-flex items-center gap-2 text-[11px] md:text-sm tracking-[0.08em] uppercase font-light text-gray-400 transition-colors duration-300 hover:text-white">
                  <div className="w-6 md:w-8 h-px bg-white/20" />
                  <span>Watch Film</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="stroke-current">
                    <path d="M2.5 9.5L9.5 2.5" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M4.5 2.5H9.5V7.5" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
