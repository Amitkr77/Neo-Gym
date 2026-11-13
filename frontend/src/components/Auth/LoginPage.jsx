import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FRONTEND_URL from "../../constant/const";
import { saveSession } from "../../lib/session";
import AuthLayout from "./AuthLayout";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const expired = new URLSearchParams(location.search).get("expired");

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${FRONTEND_URL}/api/auth/login`, formData);
      if (res.status === 200 && res.data.token) {
        saveSession(res.data.token);
        toast.success("Welcome back!");
        navigate(location.state?.from || "/Customer/dashboard", { replace: true });
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.status === 429
          ? err.response.data.message
          : err.response?.data?.message === "Invalid credentials"
            ? "That username and password don't match. Please try again."
            : err.response?.data?.message || "We couldn't reach the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Members" title="Member" accent="login" aside="Track your membership, payments and training plan in one place.">
      {expired && <p className="alert-info mb-6">Your session has ended. Please log in again.</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="field-label">Username</label>
          <input id="username" type="text" name="username" value={formData.username} onChange={handleChange}
            placeholder="Enter your username" autoComplete="username" className="field" required />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="field-label">Password</label>
            <Link to="/ForgotPassword" className="link-underline tap-inline text-sm text-stone-600 hover:text-ink">Forgot password?</Link>
          </div>
          <input id="password" type="password" name="password" value={formData.password} onChange={handleChange}
            placeholder="Enter your password" autoComplete="current-password" className="field" required />
        </div>

        {error && <p className="alert-error" role="alert">{error}</p>}

        <button type="submit" className="btn-dark w-full py-4" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-stone-600">
        New here?{" "}
        <Link to="/Signup" className="link-underline tap-inline font-semibold text-ink">Create an account</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
