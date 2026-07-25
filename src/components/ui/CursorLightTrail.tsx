"use client";

import { useEffect, useRef } from "react";

/* ── Optimized fluid light cursor trail ──
   - Fixed ring buffer (no push/shift GC)
   - Sleeps when idle (no rAF when nothing to draw)
   - Pre-allocated sample arrays
   - No .slice(), .push(), .shift() in hot path  */

const MAX_PTS = 36;
const SAMPLE_BUDGET = 300;

export default function CursorLightTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  // Ring buffer for history points
  const bx = useRef(new Float64Array(MAX_PTS));
  const by = useRef(new Float64Array(MAX_PTS));
  const bt = useRef(new Float64Array(MAX_PTS));
  const bHead = useRef(0);
  const bLen = useRef(0);
  const smoothX = useRef(-200);
  const smoothY = useRef(-200);
  const rawX = useRef(-200);
  const rawY = useRef(-200);
  const speed = useRef(0);
  const alive = useRef(false);
  const drawing = useRef(false);
  const sleepTimer = useRef(0);

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqFine.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = window.innerWidth, h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* ── Ring buffer helpers ── */
    function pushPt(x: number, y: number, t: number) {
      const h = bHead.current;
      bx.current[h] = x;
      by.current[h] = y;
      bt.current[h] = t;
      bHead.current = (h + 1) % MAX_PTS;
      if (bLen.current < MAX_PTS) bLen.current++;
    }
    function getPt(i: number) {
      // i = 0 = oldest, i = len-1 = newest
      const idx = (bHead.current - bLen.current + i + MAX_PTS) % MAX_PTS;
      return { x: bx.current[idx], y: by.current[idx], t: bt.current[idx] };
    }
    function clearPts() { bHead.current = 0; bLen.current = 0; }
    function dropOldest() {
      if (bLen.current > 0) { bLen.current--; }
    }

    /* ── Pre-allocated sample array ── */
    const sx = new Float64Array(SAMPLE_BUDGET);
    const sy = new Float64Array(SAMPLE_BUDGET);
    const sage = new Float64Array(SAMPLE_BUDGET);

    const ageMax = mqReduce.matches ? 280 : 550;

    /* ── Pointer events ── */
    const onMove = (e: PointerEvent) => {
      rawX.current = e.clientX;
      rawY.current = e.clientY;
      alive.current = true;
      if (!drawing.current) {
        drawing.current = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => { alive.current = false; };
    const onEnter = () => {
      const x = rawX.current, y = rawY.current;
      clearPts();
      for (let i = 0; i < 6; i++) pushPt(x, y, performance.now());
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    /* ── Visibility ── */
    const onVis = () => {
      if (document.hidden) { clearPts(); speed.current = 0; drawing.current = false; cancelAnimationFrame(rafRef.current); }
    };
    document.addEventListener("visibilitychange", onVis);

    /* ── Tick ── */
    const tick = (now: number) => {
      // 1. Smooth head
      smoothX.current += (rawX.current - smoothX.current) * 0.46;
      smoothY.current += (rawY.current - smoothY.current) * 0.4;

      // 2. Record point if moved enough
      if (bLen.current === 0) {
        pushPt(smoothX.current, smoothY.current, now);
      } else {
        const last = getPt(bLen.current - 1);
        const dx = smoothX.current - last.x, dy = smoothY.current - last.y;
        if (dx * dx + dy * dy > 2.25) {
          pushPt(smoothX.current, smoothY.current, now);
        }
      }

      // 3. Speed from last 5 points (no slice)
      if (bLen.current >= 2) {
        const end = Math.min(bLen.current, 5);
        let dist = 0;
        for (let i = bLen.current - end + 1; i < bLen.current; i++) {
          const p1 = getPt(i - 1), p2 = getPt(i);
          const dx = p2.x - p1.x, dy = p2.y - p1.y;
          dist += Math.sqrt(dx * dx + dy * dy);
        }
        const p0 = getPt(bLen.current - end), pn = getPt(bLen.current - 1);
        const dt = (pn.t - p0.t) || 1;
        const rawSpd = dist / dt;
        speed.current += (rawSpd - speed.current) * 0.15;
      }

      // 4. Age-based removal
      const cutoff = now - ageMax;
      while (bLen.current > 0 && bt.current[(bHead.current - bLen.current + MAX_PTS) % MAX_PTS] < cutoff) {
        dropOldest();
      }
      if (!alive.current && bLen.current > 0) {
        const oldest = getPt(0);
        if (oldest.t < cutoff) dropOldest();
      }

      // 5. Draw if enough points
      if (bLen.current >= 3) {
        const n = bLen.current;
        const totalAge = bt.current[(bHead.current - 1 + MAX_PTS) % MAX_PTS] - bt.current[(bHead.current - n + MAX_PTS) % MAX_PTS] || 1;

        // Generate Catmull-Rom samples
        let sCount = 0;
        for (let i = 0; i < n - 1 && sCount < SAMPLE_BUDGET - 4; i++) {
          const p0 = getPt(Math.max(0, i - 1));
          const p1 = getPt(i);
          const p2 = getPt(Math.min(n - 1, i + 1));
          const p3 = getPt(Math.min(n - 1, i + 2));
          const steps = Math.ceil(Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) / 2);
          for (let s = 0; s <= steps && sCount < SAMPLE_BUDGET; s++) {
            const t = s / steps;
            const tt = t * t, ttt = tt * t;
            sx[sCount] = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * tt + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * ttt);
            sy[sCount] = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * tt + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * ttt);
            sage[sCount] = (now - (p1.t + (p2.t - p1.t) * t)) / totalAge;
            sCount++;
          }
        }

        if (sCount >= 2) {
          ctx!.clearRect(0, 0, w, h);
          const speedNorm = Math.min(1, speed.current / 1.2);
          const baseW = mqReduce.matches ? 6 : 10;
          const wBoost = 1 + speedNorm * 0.2;
          const trailN = Math.min(sCount, Math.floor(20 + speedNorm * 25));
          const startI = Math.max(0, sCount - trailN);
          const span = sCount - startI - 1 || 1;

          // Two-pass: outer glow layer + inner core, drawn segment by segment
          for (let pass = 0; pass < 2; pass++) {
            const isOuter = pass === 0;
            const maxW = isOuter
              ? (baseW * 2.2 + 3 * speedNorm) * 0.6
              : (baseW + 2 * speedNorm) * 0.5;

            for (let i = startI; i < sCount - 1; i++) {
              const t = (i - startI) / span; // 0 = head, 1 = tail
              const si = (i - startI) / span;

              // Conical width: thick near head, pow decay to fine tail
              const widthFactor = 1 - si;
              const conicalW = maxW * Math.pow(widthFactor, isOuter ? 1.2 : 1.6);
              const lineW = Math.max(isOuter ? 0.3 : 0.15, conicalW);

              // Alpha: bright head, transparent tail
              const alphaHead = isOuter ? 0.12 : 0.92;
              const alphaFactor = Math.pow(widthFactor, isOuter ? 1.8 : 2.2);
              const alpha = alphaHead * alphaFactor;

              ctx!.beginPath();
              ctx!.moveTo(sx[i], sy[i]);
              ctx!.lineTo(sx[i + 1], sy[i + 1]);
              ctx!.lineWidth = lineW;

              if (isOuter) {
                ctx!.strokeStyle = `rgba(160,205,235,${Math.max(0, alpha * 0.5)})`;
              } else {
                ctx!.strokeStyle = `rgba(${220 + Math.floor(30 * widthFactor)},${238 + Math.floor(17 * widthFactor)},255,${Math.max(0, alpha)})`;
              }
              ctx!.stroke();
            }
          }
        }
      } else {
        ctx!.clearRect(0, 0, w, h);
      }

      // 6. Decide: keep running or sleep
      const hasContent = alive.current || bLen.current > 0;
      if (hasContent && !document.hidden) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        drawing.current = false;
        clearPts();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    drawing.current = true;

    return () => {
      cancelAnimationFrame(rafRef.current);
      drawing.current = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, width: "100vw", height: "100vh",
        pointerEvents: "none", zIndex: 99998, background: "transparent",
      }}
    />
  );
}
