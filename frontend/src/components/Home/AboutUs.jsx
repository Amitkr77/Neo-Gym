import SectionHeading from "../ui/SectionHeading";
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

// Home: "Why NeoGym" — mission statement plus three pillars.
const AboutUs = () => (
  <section id="about" className="bg-bone py-24 sm:py-32">
    <div className="container-x">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading index="01" eyebrow="Why NeoGym" title="Built for" accent="progress." />
        </div>
        <Reveal className="lg:col-span-5 lg:pt-14" delay={120}>
          <p className="lead text-stone-600">
            Our mission is to help you reach your fitness goals in a welcoming, motivating environment,
            with coaching, equipment and classes that support you every step of the way.
          </p>
        </Reveal>
      </div>

      <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:mt-20 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <Reveal as="li" key={pillar.title} delay={i * 90} className="group bg-bone-50 p-7 transition-colors duration-500 hover:bg-white sm:grid sm:grid-cols-[5rem_1fr] sm:gap-x-6 sm:p-10 lg:block">
            <span className="font-serif text-5xl italic leading-none text-ember-600">0{i + 1}</span>
            <div>
              <h3 className="display-sm mt-6 text-xl sm:mt-1 lg:mt-10">{pillar.title}</h3>
              <p className="mt-4 max-w-prose leading-relaxed text-stone-600">{pillar.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default AboutUs;
