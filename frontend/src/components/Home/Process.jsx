import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

// Explains the real joining flow so new members know what happens after sign-up.
const STEPS = [
  { title: "Create your account", body: "Sign up online in under a minute. Your account starts as pending until your plan is set." },
  { title: "Choose your plan", body: "Visit the front desk or send us an enquiry. We'll help you pick the plan and service that fit your goals." },
  { title: "Pay & start training", body: "Once your payment is recorded your membership is active, and receipts appear in your member portal." },
];

const Process = () => (
  <section id="joining" className="relative py-28 sm:py-40">
    <div className="container-x">
      <SectionHeading index="04" eyebrow="Getting started" title="How joining" accent="works." tone="light" />
      <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 100} className="relative glass p-7 sm:p-9">
            <span className="display text-6xl text-ember/30" aria-hidden="true">0{i + 1}</span>
            <h3 className="display-sm mt-4 text-xl">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-stone-400">{step.body}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-14 flex flex-wrap gap-3" delay={150}>
        <Link to="/Signup" className="btn-primary">Create account</Link>
        <Link to="/contactUs" className="btn-outline-light bg-ink/40">Ask a question</Link>
      </Reveal>
    </div>
  </section>
);

export default Process;
