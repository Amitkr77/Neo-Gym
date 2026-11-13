import { useEffect, useRef } from "react";

// A thin ring that trails the pointer and swells over anything clickable.
// Desktop (fine pointer) only; the native cursor stays, so nothing is lost if this fails.
export default function CursorRing() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || still || !el) return;

    const pos = { x: -100, y: -100, tx: -100, ty: -100, s: 1, ts: 1 };
    let raf = 0;
    let last = performance.now();

    const onMove = (e) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      const hot = e.target.closest?.("a, button, [role='button'], input, textarea, select");
      pos.ts = hot ? 1.9 : 1;
      el.style.opacity = "1";
    };
    const onLeave = () => { el.style.opacity = "0"; };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-14 * dt);
      pos.x += (pos.tx - pos.x) * k;
      pos.y += (pos.ty - pos.y) * k;
      pos.s += (pos.ts - pos.s) * (1 - Math.exp(-10 * dt));
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${pos.s})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] will-change-transform h-8 w-8 rounded-full border border-ember/70 opacity-0 transition-opacity duration-300"
    />
  );
}
