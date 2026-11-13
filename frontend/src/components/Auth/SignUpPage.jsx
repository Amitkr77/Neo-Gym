import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FRONTEND_URL from "../../constant/const";
import AuthLayout from "./AuthLayout";

const STEPS = ["Your details", "Your address"];

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zipCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Validate step 1 before moving on (its inputs are unmounted on step 2, so the
  // browser cannot validate them at submit time).
  const handleNextStep = () => {
    const problem = !fullName.trim() || !username.trim()
      ? "Please enter your full name and a username."
      : password.length < 6
        ? "Password must be at least 6 characters long."
        : !/^\d{10}$/.test(contactNumber)
          ? "Contact number must be exactly 10 digits."
          : null;
    setError(problem);
    if (!problem) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${FRONTEND_URL}/api/auth/signup`, { username, password, fullName, contactNumber, gender, address });
      toast.success("Account created! Log in, then visit the front desk to choose your plan.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setAddr = (key) => (e) => setAddress({ ...address, [key]: e.target.value });

  return (
    <AuthLayout
      eyebrow="Join NeoGym"
      title="Create your"
      accent="account"
      aside="Sign up online, then choose your plan with our team at the front desk."
    >
      {/* Step indicator */}
      <ol className="mb-8 grid grid-cols-2 gap-3" aria-label={`Step ${step} of 2`}>
        {STEPS.map((label, i) => (
          <li key={label}>
            <span className={`block h-1 rounded-full transition-colors duration-500 ${step > i ? "bg-ember" : "bg-ink/10"}`} />
            <span className={`mt-2 block text-xs font-medium ${step === i + 1 ? "text-ink" : "text-stone-500"}`}>
              {i + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">Step {step} of 2</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <>
            <div>
              <label htmlFor="fullName" className="field-label">Full name</label>
              <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name" autoComplete="name" className="field" required />
            </div>
            <div>
              <label htmlFor="username" className="field-label">Username</label>
              <input id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username" autoComplete="username" className="field" required />
            </div>
            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters" autoComplete="new-password" className="field" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contactNumber" className="field-label">Mobile number</label>
                <input id="contactNumber" type="tel" inputMode="numeric" maxLength={10} value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)} placeholder="10-digit mobile number"
                  autoComplete="tel-national" className="field" required />
              </div>
              <div>
                <label htmlFor="gender" className="field-label">Gender</label>
                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {error && <p className="alert-error" role="alert">{error}</p>}
            <button type="button" className="btn-dark w-full py-4" onClick={handleNextStep}>
              Next Step <span aria-hidden="true">→</span>
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label htmlFor="street" className="field-label">Street</label>
              <input id="street" value={address.street} onChange={setAddr("street")}
                placeholder="Enter your street address" autoComplete="street-address" className="field" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="field-label">City</label>
                <input id="city" value={address.city} onChange={setAddr("city")}
                  placeholder="Enter your city" autoComplete="address-level2" className="field" required />
              </div>
              <div>
                <label htmlFor="state" className="field-label">State</label>
                <input id="state" value={address.state} onChange={setAddr("state")}
                  placeholder="Enter your state" autoComplete="address-level1" className="field" required />
              </div>
            </div>
            <div>
              <label htmlFor="zipCode" className="field-label">PIN code</label>
              <input id="zipCode" inputMode="numeric" value={address.zipCode} onChange={setAddr("zipCode")}
                placeholder="6-digit PIN code" autoComplete="postal-code" className="field" required />
            </div>
            {error && <p className="alert-error" role="alert">{error}</p>}
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <button type="button" className="btn-outline-dark py-4" onClick={() => { setError(null); setStep(1); }}>
                Back
              </button>
              <button type="submit" className="btn-dark py-4" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-stone-600">
        Already a member?{" "}
        <Link to="/login" className="link-underline tap-inline px-1 font-semibold text-ink">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
