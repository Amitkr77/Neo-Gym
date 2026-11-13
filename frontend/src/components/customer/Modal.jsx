import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FRONTEND_URL from "../../constant/const";

// Profile editor. Sends only the fields a member is allowed to change.
const Modal = ({ user, onSaved, setIsModalOpen }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    contactNumber: user.contactNumber || "",
    address: { street: "", city: "", state: "", zipCode: "", ...(user.address || {}) },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setIsModalOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setIsModalOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAddressChange = (e) =>
    setFormData({ ...formData, address: { ...formData.address, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put(`${FRONTEND_URL}/api/member/me`, formData);
      onSaved(res.data.user);
      toast.success("Profile updated");
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      onMouseDown={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
    >
      <div className="rise max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-bone p-6 shadow-2xl sm:rounded-3xl sm:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-stone-500">Profile</p>
            <h2 id="profile-title" className="display mt-2 text-3xl">Update your <span className="accent text-ember-600">details</span></h2>
          </div>
          <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Close" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-2xl hover:bg-ink/5">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pf-fullName" className="field-label">Full name</label>
              <input id="pf-fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="field" required />
            </div>
            <div>
              <label htmlFor="pf-username" className="field-label">Username</label>
              <input id="pf-username" name="username" value={formData.username} onChange={handleChange} className="field" required />
            </div>
            <div>
              <label htmlFor="pf-contact" className="field-label">Contact number</label>
              <input id="pf-contact" name="contactNumber" inputMode="numeric" value={formData.contactNumber} onChange={handleChange} className="field" required />
            </div>
          </div>
          <fieldset className="border-t border-ink/10 pt-6">
            <legend className="eyebrow pr-3 text-stone-500">Address</legend>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              {[["street", "Street"], ["city", "City"], ["state", "State"], ["zipCode", "PIN code"]].map(([key, label]) => (
                <div key={key}>
                  <label htmlFor={`pf-${key}`} className="field-label">{label}</label>
                  <input id={`pf-${key}`} name={key} value={formData.address[key]} onChange={handleAddressChange} className="field" required />
                </div>
              ))}
            </div>
          </fieldset>

          {error && <p className="alert-error" role="alert">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline-dark">Cancel</button>
            <button type="submit" disabled={saving} className="btn-dark">{saving ? "Saving…" : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
