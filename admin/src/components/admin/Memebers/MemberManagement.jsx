import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FRONTEND_URL from "../../../constant/const";
import { formatDate } from "../../../lib/useGymData";

const EDITABLE = ["fullName", "username", "contactNumber", "gender", "plan", "chosenService", "status", "amount", "reminder"];

// Real member management (previously hardcoded "John Doe" rows with fake Edit/Remove).
export function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    axios
      .get(`${FRONTEND_URL}/api/member/users`)
      .then((res) => setMembers(res.data))
      .catch(() => setError("Could not load members."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.fullName, m.username, m.contactNumber, m.plan, m.chosenService, m.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [members, search]);

  const startEdit = (m) => {
    setFormError("");
    setEditing({
      _id: m._id,
      ...Object.fromEntries(EDITABLE.map((k) => [k, m[k] ?? ""])),
      address: { street: "", city: "", state: "", zipCode: "", ...(m.address || {}) },
      updatedAt: m.updatedAt,
    });
  };

  const onEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setEditing((p) => ({ ...p, address: { ...p.address, [key]: value } }));
    } else {
      setEditing((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      // Detect a concurrent edit by another admin since this form was opened.
      const latest = await axios.get(`${FRONTEND_URL}/api/member/users/${editing._id}`);
      if (latest.data.updatedAt !== editing.updatedAt &&
          !window.confirm("This member was changed by someone else after you opened the form. Overwrite their changes?")) {
        setSaving(false);
        return;
      }
      const body = Object.fromEntries(EDITABLE.map((k) => [k, editing[k]]));
      body.address = editing.address;
      if (body.amount === "") delete body.amount;
      if (body.plan === "") delete body.plan;
      if (body.chosenService === "") delete body.chosenService;
      const res = await axios.put(`${FRONTEND_URL}/api/member/users/${editing._id}`, body);
      setMembers((prev) => prev.map((m) => (m._id === editing._id ? res.data.user : m)));
      setEditing(null);
      toast.success("Member updated");
    } catch (err) {
      setFormError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete ${m.fullName}? Their payment records are kept for accounting.`)) return;
    try {
      await axios.delete(`${FRONTEND_URL}/api/member/users/${m._id}`);
      setMembers((prev) => prev.filter((x) => x._id !== m._id));
      toast.success("Member deleted");
    } catch {
      toast.error("Could not delete the member.");
    }
  };

  const field = "border border-gray-300 rounded p-2 w-full";

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-semibold">Manage members</h1>
          <p className="text-sm text-gray-500">Edit member details, plan and status, or remove a member.</p>
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="member-search">Search members</label>
          <input id="member-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="border rounded-lg px-3 py-2" />
          <Link to="/admin/member/MemberEntryForm" className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700">Add member</Link>
        </div>
      </div>

      {loading ? (
        <p role="status">Loading members…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-left">
              <tr>{["Name", "Username", "Contact", "Plan", "Service", "Status", "Last paid", "Actions"].map((h) => <th key={h} className="p-2 border-b">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="p-4 text-center text-gray-500">{members.length ? "No members match your search." : "No members yet."}</td></tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="p-2 border-b font-medium">{m.fullName}</td>
                    <td className="p-2 border-b">{m.username}</td>
                    <td className="p-2 border-b">{m.contactNumber}</td>
                    <td className="p-2 border-b capitalize">{m.plan || "—"}</td>
                    <td className="p-2 border-b">{m.chosenService || "—"}</td>
                    <td className="p-2 border-b">{m.status}</td>
                    <td className="p-2 border-b">{formatDate(m.paidDate)}</td>
                    <td className="p-2 border-b whitespace-nowrap space-x-3">
                      <button className="text-blue-700 underline" onClick={() => startEdit(m)}>Edit</button>
                      <Link className="text-green-700 underline" to="/admin/payment/PaymentForm" state={{ memberId: m._id }}>Payment</Link>
                      <button className="text-red-600 underline" onClick={() => remove(m)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-member-title">
          <form onSubmit={save} className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-3">
            <h2 id="edit-member-title" className="text-lg font-semibold">Edit member</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm"><span className="block" id="edit-fullName-label">Full name</span><input id="edit-fullName" aria-labelledby="edit-fullName-label" name="fullName" value={editing.fullName} onChange={onEditChange} className={field} required /></label>
              <label className="text-sm"><span className="block" id="edit-username-label">Username</span><input id="edit-username" aria-labelledby="edit-username-label" name="username" value={editing.username} onChange={onEditChange} className={field} required /></label>
              <label className="text-sm"><span className="block" id="edit-contactNumber-label">Contact (10 digits)</span><input id="edit-contactNumber" aria-labelledby="edit-contactNumber-label" name="contactNumber" value={editing.contactNumber} onChange={onEditChange} className={field} pattern="\d{10}" required /></label>
              <label className="text-sm"><span className="block" id="edit-gender-label">Gender</span><select id="edit-gender" aria-labelledby="edit-gender-label" name="gender" value={editing.gender} onChange={onEditChange} className={field}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </label>
              <label className="text-sm"><span className="block" id="edit-plan-label">Plan</span><select id="edit-plan" aria-labelledby="edit-plan-label" name="plan" value={editing.plan} onChange={onEditChange} className={field}>
                  <option value="">Not set</option><option value="basic">Basic</option><option value="standard">Standard</option><option value="premium">Premium</option>
                </select>
              </label>
              <label className="text-sm"><span className="block" id="edit-chosenService-label">Service</span><select id="edit-chosenService" aria-labelledby="edit-chosenService-label" name="chosenService" value={editing.chosenService} onChange={onEditChange} className={field}>
                  <option value="">Not set</option><option value="Fitness">Fitness</option><option value="Sauna">Sauna</option><option value="Cardio">Cardio</option>
                </select>
              </label>
              <label className="text-sm"><span className="block" id="edit-status-label">Status</span><select id="edit-status" aria-labelledby="edit-status-label" name="status" value={editing.status} onChange={onEditChange} className={field}>
                  <option value="Active">Active</option><option value="Pending">Pending</option><option value="Expired">Expired</option>
                </select>
              </label>
              <label className="text-sm"><span className="block" id="edit-amount-label">Plan amount</span><input id="edit-amount" aria-labelledby="edit-amount-label" name="amount" type="number" min="0" value={editing.amount} onChange={onEditChange} className={field} /></label>
              <label className="text-sm"><span className="block" id="edit-address-street-label">Street</span><input id="edit-address-street" aria-labelledby="edit-address-street-label" name="address.street" value={editing.address.street} onChange={onEditChange} className={field} required /></label>
              <label className="text-sm"><span className="block" id="edit-address-city-label">City</span><input id="edit-address-city" aria-labelledby="edit-address-city-label" name="address.city" value={editing.address.city} onChange={onEditChange} className={field} required /></label>
              <label className="text-sm"><span className="block" id="edit-address-state-label">State</span><input id="edit-address-state" aria-labelledby="edit-address-state-label" name="address.state" value={editing.address.state} onChange={onEditChange} className={field} required /></label>
              <label className="text-sm"><span className="block" id="edit-address-zipCode-label">PIN / ZIP</span><input id="edit-address-zipCode" aria-labelledby="edit-address-zipCode-label" name="address.zipCode" value={editing.address.zipCode} onChange={onEditChange} className={field} required /></label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="reminder" checked={Boolean(editing.reminder)} onChange={onEditChange} /> Show payment reminder to member
            </label>
            {formError && <p className="p-2 rounded bg-red-50 text-red-700" role="alert">{formError}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded border">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
