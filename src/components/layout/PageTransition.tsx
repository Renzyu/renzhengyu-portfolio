"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { useRouter, usePathname } from "next/navigation";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
export type TransitionSource = "project-card" | "top-nav" | "direct-entry" | null;

interface TransitionContextType {
  startAiOsTransition: (el: HTMLElement, sourceType: TransitionSource) => void;
  goBackWithTransition: () => void;
  isTransitioning: boolean;
  sceneReady: boolean;
  markSceneReady: () => void;
  transitionSource: TransitionSource;
  entering: boolean;
  savedScrollY: number;
  saveScrollY: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  startAiOsTransition: () => {},
  goBackWithTransition: () => {},
  isTransitioning: false,
  sceneReady: false,
  markSceneReady: () => {},
  transitionSource: null,
  entering: false,
  savedScrollY: 0,
  saveScrollY: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

/* ─────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────── */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sceneReady, setSceneReadyState] = useState(false);
  const [transitionSource, setTransitionSource] = useState<TransitionSource>(null);
  const [entering, setEntering] = useState(false);
  const [savedScrollY, setSavedScrollY] = useState(0);

  const activeRef = useRef(false);
  const navigationStartedRef = useRef(false);
  const prevPathRef = useRef(pathname);
  const sceneReadyRef = useRef(false);
  const sceneReadyFn = useRef<() => void>(() => {});

  const markSceneReady = useCallback(() => {
    sceneReadyRef.current = true;
    setSceneReadyState(true);
    if (sceneReadyFn.current) {
      sceneReadyFn.current();
      sceneReadyFn.current = () => {};
    }
  }, []);

  const saveScrollY = useCallback(() => {
    setSavedScrollY(window.scrollY);
  }, []);

  /* ── Entrance crossfade ── */
  const runEntrance = useCallback((source: TransitionSource) => {
    setEntering(true);
    const overlay = overlayRef.current;
    const clone = cloneRef.current;
    if (!overlay) { setEntering(false); return; }

    const tl = gsap.timeline({
      onComplete: () => {
        setEntering(false);
        setIsTransitioning(false);
        setTransitionSource(null);
      },
    });

    if (source !== "direct-entry" && clone) {
      tl.to(clone, { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0);
    }
    tl.to(overlay, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, 0);
  }, []);

  /* ── Detect route arrival ── */
  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    if (activeRef.current && prev !== pathname) {
      activeRef.current = false;
      const src = transitionSource;
      const safetyTimeout = setTimeout(() => markSceneReady(), 2200);
      sceneReadyFn.current = () => { clearTimeout(safetyTimeout); runEntrance(src); };
      if (sceneReadyRef.current) { clearTimeout(safetyTimeout); runEntrance(src); }
      return () => clearTimeout(safetyTimeout);
    }

    if (!activeRef.current && pathname === "/ai-lab") {
      setTransitionSource("direct-entry");
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0.6 });
      const timeout = setTimeout(() => markSceneReady(), 2200);
      sceneReadyFn.current = () => { clearTimeout(timeout); runEntrance("direct-entry"); };
      if (sceneReadyRef.current) { clearTimeout(timeout); runEntrance("direct-entry"); }
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  useEffect(() => {
    // Warm the heavy AI-OS route as soon as the browser has breathing room.
    // This keeps its bundle parsing away from the transition's critical frames.
    const warmRoute = () => router.prefetch("/ai-lab");
    warmRoute();

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(warmRoute, { timeout: 1200 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(warmRoute, 250);
    return () => globalThis.clearTimeout(timeoutId);
  }, [router]);

  /* ── Forward transition (home → /ai-lab) ── */
  const startAiOsTransition = useCallback(
    (el: HTMLElement, sourceType: TransitionSource) => {
      if (activeRef.current) return;
      activeRef.current = true;
      navigationStartedRef.current = false;
      sceneReadyRef.current = false;
      setSceneReadyState(false);
      setIsTransitioning(true);
      setTransitionSource(sourceType);
      saveScrollY();

      const rect = el.getBoundingClientRect();
      const clone = cloneRef.current;
      const overlay = overlayRef.current;
      if (!clone || !overlay) { router.push("/ai-lab"); return; }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      gsap.set(clone, {
        opacity: 1, x: rect.left, y: rect.top,
        width: rect.width, height: rect.height,
        fontSize: window.getComputedStyle(el).fontSize,
        color: window.getComputedStyle(el).color,
      });

      const navigate = () => {
        if (navigationStartedRef.current) return;
        navigationStartedRef.current = true;
        router.push("/ai-lab");
      };

      gsap.timeline()
        .to(clone, {
          x: vw / 2 - 120, y: vh / 2 - 20, width: 240, height: 40,
          fontSize: "clamp(28px,5vw,42px)", duration: 0.5, ease: "power3.inOut",
        }, 0)
        .to(overlay, {
          opacity: 1,
          duration: 0.28,
          ease: "power2.inOut",
          onComplete: navigate,
        }, 0);
    },
    [router, saveScrollY],
  );

  /* ── Reverse transition (/ai-lab → home) ── */
  const goBackWithTransition = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    setIsTransitioning(true);

    const clone = cloneRef.current;
    const overlay = overlayRef.current;
    if (!overlay) { router.back(); return; }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Show clone at its current /ai-lab position (center-ish)
    gsap.set(clone, {
      opacity: 1, x: vw / 2 - 120, y: vh / 2 - 20,
      width: 240, height: 40,
      fontSize: "clamp(28px,5vw,42px)",
      color: "rgba(245,251,255,0.9)",
    });

    // Overlay fades in, clone moves to a small position (simulating back to source)
    gsap.timeline({
      onComplete: () => {
        router.back();
        // Reset after route changes
        setTimeout(() => {
          activeRef.current = false;
          setIsTransitioning(false);
        }, 300);
      },
    })
      .to(overlay, { opacity: 0.8, duration: 0.3, ease: "power2.inOut" }, 0)
      .to(clone, {
        x: vw / 2 - 60, y: vh + 20,
        width: 160, height: 28,
        fontSize: "16px",
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
      }, 0.15);
  }, [router]);

  return (
    <TransitionContext.Provider
      value={{
        startAiOsTransition,
        goBackWithTransition,
        isTransitioning,
        sceneReady,
        markSceneReady,
        transitionSource,
        entering,
        savedScrollY,
        saveScrollY,
      }}
    >
      {children}

      {/* Black overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{
          opacity: 0,
          background: "#0a1520",
          willChange: "opacity",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Shared element clone */}
      <div
        ref={cloneRef}
        className="fixed z-[9998] pointer-events-none select-none flex items-center justify-center text-white font-light tracking-[0.04em]"
        style={{
          opacity: 0, left: 0, top: 0, transform: "none",
          willChange: "transform, width, font-size, opacity",
          background: "transparent",
        }}
      >
        AI-OS
      </div>
    </TransitionContext.Provider>
  );
}
