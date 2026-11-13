import { Link } from "react-router-dom";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";

// Plan descriptions are the gym's own wording. Specific claims ("24/7 access",
// "unlimited personal training") were left out pending owner confirmation: AUDIT_REPORT CT-05.
const PLANS = [
  { name: "Basic", body: "Access to gym facilities and group fitness classes." },
  { name: "Standard", body: "Gym access plus personal training and nutrition coaching.", featured: true },
  { name: "Premium", body: "Our most complete plan, with personal training and specialised workshops." },
];

const Services = () => (
  <section id="services" className="relative py-28 sm:py-40">
    <div className="container-x">
      <SectionHeading
        index="03"
        eyebrow="Services"
        title="Coaching that"
        accent="fits you."
        tone="light"
        intro="One-to-one coaching, nutrition guidance and membership plans for every level, from your first session to your next personal best."
      />

      <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-2">
        <Reveal className="glass flex flex-col p-8 sm:p-10">
          <p className="eyebrow text-stone-400">One-to-one</p>
          <h3 className="display-sm mt-6 text-3xl">Personal training</h3>
          <p className="mt-4 leading-relaxed text-stone-400">
            Get one-on-one coaching from our trainers to reach your goals faster, with a workout plan built around your needs.
          </p>
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-[0.95rem]">
            {["Personalized workout plans", "Flexible scheduling", "One-on-one support"].map((item) => (
              <li key={item} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />{item}</li>
            ))}
          </ul>
          <Link to="/contactUs" className="link-underline tap mt-8 self-start font-semibold">Enquire about personal training →</Link>
        </Reveal>

        <Reveal className="glass flex flex-col p-8 sm:p-10" delay={100}>
          <p className="eyebrow text-stone-400">Fuel</p>
          <h3 className="display-sm mt-6 text-3xl">Nutrition plans</h3>
          <p className="mt-4 leading-relaxed text-stone-400">
            Fuel your body with the right nutrients. A meal plan designed around your goals: building muscle, losing weight or maintaining a healthy lifestyle.
          </p>
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-[0.95rem]">
            {["Customised meal plans", "Weekly progress checks", "Easy-to-follow recipes"].map((item) => (
              <li key={item} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" />{item}</li>
            ))}
          </ul>
          <Link to="/contactUs" className="link-underline tap mt-8 self-start font-semibold">Enquire about nutrition plans →</Link>
        </Reveal>
      </div>

      <Reveal className="mt-20" delay={60}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h3 className="display-sm text-3xl sm:text-4xl">Membership plans</h3>
          <p className="text-stone-400">Ask at the front desk for current prices.</p>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-6">
        {PLANS.map((plan, i) => (
          <Reveal
            key={plan.name}
            delay={i * 90}
            className={`relative flex flex-col rounded-2xl p-7 sm:p-8 md:flex-row md:items-center md:gap-10 lg:flex-col lg:items-stretch lg:gap-0 ${plan.featured ? "border border-ember/50 bg-[#2a120b]/85" : "glass"}`}
          >
            <p className={`font-serif text-4xl italic md:w-40 md:shrink-0 lg:w-auto ${plan.featured ? "text-ember" : "text-ember"}`}>{plan.name}</p>
            <p className={`mt-4 flex-1 leading-relaxed md:mt-0 lg:mt-6 ${plan.featured ? "text-white/70" : "text-stone-400"}`}>{plan.body}</p>
            <Link to="/Signup" className={`mt-8 md:mt-0 lg:mt-10 ${plan.featured ? "btn-primary" : "btn-outline-light"}`}>
              Choose {plan.name}
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
