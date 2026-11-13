import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";

const PROGRAMS = ["Strength training", "Running & endurance", "Yoga", "Cardio & heart health", "Personal training", "Nutrition plans"];

const HeroSection = () => (
  <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
    <img
      src={heroImage}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-[70%_22%] opacity-80"
      // React 18 only forwards the lowercase attribute (camelCase is React 19+).
      // eslint-disable-next-line react/no-unknown-property
      fetchpriority="high"
    />
    {/* Legibility gradients: left-to-right for the headline, bottom for the ticker */}
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" aria-hidden="true" />
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

    {/* Short landscape screens (phones turned sideways): tighter spacing, label and intro hidden,
        headline sized by height, so the headline and both buttons fit on the first screen. */}
    <div className="container-x relative flex flex-1 flex-col justify-end pb-16 pt-32 sm:pb-20 [@media(max-height:500px)]:pb-6 [@media(max-height:500px)]:pt-24">
      <p className="eyebrow rise mb-6 flex items-center gap-3 text-stone-400 [@media(max-height:500px)]:hidden">
        <span className="h-px w-8 bg-ember" aria-hidden="true" />
        Strength · Cardio · Yoga · Coaching
      </p>

      <h1 className="display rise max-w-5xl text-[clamp(2.25rem,min(11.5vw,17svh),7.5rem)] [@media(max-height:500px)]:text-[13svh]" style={{ "--rise-delay": "80ms" }}>
        Get stronger.
        <br />
        Feel <span className="accent text-ember">better.</span>
        <br />
        Live better.
      </h1>

      <div className="rise mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between [@media(max-height:500px)]:mt-5" style={{ "--rise-delay": "200ms" }}>
        <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg [@media(max-height:500px)]:hidden">
          Start your fitness journey today. Whether you&apos;re looking to build muscle or improve your
          health, we have you covered.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/Signup" className="btn-primary px-8 py-4">
            Join Now
            <span aria-hidden="true">→</span>
          </Link>
          <Link to="/contactUs" className="btn-outline-light px-8 py-4">
            Visit or Enquire
          </Link>
        </div>
      </div>
    </div>

    {/* Program ticker */}
    <div className="relative border-t border-white/10 py-5" aria-hidden="true">
      <div className="flex w-max marquee-track">
        {[...PROGRAMS, ...PROGRAMS].map((p, i) => (
          <span key={i} className="display-sm flex items-center gap-8 px-4 text-sm text-white/50">
            {p}
            <span className="text-ember">✦</span>
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
