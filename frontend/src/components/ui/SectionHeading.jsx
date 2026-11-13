import Reveal from "./Reveal";

// Consistent section header: numbered eyebrow, display title with an optional serif accent.
export default function SectionHeading({ index, eyebrow, title, accent, intro, tone = "dark", align = "left" }) {
  const muted = tone === "dark" ? "text-stone-500" : "text-stone-400";
  const titleColor = tone === "dark" ? "text-ink" : "text-white";
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow mb-5 flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${muted}`}>
        {index && <span className="text-ember">{index}</span>}
        <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className={`display text-4xl sm:text-5xl lg:text-6xl ${titleColor}`}>
        {title} {accent && <span className={`accent ${tone === "dark" ? "text-ember-600" : "text-ember"}`}>{accent}</span>}
      </h2>
      {intro && <p className={`lead mt-6 ${tone === "dark" ? "text-stone-600" : "text-stone-400"}`}>{intro}</p>}
    </Reveal>
  );
}
