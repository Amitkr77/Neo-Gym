import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

const PROGRAMS = [
  { name: "Strength training", tag: "Muscle · Technique", body: "Build muscle and strength with a focus on proper technique and form." },
  { name: "Running & endurance", tag: "Stamina · Intervals", body: "Increase stamina and cardiovascular health with high-intensity interval training." },
  { name: "Yoga", tag: "Mobility · Mindfulness", body: "Focus on flexibility, relaxation and mindfulness with guided yoga sessions." },
  { name: "Cardio & heart health", tag: "Conditioning", body: "Boost your cardiovascular health with heart-pumping cardio workouts." },
];

// Home: programs as an editorial index list.
const Classes = () => (
  <section id="programs" className="bg-ink py-24 text-white sm:py-32">
    <div className="container-x">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <SectionHeading index="02" eyebrow="Programs" title="Train your" accent="way." tone="light" />
        <Reveal delay={100}>
          <Link to="/Signup" className="btn-outline-light">
            Become a member <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>

      <ul className="mt-16 border-t border-white/10">
        {PROGRAMS.map((program, i) => (
          <Reveal as="li" key={program.name} delay={i * 70} className="border-b border-white/10">
            <Link
              to="/Signup"
              className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-3 py-7 sm:grid-cols-[4rem_1fr] sm:gap-x-6 sm:py-9 lg:grid-cols-[4rem_1.2fr_1fr_auto] lg:items-center lg:py-10"
              aria-label={`${program.name}: join to get started`}
            >
              <span className="font-serif text-2xl italic text-stone-400 transition-colors group-hover:text-ember">0{i + 1}</span>
              <h3 className="display-sm text-2xl transition-transform duration-500 ease-premium group-hover:translate-x-2 sm:text-3xl xl:text-4xl">
                {program.name}
              </h3>
              <p className="col-start-2 max-w-md text-stone-400">{program.body}</p>
              <span className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 text-lg transition-all duration-500 ease-premium group-hover:border-ember group-hover:bg-ember lg:flex" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  </section>
);

export default Classes;
