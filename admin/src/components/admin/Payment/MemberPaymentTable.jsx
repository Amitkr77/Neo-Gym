import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FRONTEND_URL from "../../../constant/const";
import { formatDate, formatMoney } from "../../../lib/useGymData";

const MemberPaymentTable = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState({}); // memberId -> current reminder flag
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${FRONTEND_URL}/api/payment`)
      .then((res) => {
        const payments = res.data.payments || [];
        setPaymentData(payments);
        // Start from each member's real reminder setting (previously always "off").
        const initial = {};
        payments.forEach((p) => { if (p.member) initial[p.member._id] = Boolean(p.member.reminder); });
        setReminders(initial);
      })
      .catch(() => setError("Failed to load payment data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const toggleReminder = async (memberId) => {
    const value = !reminders[memberId];
    try {
      const res = await axios.put(`${FRONTEND_URL}/api/member/users/${memberId}/reminder`, { reminder: value });
      setReminders((prev) => ({ ...prev, [memberId]: res.data.reminder }));
      toast.success(value ? "Payment reminder turned on" : "Payment reminder turned off");
    } catch {
      toast.error("Could not update the reminder.");
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return paymentData;
    return paymentData.filter((p) =>
      [p.member?.fullName, p.memberName, p.invoiceNumber, p.chosenService, p.plan, p.method]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [paymentData, search]);

  if (loading) return <p className="p-6 text-gray-600" role="status">Loading payments…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Payments</h1>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="payment-search">Search payments</label>
          <input
            id="payment-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, invoice, plan…"
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <Link to="/admin/payment/PaymentForm" className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700">
            Record payment
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              {["#", "Invoice", "Member", "Payment date", "Amount", "Method", "Service", "Plan", "Actions", "Reminder"].map((h) => (
                <th key={h} className="py-2 px-3 border-b text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((payment, index) => {
                const member = payment.member; // null when the member has been deleted
                return (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border-b">{index + 1}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap">{payment.invoiceNumber || "—"}</td>
                    <td className="py-2 px-3 border-b">
                      {member ? member.fullName : <span className="text-gray-500">{payment.memberName || "Unknown"} (deleted)</span>}
                    </td>
                    <td className="py-2 px-3 border-b">{formatDate(payment.paymentDate)}</td>
                    <td className="py-2 px-3 border-b">{formatMoney(payment.amountPaid)}</td>
                    <td className="py-2 px-3 border-b capitalize">{(payment.method || "—").replace("_", " ")}</td>
                    <td className="py-2 px-3 border-b">{payment.chosenService || "—"}</td>
                    <td className="py-2 px-3 border-b capitalize">{payment.plan || "—"}</td>
                    <td className="py-2 px-3 border-b whitespace-nowrap space-x-2">
                      <Link to={`/admin/payment/PaymentReceipt?id=${payment._id}`} className="text-blue-600 underline">Receipt</Link>
                      {member && (
                        <Link to="/admin/payment/PaymentForm" state={{ memberId: member._id }} className="text-green-700 underline">
                          New payment
                        </Link>
                      )}
                    </td>
                    <td className="py-2 px-3 border-b">
                      {member && (
                        <button
                          className={`px-3 py-1 rounded-md text-white ${reminders[member._id] ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
                          onClick={() => toggleReminder(member._id)}
                          aria-pressed={Boolean(reminders[member._id])}
                        >
                          {reminders[member._id] ? "Cancel alert" : "Set alert"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  {paymentData.length === 0 ? "No payments recorded yet." : "No payments match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberPaymentTable;
