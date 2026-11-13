import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

// Member accounts have no email address and no mail service is configured, so
// self-service reset is not possible yet (see IMPLEMENTATION_ROADMAP). Staff can
// reset a member's password from the admin panel.
const ForgotPassword = () => (
  <AuthLayout eyebrow="Account help" title="Forgot your" accent="password?">
    <p className="lead text-stone-600">
      Please ask the front desk, or send us a message, and our team will reset your password after
      confirming your identity.
    </p>
    <Link to="/contactUs" className="btn-dark mt-10 w-full py-4">Contact the gym</Link>
    <p className="mt-8 text-center text-sm text-stone-600">
      Remembered it?{" "}
      <Link to="/login" className="link-underline tap-inline font-semibold text-ink">Back to login</Link>
    </p>
  </AuthLayout>
);

export default ForgotPassword;
