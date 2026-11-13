import { useRef } from "react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import RippleArt from "../ui/RippleArt";

const PROGRAMS = [
  { name: "Strength training", tag: "Muscle · Technique", body: "Build muscle and strength with a focus on proper technique and form.", hue: "from-ember/35" },
  { name: "Running & endurance", tag: "Stamina · Intervals", body: "Increase stamina and cardiovascular health with high-intensity interval training.", hue: "from-ember-600/30" },
  { name: "Yoga", tag: "Mobility · Mindfulness", body: "Focus on flexibility, relaxation and mindfulness with guided yoga sessions.", hue: "from-amber-500/25" },
  { name: "Cardio & heart health", tag: "Conditioning", body: "Boost your cardiovascular health with heart-pumping cardio workouts.", hue: "from-ember-700/35" },
];

/* A program "plate": a WebGL poster that ripples under the pointer, inside a card that
   tilts toward it. The CSS gradient under the canvas is the fallback without WebGL. */
function ProgramCard({ program, index, total }) {
  const ref = useRef(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    // canvas coords: art occupies the top of the card, flip y for GL
    const art = el.querySelector("[data-art]")?.getBoundingClientRect();
    if (art) {
      pointer.current.x = (e.clientX - art.left) / art.width;
      pointer.current.y = 1 - (e.clientY - art.top) / art.height;
    }
    pointer.current.active = true;
    if (window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
    el.style.transform = `perspective(1000px) rotateY(${(x - 0.5) * 6}deg) rotateX(${(0.5 - y) * 6}deg)`;
  };
  const onLeave = () => {
    pointer.current.active = false;
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Link
      ref={ref}
      to="/Signup"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`${program.name}: join to get started`}
      className="glass group relative flex h-full flex-col overflow-hidden p-3 transition-[transform,border-color] duration-300 ease-premium hover:border-ember/50"
    >
      <div data-art className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br ${program.hue} via-ink to-ink`}>
        <RippleArt motif={index} hoverRef={pointer} className="absolute inset-0" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4">
          <span className="eyebrow rounded-full bg-ink/75 px-3 py-1 text-[0.68rem] text-white/80">{program.tag}</span>
          <span className="eyebrow shrink-0 text-[0.68rem] text-white/70">
            0{index + 1} / 0{total}
          </span>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col p-4 pt-6 sm:p-5 sm:pt-7">
        <h3 className="display-sm text-2xl transition-transform duration-500 ease-premium group-hover:-translate-y-0.5 sm:text-[1.7rem]">
          {program.name}
        </h3>
        <p className="mt-3 leading-relaxed text-stone-400">{program.body}</p>
        <span className="eyebrow mt-auto inline-flex items-center gap-3 pt-6 text-white">
          Join to start
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all duration-500 ease-premium group-hover:border-ember group-hover:bg-ember group-hover:text-ink" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

// Home chapter 02: programs as large tilting plates.
const Classes = () => (
  <section id="programs" className="relative py-28 sm:py-40">
    <div className="container-x">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <Reveal>
          <p className="eyebrow mb-6 flex items-center gap-3 text-stone-400">
            <span className="text-ember">02</span>
            <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
            Programs
          </p>
          <h2 className="display text-[clamp(2.5rem,6vw,5.5rem)]">
            Train your <span className="accent text-ember">way.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Link to="/Signup" className="btn-outline-light bg-ink/40">
            Become a member <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>

      <ul className="mt-14 grid gap-4 sm:mt-20 md:grid-cols-2 xl:grid-cols-4">
        {PROGRAMS.map((program, i) => (
          <Reveal as="li" key={program.name} delay={i * 80} className="h-full">
            <ProgramCard program={program} index={i} total={PROGRAMS.length} />
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default Classes;
