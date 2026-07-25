"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

interface NarrativeSlideProps {
  project: Project;
  coverSrc: string;
  galleryImgs: string[];
  hasGallery: boolean;
  chapterNum: string;
}

export default function NarrativeSlide({
  project,
  coverSrc,
  galleryImgs,
  hasGallery,
  chapterNum,
}: NarrativeSlideProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [arrowHovered, setArrowHovered] = useState<"left" | "right" | null>(null);

  const total = galleryImgs.length;
  const currentSrc = galleryImgs[galleryIndex];

  const counter =
    total > 1
      ? `${String(galleryIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
      : "";

  const prevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setGalleryIndex((prev) => (prev - 1 + total) % total);
    },
    [total]
  );

  const nextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setGalleryIndex((prev) => (prev + 1) % total);
    },
    [total]
  );

  // Touch swipe
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
    <div
      ref={sectionRef}
      className="relative h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-screen image */}
      <Link
        href={`/case-study/${project.id}`}
        className="absolute inset-x-0 top-0 h-[70svh] md:inset-0 md:h-auto block"
      >
        <Image
          src={currentSrc}
          alt={project.title}
          fill
          className="object-contain md:object-cover"
          sizes="100vw"
        />
      </Link>

      {/* Lighter gradient overlay — more image visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Gallery arrows — only show on hover for projects with multiple images */}
      {hasGallery && total > 1 && (
        <>
          <button
            onClick={prevImage}
            onMouseEnter={() => setArrowHovered("left")}
            onMouseLeave={() => setArrowHovered(null)}
            className="absolute left-3 md:left-8 top-1/2 z-20 p-3 cursor-pointer bg-transparent border-0 outline-0 -translate-y-1/2"
            style={{
              opacity: hovered ? 0.7 : 0.15,
              transform: `translateY(-50%) ${arrowHovered === "left" ? "translateX(-4px)" : "translateX(0)"}`,
              transition: "opacity 0.3s, transform 0.3s",
            }}
            aria-label="Previous image"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <line x1="20" y1="9" x2="12" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
              <line x1="20" y1="23" x2="12" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={nextImage}
            onMouseEnter={() => setArrowHovered("right")}
            onMouseLeave={() => setArrowHovered(null)}
            className="absolute right-3 md:right-8 top-1/2 z-20 p-3 cursor-pointer bg-transparent border-0 outline-0 -translate-y-1/2"
            style={{
              opacity: hovered ? 0.7 : 0.15,
              transform: `translateY(-50%) ${arrowHovered === "right" ? "translateX(4px)" : "translateX(0)"}`,
              transition: "opacity 0.3s, transform 0.3s",
            }}
            aria-label="Next image"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <line x1="12" y1="9" x2="20" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
              <line x1="12" y1="23" x2="20" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}

      {/* Counter — bottom right */}
      {hasGallery && total > 1 && (
        <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-20 pointer-events-none">
          <span className="text-[11px] md:text-sm tracking-[0.12em] font-light text-white/50">
            {counter}
          </span>
        </div>
      )}

      {/* Chapter number — top right */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 z-20 pointer-events-none">
        <span className="text-[4rem] md:text-[7rem] font-light tracking-[0.05em] text-white/50 select-none">
          {chapterNum}
        </span>
      </div>

      {/* Minimal text — bottom-left, smaller and more transparent */}
      <Link
        href={`/case-study/${project.id}`}
        className="absolute bottom-8 left-6 md:bottom-12 md:left-12 z-20 max-w-[70%] md:max-w-md"
      >
        <h3
          className="text-base md:text-xl font-semibold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-inter)", color: "#f5f5f5" }}
        >
          {project.brand}
        </h3>
        <p
          className="text-[11px] md:text-sm font-light"
          style={{ fontFamily: "var(--font-inter)", color: "#999" }}
        >
          {project.title} · {project.role}
        </p>
        <div
          className="mt-2 flex items-center gap-2 text-[10px] md:text-xs tracking-[0.08em] uppercase font-light"
          style={{ color: "#666" }}
        >
          <span className="w-4 h-px" style={{ background: "#555" }} />
          <span>View Project</span>
        </div>
      </Link>
    </div>
  );
}
