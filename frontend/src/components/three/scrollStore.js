// Shared, render-free scroll + pointer state for the WebGL scenes.
// Updated by passive listeners; read inside useFrame so React never re-renders on scroll.
export const scrollState = { progress: 0, y: 0, vh: 1 };
export const pointerState = { x: 0, y: 0 };

let attached = false;
export function attachScrollStore() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  const onScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollState.y = window.scrollY;
    scrollState.vh = window.innerHeight;
    scrollState.progress = Math.min(1, Math.max(0, window.scrollY / max));
  };
  const onPointer = (e) => {
    pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/* Frame-rate independent damping, as used for the camera rig. */
export const damp = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt));
export const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
