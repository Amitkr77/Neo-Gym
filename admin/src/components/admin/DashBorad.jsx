import { Link } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdCurrencyRupee } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import PieChart from "./Dashboard/PieChart";
import Expense from "./Dashboard/Expense";
import ChartConfig from "./Dashboard/ChartConfig";
import useGymData, { formatDate, formatMoney } from "../../lib/useGymData";

const KpiCard = ({ to, Icon, label, value }) => {
  const body = (
    <div className="group relative w-full h-28 border rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-slate-700 hover:text-white transition">
      <Icon className="h-10 w-10" aria-hidden="true" />
      <h2>{label}</h2>
      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-6 h-6 px-1 flex items-center justify-center -mt-2 -mr-2">
        {value}
      </span>
    </div>
  );
  return to ? <Link to={to} className="block">{body}</Link> : body;
};

function DashBorad() {
  const { loading, errors, metrics, announcements = [], enquiries = [] } = useGymData();

  if (loading) return <p className="p-6 text-gray-600" role="status">Loading dashboard…</p>;

  return (
    <>
      {errors.length > 0 && (
        <p className="m-2 p-3 rounded bg-amber-50 text-amber-800 text-sm">
          Some data could not be loaded ({errors.join(", ")}). Figures may be incomplete.
        </p>
      )}

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard to="/admin/member/RegisteredMembers" Icon={FiUserCheck} label="Active Members" value={metrics.activeMembers} />
        <KpiCard to="/admin/member/RegisteredMembers" Icon={HiOutlineUserGroup} label="Registered Members" value={metrics.totalMembers} />
        <KpiCard to="/admin/payment/MemberPaymentTable" Icon={MdCurrencyRupee} label="Total Earnings" value={formatMoney(metrics.totalEarnings)} />
        <KpiCard to="/admin/annoucement/ManageAnnouncement" Icon={TfiAnnouncement} label="Announcements" value={announcements.length} />
      </div>
      {metrics.pendingMembers > 0 && (
        <p className="mx-6 -mt-2 mb-2 text-sm text-amber-800">
          {metrics.pendingMembers} member{metrics.pendingMembers === 1 ? " is" : "s are"} pending: registered online
          and awaiting a plan and payment.{" "}
          <Link className="underline" to="/admin/payment/PaymentForm">Record a payment</Link>
        </p>
      )}

      <ChartConfig metrics={metrics} />
      <Expense metrics={metrics} />
      <PieChart metrics={metrics} />

      <div className="flex flex-col xl:flex-row">
        <section className="w-full p-2 border-t">
          <div className="mx-auto max-w-7xl p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enquiries ({enquiries.length})</h2>
            {enquiries.length === 0 ? (
              <p className="text-center py-6 text-gray-500">No enquiries yet.</p>
            ) : (
              enquiries.map((request) => (
                <article key={request._id} className="mb-6 p-5 bg-white rounded-xl border">
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-blue-700">Full name</h3>
                      <p className="text-gray-700">{request.firstName} {request.lastName}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-green-700">Email</h3>
                      <a className="text-gray-700 underline" href={`mailto:${request.email}`}>{request.email}</a>
                    </div>
                    {request.phone && (
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h3 className="text-sm font-semibold text-amber-700">Phone</h3>
                        <a className="text-gray-700 underline" href={`tel:${request.phone}`}>{request.phone}</a>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700">Message</h3>
                    <p className="text-gray-700 whitespace-pre-line">{request.message}</p>
                  </div>
                  <p className="mt-3 text-gray-500 text-sm">
                    <strong>Received:</strong> {new Date(request.createdAt).toLocaleString()}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="w-full p-2 border-t">
          <div className="w-full p-6 bg-white rounded-lg shadow">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <TfiAnnouncement className="text-blue-400 text-xl" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-gray-800">Gym Announcements</h2>
            </div>
            <div className="overflow-auto bg-gray-800 rounded-lg p-4 space-y-3">
              {announcements.length === 0 ? (
                <p className="text-center py-3 text-gray-400 text-sm">No announcements found.</p>
              ) : (
                announcements.map((a) => (
                  <div key={a._id} className="p-3 rounded-md bg-[#2d2f39]">
                    <p className="text-xs text-blue-300">{formatDate(a.appliedDate)}</p>
                    <p className="text-sm text-white">{a.message}</p>
                  </div>
                ))
              )}
            </div>
            <Link
              to="/admin/annoucement/ManageAnnouncement"
              className="inline-block text-center mt-4 px-4 py-2 rounded-full border bg-lime-600 text-white text-sm hover:bg-lime-700"
            >
              Manage announcements
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default DashBorad;
