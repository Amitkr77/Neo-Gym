import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import FRONTEND_URL, { GYM_NAME } from "../../../constant/const";
import { formatMoney } from "../../../lib/useGymData";

const METHOD_LABELS = { cash: "Cash", upi: "UPI", card: "Card", bank_transfer: "Bank transfer", other: "Other" };

// Receipt rendered from the saved payment record, with its persisted invoice number.
// (Previously it showed a random invoice number on each render and another gym's name/address.)
const PaymentReceipt = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(id ? "" : "No payment selected.");

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${FRONTEND_URL}/api/payment/${id}`)
      .then((res) => setPayment(res.data.payment))
      .catch((err) => setError(err.response?.status === 404 ? "Payment not found." : "Could not load this receipt."));
  }, [id]);

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/payment/MemberPaymentTable" className="text-blue-600 underline">Back to payments</Link>
      </div>
    );
  }
  if (!payment) return <p className="p-6 text-gray-600" role="status">Loading receipt…</p>;

  const memberName = payment.member?.fullName || payment.memberName || "Deleted member";

  return (
    <div className="p-8 bg-white shadow rounded-lg max-w-2xl mx-auto print:shadow-none">
      <h1 className="text-3xl font-bold text-center mb-1">{GYM_NAME}</h1>
      <p className="text-center text-gray-600 mb-6">Payment receipt</p>

      <div className="flex flex-wrap justify-between gap-2 text-sm mb-6">
        <div>
          <p className="font-medium">Invoice # {payment.invoiceNumber || "— (recorded before invoice numbering)"}</p>
          <p>Paid on: {new Date(payment.paymentDate).toLocaleDateString("en-GB")}</p>
        </div>
        <div className="sm:text-right">
          <p className="font-medium">Member: {memberName}</p>
          {payment.member?.username && <p>@{payment.member.username}</p>}
          {payment.member?.contactNumber && <p>{payment.member.contactNumber}</p>}
        </div>
      </div>

      <table className="w-full border border-gray-300 mb-4 text-sm">
        <tbody>
          <tr><th className="p-2 text-left bg-gray-50 w-1/2">Service</th><td className="p-2">{payment.chosenService || "—"}</td></tr>
          <tr><th className="p-2 text-left bg-gray-50">Plan</th><td className="p-2 capitalize">{payment.plan || "—"}</td></tr>
          <tr><th className="p-2 text-left bg-gray-50">Payment method</th><td className="p-2">{METHOD_LABELS[payment.method] || "—"}</td></tr>
          {payment.note && <tr><th className="p-2 text-left bg-gray-50">Note</th><td className="p-2">{payment.note}</td></tr>}
          <tr className="bg-gray-100 font-semibold"><th className="p-2 text-left">Total paid</th><td className="p-2">{formatMoney(payment.amountPaid)}</td></tr>
        </tbody>
      </table>

      <p className="text-center mt-4 text-sm text-gray-600">Thank you for your payment.</p>
      <div className="mt-6 flex justify-center gap-3 print:hidden">
        <button className="bg-slate-800 text-white py-2 px-4 rounded hover:bg-slate-900" onClick={() => window.print()}>
          Print
        </button>
        <Link to="/admin/payment/MemberPaymentTable" className="py-2 px-4 rounded border hover:bg-gray-50">Back to payments</Link>
      </div>
    </div>
  );
};

export default PaymentReceipt;
