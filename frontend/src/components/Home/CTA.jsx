import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

const CTA = () => (
  <section className="relative overflow-hidden bg-ember text-ink">
    <div className="container-x py-24 sm:py-32">
      <Reveal>
        <p className="eyebrow mb-6 text-ink/70">Your next chapter</p>
        <h2 className="display max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
          Ready to <span className="accent">begin?</span>
        </h2>
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-ink/80">
            Join our community today and take your fitness to the next level. Start building a healthier, stronger you.
          </p>
          <Link to="/Signup" className="btn bg-ink px-8 py-4 text-bone hover:bg-ink-700">
            Get Started Now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Reveal>
    </div>
    <span
      className="display pointer-events-none absolute -bottom-10 right-0 select-none text-[11rem] leading-none text-ink/10 sm:text-[16rem]"
      aria-hidden="true"
    >
      Neo
    </span>
  </section>
);

export default CTA;
