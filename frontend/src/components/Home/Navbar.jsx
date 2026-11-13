import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";

const LINKS = [
  { to: "/#programs", label: "Programs" },
  { to: "/#services", label: "Services" },
  { to: "/AboutPage", label: "About" },
  { to: "/contactUs", label: "Contact" },
];

// overlay: transparent over a dark hero until the page scrolls; otherwise solid.
const Navbar = ({ overlay = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation; lock page scroll while it is open.
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const solid = !overlay || scrolled || menuOpen;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-premium ${
        solid ? "bg-ink/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-[72px] items-center justify-between" aria-label="Main">
        <Logo tone="light" />

        <ul className="hidden items-center gap-6 md:flex lg:gap-9">
          {LINKS.map(({ to, label }) => (
            <li key={label}>
              <NavLink
                to={to}
                className="link-underline tap text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/login" className="link-underline tap text-sm font-medium text-white/80 hover:text-white">
            Login
          </Link>
          <Link to="/Signup" className="btn-primary px-5 py-2.5 text-sm">
            Join Now
          </Link>
        </div>

        <button
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span className={`absolute left-0 block h-[1.5px] w-6 bg-white transition-transform duration-300 ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 block h-[1.5px] w-6 bg-white transition-transform duration-300 ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>
    </header>

      {/* Rendered outside <header>: the header's backdrop-filter would otherwise become the
          containing block for this fixed panel and shrink it to the header's 72px height. */}
      {menuOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] z-40 flex flex-col overflow-y-auto overscroll-contain bg-ink px-5 pb-10 pt-6 md:hidden [@media(max-height:500px)]:pt-2">
          <ul className="flex flex-col">
            {[{ to: "/", label: "Home" }, ...LINKS].map(({ to, label }, i) => (
              <li key={label} className="rise border-b border-white/10" style={{ "--rise-delay": `${i * 50}ms` }}>
                <Link to={to} className="display-sm flex items-baseline justify-between py-5 text-3xl text-white [@media(max-height:500px)]:py-3 [@media(max-height:500px)]:text-2xl">
                  {label}
                  <span className="font-sans text-xs font-medium tracking-normal text-stone-400">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
            <Link to="/login" className="btn-outline-light">Login</Link>
            <Link to="/Signup" className="btn-primary">Join Now</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
