import { useEffect, useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";
import { EmptyState, PageHeader, Panel, formatDate, formatMethod } from "./ui";

const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

// "My Membership": plan details plus the member's own payment history.
export default function Payments({ user }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${FRONTEND_URL}/api/payment/me`)
      .then((res) => setPayments(res.data.payments || []))
      .catch(() => setError("Could not load your payment history."))
      .finally(() => setLoading(false));
  }, []);

  const details = user
    ? [
        ["Status", user.status],
        ["Plan", user.plan || "Not assigned yet"],
        ["Service", user.chosenService || "Not assigned yet"],
        ["Last payment", formatDate(user.paidDate)],
      ]
    : [];

  return (
    <>
      <PageHeader eyebrow="Membership" title="My" accent="membership" />

      <dl className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 xl:grid-cols-4">
        {details.map(([label, value]) => (
          <div key={label} className="bg-white p-5 sm:p-6">
            <dt className="eyebrow text-stone-500">{label}</dt>
            <dd className="display-sm mt-3 text-lg normal-case first-letter:uppercase sm:text-xl">{value}</dd>
          </div>
        ))}
      </dl>

      {user?.status === "Pending" && (
        <div className="mb-8 rounded-2xl bg-ink p-6 text-white sm:p-8">
          <p className="eyebrow text-ember">Next step</p>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/80">
            Your account is registered. Visit the front desk to choose a plan and complete your first payment,
            and your membership will be activated.
          </p>
        </div>
      )}

      <Panel title="Payment history">
        {loading ? (
          <p className="text-stone-500" role="status">Loading…</p>
        ) : error ? (
          <p className="alert-error">{error}</p>
        ) : payments.length === 0 ? (
          <EmptyState>No payments recorded yet.</EmptyState>
        ) : (
          <>
          <ul className="divide-y divide-ink/10 sm:hidden">
            {payments.map((p) => (
              <li key={p._id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium">{formatDate(p.paymentDate)}</p>
                  <p className="mt-1 truncate font-mono text-xs text-stone-500">{p.invoiceNumber || "—"}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {formatMethod(p.method)}{p.plan ? ` · ${p.plan[0].toUpperCase()}${p.plan.slice(1)}` : ""}
                  </p>
                </div>
                <p className="display-sm shrink-0 text-lg">{money(p.amountPaid)}</p>
              </li>
            ))}
          </ul>
          <div className="-mx-6 hidden overflow-x-auto sm:-mx-8 sm:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left">
                  {["Date", "Invoice", "Amount", "Method", "Plan"].map((h) => (
                    <th key={h} scope="col" className="eyebrow px-6 pb-3 font-semibold text-stone-500 sm:px-8">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {payments.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-bone-50">
                    <td className="whitespace-nowrap px-6 py-4 sm:px-8">{formatDate(p.paymentDate)}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs sm:px-8">{p.invoiceNumber || "—"}</td>
                    <td className="px-6 py-4 font-semibold sm:px-8">{money(p.amountPaid)}</td>
                    <td className="px-6 py-4 sm:px-8">{formatMethod(p.method)}</td>
                    <td className="px-6 py-4 capitalize sm:px-8">{p.plan || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </Panel>
    </>
  );
}
