"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { usePageTransition } from "@/components/layout/PageTransition";

interface NavItem {
  label: string;
  href?: string;
  sectionId?: string;
}

const navItems: NavItem[] = [
  { label: "Portfolio", sectionId: "selected-works" },
  { label: "AI Lab", href: "/ai-lab" },
  { label: "About", sectionId: "closing" },
  { label: "Contact", sectionId: "closing" },
];

export default function NavBar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { startAiOsTransition } = usePageTransition();

  // Entrance fade-in animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 2.0, ease: "power3.out" }
      );
    }
  }, []);

  // Scroll-driven background transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const sectionIds = ["selected-works", "closing"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAiLabClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startAiOsTransition(e.currentTarget as HTMLElement, "top-nav");
    },
    [startAiOsTransition],
  );

  const isActive = (item: NavItem): boolean => {
    if (item.sectionId) {
      return activeSection === item.sectionId;
    }
    return false;
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80" : "bg-transparent"
      }`}
      style={{ opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-end">
        <div className="flex items-center gap-6 md:gap-10">
          {navItems.map((item) => {
            const active = isActive(item);
            const baseClass = "text-base md:text-lg tracking-[0.08em] uppercase transition-all duration-300";
            const stateClass = active
              ? "text-white"
              : "text-gray-400 hover:text-white";

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleAiLabClick}
                  className={`${baseClass} ${stateClass} cursor-pointer`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.sectionId!)}
                className={`${baseClass} ${stateClass}`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
