// Shared building blocks for the member portal.

const METHOD_LABELS = { cash: "Cash", upi: "UPI", card: "Card", bank_transfer: "Bank transfer", other: "Other" };
export const formatMethod = (m) => METHOD_LABELS[m] || "—";

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export function PageHeader({ eyebrow, title, accent, children }) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="eyebrow mb-3 text-stone-500">{eyebrow}</p>}
        <h1 className="display text-3xl sm:text-4xl">
          {title} {accent && <span className="accent text-ember-600">{accent}</span>}
        </h1>
      </div>
      {children}
    </header>
  );
}

export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`card min-w-0 p-5 sm:p-8 ${className}`}>
      {(title || action) && (
        <div className="mb-6 flex items-center justify-between gap-4">
          {title && <h2 className="display-sm text-lg">{title}</h2>}
          {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyState({ children }) {
  return <p className="rounded-xl border border-dashed border-ink/15 px-4 py-8 text-center text-stone-500">{children}</p>;
}

export function AnnouncementList({ items, limit }) {
  const list = limit ? items.slice(0, limit) : items;
  if (!list.length) return <EmptyState>No announcements found.</EmptyState>;
  return (
    <ul className="divide-y divide-ink/10">
      {list.map((a) => (
        <li key={a._id} className="flex flex-col gap-1.5 py-4 first:pt-0 last:pb-0 sm:flex-row sm:gap-5">
          <time className="eyebrow shrink-0 text-stone-500 sm:w-28 sm:pt-1" dateTime={a.appliedDate}>
            {formatDate(a.appliedDate)}
          </time>
          <p className="leading-relaxed text-ink">{a.message}</p>
        </li>
      ))}
    </ul>
  );
}

export function StatusBadge({ status }) {
  const tone =
    status === "Active"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20"
      : status === "Expired"
        ? "bg-ember/10 text-ember-700 ring-ember/25"
        : "bg-amber-50 text-amber-900 ring-amber-600/25";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      Membership: {status}
    </span>
  );
}
