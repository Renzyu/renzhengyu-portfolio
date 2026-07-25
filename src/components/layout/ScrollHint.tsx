"use client";

export default function ScrollHint() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
      <span
        className="text-[11px] tracking-[0.08em] font-light block text-center animate-breathe"
        style={{ fontFamily: "var(--font-inter)", color: "var(--color-text-muted)" }}
      >
        Scroll
      </span>
    </div>
  );
}
