import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { scrollToTarget } from "../../lib/smoothScroll";

const CHAPTERS = [
  { id: "top", label: "Start" },
  { id: "about", label: "Why NeoGym" },
  { id: "programs", label: "Programs" },
  { id: "services", label: "Services" },
  { id: "joining", label: "Joining" },
  { id: "begin", label: "Begin" },
];

/* Page-level wayfinding, as on long editorial pages:
   - a 2px ember progress bar across the top (a transform, so it costs nothing to animate)
   - a chapter rail on the right edge showing where you are, each mark clickable. */
export default function ChapterIndicator() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean);
    // A section is "current" once it crosses the middle band of the viewport.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const index = CHAPTERS.findIndex((c) => c.id === active);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-ember"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <nav
        aria-label="Page chapters"
        className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 xl:block 2xl:right-6"
      >
        <ol className="flex flex-col items-end gap-3">
          {CHAPTERS.map((c, i) => {
            const on = c.id === active;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-label={`${c.label} (chapter ${i})`}
                  onClick={() => {
                    const el = document.getElementById(c.id);
                    if (el) scrollToTarget(c.id === "top" ? 0 : el);
                  }}
                  aria-current={on ? "true" : undefined}
                  className="group flex items-center gap-3 py-1"
                >
                  {/* Only the number shows for the current chapter, so the rail never sits on top
                      of section text; the full name appears on hover / focus. */}
                  <span className="eyebrow flex items-center gap-2 text-[0.65rem]">
                    <span
                      className={`rounded bg-ink/80 px-1.5 py-0.5 text-white opacity-0 transition-all duration-500 ease-premium group-hover:opacity-100 group-focus-visible:opacity-100`}
                    >
                      {c.label}
                    </span>
                    <span className={`transition-opacity duration-500 ${on ? "text-ember opacity-100" : "text-stone-400 opacity-0 group-hover:opacity-100"}`}>
                      {String(i).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={`block h-px transition-all duration-500 ease-premium ${
                      on ? "w-8 bg-ember" : i < index ? "w-4 bg-white/50" : "w-4 bg-white/20 group-hover:bg-white/60"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
