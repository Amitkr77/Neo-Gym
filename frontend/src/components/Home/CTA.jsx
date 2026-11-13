import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

// Closing chapter: full-screen over the scene as the camera turns toward the ember sun.
const CTA = () => (
  <section id="begin" className="relative flex min-h-[100svh] items-end overflow-hidden">
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/50 to-transparent" aria-hidden="true" />
    <div className="container-x relative pb-24 sm:pb-32">
      <Reveal>
        <p className="eyebrow mb-6 flex items-center gap-3 text-stone-400">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />
          Chapter 05 — Your next chapter
        </p>
        <h2 className="display max-w-5xl text-[clamp(3rem,10vw,9rem)]">
          Ready to <span className="accent text-ember">begin?</span>
        </h2>
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-white/75">
            Join our community today and take your fitness to the next level. Start building a healthier, stronger you.
          </p>
          <Link to="/Signup" className="btn-primary px-8 py-4">
            Get Started Now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

export default CTA;
