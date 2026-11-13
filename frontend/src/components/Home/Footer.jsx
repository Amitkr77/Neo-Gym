import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

const COLUMNS = [
  { title: "Explore", links: [["/#programs", "Programs"], ["/#services", "Services"], ["/AboutPage", "About us"], ["/contactUs", "Contact"]] },
  { title: "Members", links: [["/login", "Member login"], ["/Signup", "Create an account"], ["/ForgotPassword", "Forgot password"]] },
];

// Social links and a newsletter were placeholders (href="#", no handler) and were removed:
// AUDIT_REPORT FE-05/FE-06. Add them back once real accounts / a mailing tool exist.
const Footer = () => (
  <footer className="bg-ink text-white">
    <div className="container-x pb-10 pt-20">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 lg:col-span-5">
          <Logo tone="light" className="text-3xl" />
          <p className="mt-6 max-w-sm leading-relaxed text-stone-400">
            Your fitness journey starts here: strength, cardio, yoga and coaching under one roof.
          </p>
          <Link to="/contactUs" className="btn-primary mt-8">Send us an enquiry</Link>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} className="md:col-span-3" aria-label={col.title}>
            <h2 className="eyebrow text-stone-400">{col.title}</h2>
            <ul className="mt-4">
              {col.links.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="link-underline tap text-white/80 hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm text-stone-400 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} NeoGym. All rights reserved.</p>
        <p>Train with intent.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
