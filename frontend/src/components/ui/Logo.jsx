import { Link } from "react-router-dom";

// Wordmark: expanded display type with a single ember full stop.
export default function Logo({ tone = "light", className = "" }) {
  const color = tone === "light" ? "text-white" : "text-ink";
  return (
    <Link to="/" aria-label="NeoGym home" className={`display-sm inline-flex min-h-[44px] items-center text-xl tracking-tight ${color} ${className}`}>
      Neogym<span className="text-ember">.</span>
    </Link>
  );
}
