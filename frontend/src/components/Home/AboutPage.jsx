import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

const VALUES = [
  { title: "Community first", body: "Whether you're new to fitness or a seasoned pro, you'll train alongside people who push each other forward." },
  { title: "Coaching that listens", body: "Plans start from your goals and your starting point, and change as you progress." },
  { title: "Everything you need", body: "The equipment, the expertise and the environment to help you reach your goals." },
];

// Unverified statistics ("30+ awards", "5000+ clients", "98% satisfaction", "10+ years") were
// removed: AUDIT_REPORT CT-01. Add real figures here once confirmed by the owner.
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-ink pb-24 pt-40 text-white sm:pb-32">
          <div className="container-x">
            <p className="eyebrow rise mb-6 flex items-center gap-3 text-stone-400">
              <span className="h-px w-8 bg-ember" aria-hidden="true" /> About NeoGym
            </p>
            <h1 className="display rise max-w-5xl text-5xl sm:text-7xl lg:text-8xl" style={{ "--rise-delay": "80ms" }}>
              Not just a gym. <span className="accent text-ember">A community.</span>
            </h1>
          </div>
        </section>

        <section className="bg-bone py-24 sm:py-32">
          <div className="container-x grid items-center gap-14 lg:grid-cols-2">
            <Reveal className="overflow-hidden rounded-2xl bg-ink">
              <img src={heroImage} alt="A member training with dumbbells at NeoGym" className="aspect-[4/5] w-full object-cover object-[65%_center]" loading="lazy" />
            </Reveal>
            <Reveal delay={120}>
              <h2 className="display text-4xl sm:text-5xl">
                Welcome to <span className="accent text-ember-600">NeoGym</span>
              </h2>
              <p className="lead mt-8 text-stone-600">
                At NeoGym, we&apos;re not just a gym: we&apos;re a community. Whether you&apos;re new to fitness or a
                seasoned pro, we have the equipment, the expertise and the environment to help you achieve your goals.
              </p>
              <Link to="/Signup" className="btn-dark mt-10">
                Join Us Today <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="bg-bone-200/60 py-24 sm:py-32">
          <div className="container-x">
            <SectionHeading index="—" eyebrow="What we stand for" title="Our" accent="values." />
            <ol className="mt-16 grid gap-10 md:grid-cols-3">
              {VALUES.map((v, i) => (
                <Reveal as="li" key={v.title} delay={i * 100} className="border-t border-ink pt-8">
                  <span className="font-serif text-4xl italic text-ember-600">0{i + 1}</span>
                  <h3 className="display-sm mt-6 text-xl">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-stone-600">{v.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
