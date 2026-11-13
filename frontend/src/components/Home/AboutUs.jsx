import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

const PILLARS = [
  {
    title: "Expert trainers",
    body: "Our trainers guide you through personalized workout plans tailored to your goals, whether you are just starting out or levelling up.",
  },
  {
    title: "Modern equipment",
    body: "Equipped with the latest fitness machines and tools, our gym gives you everything you need to train well.",
  },
  {
    title: "Variety of classes",
    body: "From yoga to high-intensity intervals, a wide range of sessions keeps you challenged and motivated.",
  },
];

// Counts taken from what the site itself offers (programs, plans, services), not marketing claims.
const FACTS = [
  { value: "04", label: "Programs" },
  { value: "03", label: "Membership plans" },
  { value: "1:1", label: "Personal coaching" },
  { value: "∞", label: "Progress" },
];

// Home chapter 01: "Why NeoGym". Split heading / story, pillars, then a facts row.
const AboutUs = () => (
  <section id="about" className="relative py-28 sm:py-40">
    <div className="container-x">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow mb-6 flex items-center gap-3 text-stone-400">
            <span className="text-ember">01</span>
            <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
            Why NeoGym
          </p>
          <h2 className="display text-[clamp(2.5rem,6vw,5.5rem)]">
            Built for <span className="accent text-ember">progress,</span> one rep at a time.
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:pt-16" delay={120}>
          <p className="lead text-white/85">
            Our mission is to help you reach your fitness goals in a welcoming, motivating environment,
            with coaching, equipment and classes that support you every step of the way.
          </p>
          <p className="mt-5 leading-relaxed text-stone-400">
            Walk in, find the rack, and start where you are. Our trainers handle the plan, so you can
            focus on showing up.
          </p>
          <Link to="/Signup" className="eyebrow tap mt-6 gap-3 text-white hover:text-ember">
            Start your first session <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>
      </div>

      <ol className="mt-16 grid gap-4 sm:mt-24 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <Reveal as="li" key={pillar.title} delay={i * 90} className="glass group p-7 transition-colors duration-500 hover:border-ember/40 sm:p-9">
            <span className="font-serif text-5xl italic leading-none text-ember">0{i + 1}</span>
            <h3 className="display-sm mt-8 text-xl">{pillar.title}</h3>
            <p className="mt-4 leading-relaxed text-stone-400">{pillar.body}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal as="dl" className="mt-16 grid grid-cols-2 border-t border-white/10 sm:mt-20 md:grid-cols-4" delay={100}>
        {FACTS.map((f) => (
          <div key={f.label} className="flex flex-col-reverse border-b border-white/10 py-8 md:border-b-0 md:pr-6">
            <dt className="eyebrow mt-3 text-stone-400">{f.label}</dt>
            <dd className="display text-5xl sm:text-6xl">{f.value}</dd>
          </div>
        ))}
      </Reveal>
    </div>
  </section>
);

export default AboutUs;
