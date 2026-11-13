import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.jpg";
import Logo from "../ui/Logo";

// Split-screen layout for login / sign-up / password help: brand panel + form panel.
export default function AuthLayout({ eyebrow, title, accent, aside, children }) {
  return (
    <div className="grid min-h-screen bg-bone lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col">
        <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" aria-hidden="true" />
        <div className="relative flex flex-1 flex-col justify-between p-12">
          <Logo tone="light" className="text-2xl" />
          <div>
            <p className="display text-5xl xl:text-6xl">
              Train with <span className="accent text-ember">intent.</span>
            </p>
            {aside && <p className="mt-6 max-w-sm text-white/70">{aside}</p>}
          </div>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo tone="dark" className="lg:invisible" />
          <Link to="/" aria-label="Back to home" className="link-underline tap text-sm font-medium text-stone-600 hover:text-ink">
            ← Back to site
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8 sm:py-12">
          <p className="eyebrow rise mb-4 flex items-center gap-3 text-stone-500">
            <span className="h-px w-8 bg-ember" aria-hidden="true" /> {eyebrow}
          </p>
          <h1 className="display rise text-4xl sm:text-5xl" style={{ "--rise-delay": "60ms" }}>
            {title} {accent && <span className="accent text-ember-600">{accent}</span>}
          </h1>
          <div className="rise mt-10" style={{ "--rise-delay": "140ms" }}>{children}</div>
        </div>
      </main>
    </div>
  );
}
