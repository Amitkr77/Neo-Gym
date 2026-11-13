import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SceneBoundary from "../ui/SceneBoundary";

const HeroForeground = lazy(() => import("../three/HeroForeground"));

const CHAPTERS = [
  { n: "01", title: "Strength", body: "Barbell, rack and technique coaching.", to: "/#programs" },
  { n: "02", title: "Endurance", body: "Intervals that build real stamina.", to: "/#programs" },
  { n: "03", title: "Yoga", body: "Mobility, breath and recovery.", to: "/#programs" },
  { n: "04", title: "Coaching", body: "One-to-one plans and nutrition.", to: "/#services" },
];

/* Leaving the hero: everything along the foot is spent once the walk starts, so each piece
   gets its own scroll window and the hero empties one element at a time. The preview card
   goes first and dissolves (blur) rather than fading in place. Nothing moves for
   reduced-motion users. */
function useExit(start, end, distance = 40) {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  const opacity = useTransform(scrollY, [vh * start, vh * end], [1, 0]);
  const y = useTransform(scrollY, [vh * start, vh * end], [0, distance]);
  return reduce ? {} : { opacity, y };
}

const HeroSection = () => {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;

  const head = useExit(0.05, 0.5, -60);
  const cue = useExit(0.0, 0.18);
  const chapters = [useExit(0.04, 0.3), useExit(0.08, 0.34), useExit(0.12, 0.38), useExit(0.16, 0.42)];
  const previewOpacity = useTransform(scrollY, [0, vh * 0.16], [1, 0]);
  const previewBlur = useTransform(scrollY, [0, vh * 0.16], ["blur(0px)", "blur(14px)"]);
  const wordY = useTransform(scrollY, [0, vh], ["0%", "28%"]);
  const wordOpacity = useTransform(scrollY, [vh * 0.2, vh * 0.85], [1, 0]);

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden text-white">
      {/* scrims: hold the type off the scene without hiding it */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" aria-hidden="true" />

      {/* Headline block */}
      <motion.div style={head} className="container-x relative z-30 pt-24 sm:pt-28 [@media(max-height:500px)]:pt-20">
        <p className="eyebrow rise mb-5 flex items-center gap-3 text-stone-400 [@media(max-height:500px)]:hidden">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
          Chapter 00 — The first rep
        </p>
        <h1
          className="display rise max-w-3xl text-[clamp(2rem,min(5.4vw,7.6svh),5rem)]"
          style={{ "--rise-delay": "80ms" }}
        >
          Get stronger. Feel <span className="accent text-ember">better.</span> Live better.
        </h1>
        <p
          className="rise mt-5 max-w-md text-base leading-relaxed text-white/70 [@media(max-height:700px)]:hidden"
          style={{ "--rise-delay": "160ms" }}
        >
          Start your fitness journey today. Whether you&apos;re looking to build muscle or improve your
          health, we have you covered.
        </p>
        <div className="rise mt-7 flex flex-col gap-3 sm:flex-row" style={{ "--rise-delay": "240ms" }}>
          <Link to="/Signup" className="btn-primary px-8 py-4">
            Join Now <span aria-hidden="true">→</span>
          </Link>
          <Link to="/contactUs" className="btn-outline-light px-8 py-4 backdrop-blur-sm">
            Visit or Enquire
          </Link>
        </div>
      </motion.div>

      {/* Vertical side label */}
      <p
        className="eyebrow pointer-events-none absolute right-5 top-28 z-30 hidden text-stone-400 [writing-mode:vertical-rl] sm:right-8 md:block lg:right-10"
        aria-hidden="true"
      >
        Train with intent <span className="text-ember">—</span> Neogym
      </p>

      {/* Giant wordmark, sitting between the scene and the foreground props */}
      {/* In flow, so it always takes the space between headline and foot and never collides
          with either; its lower edge tucks under the foot's scrim. */}
      <div className="pointer-events-none relative z-10 min-h-[14svh] flex-1" aria-hidden="true">
        <motion.div
          style={reduce ? undefined : { y: wordY, opacity: wordOpacity }}
          className="absolute inset-x-0 -bottom-[0.14em] select-none text-center text-[min(15.5vw,25svh)]"
        >
          <span className="display block whitespace-nowrap bg-gradient-to-b from-bone via-bone/85 to-bone/10 bg-clip-text leading-[0.8] tracking-[-0.03em] text-transparent [filter:drop-shadow(0_0_60px_rgba(255,91,46,0.28))]">
            Neogym
          </span>
        </motion.div>
      </div>

      <SceneBoundary>
        <Suspense fallback={null}>
          <HeroForeground />
        </Suspense>
      </SceneBoundary>

      {/* Foot: scroll cue, four chapters, preview card */}
      <div className="container-x relative z-30 pb-6 sm:pb-8">
        <div className="pointer-events-none absolute inset-x-0 -top-2 bottom-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" aria-hidden="true" />
        {/* Cue and preview float above the chapter row, out of flow, so they never add height. */}
        <div className="pointer-events-none absolute inset-x-5 bottom-full mb-4 flex items-end justify-between gap-6 sm:inset-x-8 lg:inset-x-10 [@media(max-height:640px)]:hidden">
          <motion.a
            href="#about"
            style={cue}
            className="eyebrow tap pointer-events-auto hidden items-center gap-3 text-stone-400 hover:text-white sm:inline-flex"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-white/15" aria-hidden="true">
              <span className="scroll-cue absolute inset-x-0 top-0 h-3 bg-ember" />
            </span>
            Scroll to enter
          </motion.a>

          <motion.div
            style={reduce ? undefined : { opacity: previewOpacity, filter: previewBlur }}
            className="pointer-events-auto hidden w-64 rounded-xl border border-white/10 bg-ink/60 p-4 backdrop-blur-md lg:block"
          >
            <p className="eyebrow flex items-center gap-2 text-stone-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" aria-hidden="true" />
              Plan your first visit
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Tell us your goals and we&apos;ll help you pick a plan.
            </p>
            <Link to="/contactUs" className="link-underline tap mt-1 text-sm font-semibold text-white">
              Send an enquiry →
            </Link>
          </motion.div>
        </div>

        <ol className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 md:grid-cols-4">
          {CHAPTERS.map((c, i) => (
            <motion.li key={c.n} style={chapters[i]}>
              <Link to={c.to} className="group block">
                <span className="font-serif text-2xl italic text-ember transition-transform duration-500 ease-premium group-hover:-translate-y-0.5 sm:text-3xl">
                  {c.n}
                </span>
                <span className="display-sm mt-1 block text-sm text-white sm:text-base">{c.title}</span>
                <span className="mt-1 hidden text-sm text-stone-400 lg:block [@media(max-height:820px)]:hidden">{c.body}</span>
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HeroSection;
