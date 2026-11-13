import { useEffect, useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";
import { PageHeader, Panel } from "./ui";

// Shows the logged-in member's own payment reminder.
export default function Reminder() {
  const [reminder, setReminder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${FRONTEND_URL}/api/member/me`)
      .then((response) => setReminder(Boolean(response.data.reminder)))
      .catch(() => setError("Failed to fetch reminder data."))
      .finally(() => setLoading(false));
  }, []);

  const dismissReminder = async () => {
    try {
      const response = await axios.put(`${FRONTEND_URL}/api/member/me/reminder/dismiss`);
      setReminder(Boolean(response.data.reminder));
    } catch {
      setError("Failed to dismiss the reminder.");
    }
  };

  return (
    <>
      <PageHeader eyebrow="Billing" title="Reminders" />
      <Panel className="max-w-2xl">
        {loading ? (
          <p className="text-stone-500" role="status">Loading…</p>
        ) : error ? (
          <p className="alert-error">{error}</p>
        ) : reminder ? (
          <div role="alert" className="border-l-2 border-ember pl-6">
            <p className="eyebrow text-ember-700">Action needed</p>
            <h2 className="display-sm mt-3 text-2xl">Payment reminder</h2>
            <p className="mt-3 leading-relaxed text-stone-600">
              Your membership payment is due soon. Please clear your dues before the due date to avoid any
              interruption to your access.
            </p>
            <button onClick={dismissReminder} className="btn-outline-dark mt-6">Dismiss</button>
          </div>
        ) : (
          <div className="border-l-2 border-emerald-600 pl-6">
            <p className="eyebrow text-emerald-800">All clear</p>
            <h2 className="display-sm mt-3 text-2xl">No reminders right now</h2>
            <p className="mt-3 text-stone-600">You&apos;re all set. We&apos;ll show payment reminders here.</p>
          </div>
        )}
      </Panel>
    </>
  );
}
