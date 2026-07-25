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
  const sourceRef = useRef<TransitionSource>(null);

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
      tl.to(clone, { opacity: 0, scale: 1.12, duration: 0.28, ease: "power2.out" }, 0);
    }
    tl.to(overlay, { opacity: 0, duration: 0.32, ease: "power2.out" }, 0);
  }, []);

  /* ── Detect route arrival ── */
  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    if (activeRef.current && prev !== pathname) {
      activeRef.current = false;
      const src = sourceRef.current;
      markSceneReady();
      requestAnimationFrame(() => runEntrance(src));
      return;
    }

    if (!activeRef.current && pathname === "/ai-lab") {
      setTransitionSource("direct-entry");
      if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
      markSceneReady();
      runEntrance("direct-entry");
      return;
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
      navigationStartedRef.current = true;
      sourceRef.current = sourceType;
      setTransitionSource(sourceType);
      setIsTransitioning(true);
      setSceneReadyState(false);
      sceneReadyRef.current = false;
      saveScrollY();

      const overlay = overlayRef.current;
      const clone = cloneRef.current;
      if (!overlay || !clone) {
        router.push("/ai-lab");
        return;
      }

      const rect = el.getBoundingClientRect();
      gsap.killTweensOf([overlay, clone]);
      gsap.set(overlay, { opacity: 0 });
      gsap.set(clone, {
        opacity: 0,
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
        xPercent: -50,
        yPercent: -50,
        scale: 0.72,
        fontSize: Math.max(28, Math.min(72, rect.height * 0.48)),
      });

      gsap.timeline({ onComplete: () => router.push("/ai-lab") })
        .to(overlay, { opacity: 0.97, duration: 0.2, ease: "power2.out" }, 0)
        .to(clone, { opacity: 0.85, scale: 1.08, duration: 0.28, ease: "power3.out" }, 0.02);
    },
    [router, saveScrollY],
  );

  /* ── Reverse transition (/ai-lab → home) ── */
  const goBackWithTransition = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    navigationStartedRef.current = true;
    sourceRef.current = "top-nav";
    setTransitionSource("top-nav");
    setIsTransitioning(true);

    const overlay = overlayRef.current;
    const clone = cloneRef.current;
    if (!overlay || !clone) {
      router.back();
      return;
    }

    gsap.killTweensOf([overlay, clone]);
    gsap.set(overlay, { opacity: 0 });
    gsap.set(clone, {
      opacity: 0,
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 1.04,
      fontSize: 56,
    });
    gsap.timeline({ onComplete: () => router.back() })
      .to(overlay, { opacity: 0.97, duration: 0.2, ease: "power2.out" }, 0)
      .to(clone, { opacity: 0.72, scale: 0.88, duration: 0.24, ease: "power2.inOut" }, 0);
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
          background: "radial-gradient(circle at 50% 50%, #5d829a 0%, #19384e 48%, #07131e 100%)",
          willChange: "opacity",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Shared element clone */}
      <div
        ref={cloneRef}
        className="fixed z-[10000] pointer-events-none select-none flex items-center justify-center text-white font-light tracking-[0.04em]"
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
