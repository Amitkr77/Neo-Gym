import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FRONTEND_URL, { CURRENCY } from "../../../constant/const";
import { newIdempotencyKey } from "../../../lib/session";

const today = () => new Date().toISOString().slice(0, 10);

// Records a payment against a member. Replaces a leftover PHP form (action="userpay.php")
// that never called the API.
export default function PaymentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state?.memberId || location.state?.data?.member?._id || "";

  const [members, setMembers] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState({
    memberId: preselected,
    amountPaid: location.state?.data?.amountPaid || "",
    paymentDate: today(),
    method: "cash",
    note: "",
    memberStatus: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // One key per form instance: double clicks or retries can never create two payments.
  const [idempotencyKey] = useState(newIdempotencyKey);

  useEffect(() => {
    axios
      .get(`${FRONTEND_URL}/api/member/users`)
      .then((res) => setMembers(res.data))
      .catch(() => setLoadError("Could not load the member list. Please refresh the page."));
  }, []);

  const selected = useMemo(() => members.find((m) => m._id === form.memberId), [members, form.memberId]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.memberId) return setError("Please choose a member.");
    if (!(Number(form.amountPaid) > 0)) return setError("Amount must be greater than zero.");

    setSubmitting(true);
    try {
      const body = { ...form, amountPaid: Number(form.amountPaid), idempotencyKey };
      if (!body.memberStatus) delete body.memberStatus;
      if (!body.note) delete body.note;
      const res = await axios.post(`${FRONTEND_URL}/api/payment`, body);
      toast.success(res.data.duplicate ? "This payment was already recorded." : "Payment recorded.");
      navigate(`/admin/payment/PaymentReceipt?id=${res.data.payment._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not record the payment. Please try again.");
      setSubmitting(false);
    }
  };

  const field = "border border-gray-300 rounded p-2 w-full";

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Record a payment</h1>
        <Link to="/admin/payment/MemberPaymentTable" className="text-blue-600 underline text-sm">Back to payments</Link>
      </div>

      {loadError && <p className="mb-4 p-3 rounded bg-red-50 text-red-700">{loadError}</p>}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="memberId" className="block text-sm font-medium mb-1">Member</label>
          <select id="memberId" name="memberId" value={form.memberId} onChange={onChange} className={field} required>
            <option value="">Select a member…</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName} (@{m.username}) — {m.status}
              </option>
            ))}
          </select>
          {selected && (
            <p className="text-xs text-gray-600 mt-1">
              Plan: {selected.plan || "not set"} · Service: {selected.chosenService || "not set"} · Last paid:{" "}
              {selected.paidDate ? new Date(selected.paidDate).toLocaleDateString("en-GB") : "never"}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium mb-1">Amount ({CURRENCY})</label>
            <input id="amountPaid" name="amountPaid" type="number" min="1" step="0.01" value={form.amountPaid} onChange={onChange} className={field} required />
          </div>
          <div>
            <label htmlFor="paymentDate" className="block text-sm font-medium mb-1">Payment date</label>
            <input id="paymentDate" name="paymentDate" type="date" max={today()} value={form.paymentDate} onChange={onChange} className={field} required />
          </div>
          <div>
            <label htmlFor="method" className="block text-sm font-medium mb-1">Method</label>
            <select id="method" name="method" value={form.method} onChange={onChange} className={field}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="memberStatus" className="block text-sm font-medium mb-1">Update member status (optional)</label>
            <select id="memberStatus" name="memberStatus" value={form.memberStatus} onChange={onChange} className={field}>
              <option value="">Leave unchanged</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium mb-1">Note (optional)</label>
          <input id="note" name="note" maxLength={500} value={form.note} onChange={onChange} className={field} placeholder="e.g. 3-month renewal, receipt no. from card machine" />
        </div>

        {error && <p className="p-3 rounded bg-red-50 text-red-700" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white py-2 px-5 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Recording…" : "Record payment"}
        </button>
      </form>
    </div>
  );
}
