import Lenis from "lenis";

/* ---------------------------------------------------------------------------
   Inertial smooth scrolling (Lenis), home page only.
   Lenis eases the real window scroll position, so native scroll events,
   IntersectionObserver, framer-motion's useScroll and the WebGL camera all
   keep working unchanged; they just receive a smoother signal.
   Touch devices keep native scrolling (already smooth, and users expect it),
   and reduced-motion users never get Lenis at all.
   ------------------------------------------------------------------------- */

let lenis = null;
let raf = 0;

export const NAV_OFFSET = -72; // fixed navbar height

export function startSmoothScroll() {
  if (lenis || typeof window === "undefined") return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  lenis = new Lenis({
    lerp: 0.085,          // lower = floatier; 0.08–0.1 feels premium without lag
    wheelMultiplier: 0.9,
    smoothWheel: true,
    syncTouch: false,
  });
  const loop = (time) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return lenis;
}

export function stopSmoothScroll() {
  cancelAnimationFrame(raf);
  lenis?.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

/* Scroll to an element (or a y position). Eases through Lenis when it is running,
   otherwise falls back to the browser. */
export function scrollToTarget(target, { immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : NAV_OFFSET, immediate, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
  } else {
    target?.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}

/* Pause / resume, e.g. while a full-screen menu is open. */
export const pauseSmoothScroll = () => lenis?.stop();
export const resumeSmoothScroll = () => lenis?.start();
