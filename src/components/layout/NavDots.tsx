"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface NavDotsProps {
  sections: { id: string; label: string }[];
  currentIndex: number;
  onDotClick: (index: number) => void;
}

export default function NavDots({ sections, currentIndex, onDotClick }: NavDotsProps) {
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dotsRef.current) {
      gsap.fromTo(
        dotsRef.current,
        { opacity: 0 },
        { opacity: 0.2, duration: 1, delay: 4.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div
      ref={dotsRef}
      className="fixed top-8 right-8 z-50 flex flex-col gap-3 items-center"
      style={{ opacity: 0 }}
    >
      {sections.map((section, i) => (
        <button
          key={section.id}
          onClick={() => onDotClick(i)}
          className={cn(
            "w-2 h-2 transition-all duration-300",
            i === currentIndex
              ? "bg-white scale-125"
              : "bg-gray-400 hover:bg-gray-200 hover:scale-150"
          )}
          style={{
            opacity: i === currentIndex ? 1 : 0.2,
          }}
          aria-label={section.label}
        />
      ))}
    </div>
  );
}
