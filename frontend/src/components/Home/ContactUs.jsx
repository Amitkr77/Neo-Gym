import { useState } from "react";
import { MdEmail, MdCall } from "react-icons/md";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FRONTEND_URL from "../../constant/const";

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", message: "" };

export default function ContactUs() {
  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email address is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    // Phone is optional, but must be valid if given.
    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = "Phone number is invalid";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      const response = await fetch(`${FRONTEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData(EMPTY);
      } else {
        setSubmitError(result.message || "Something went wrong, please try again.");
      }
    } catch {
      setSubmitError("We couldn't reach the server. Please check your connection and try again.");
    }
    setIsSubmitting(false);
  };

  const field = (name, label, props = {}) => (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      <input
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className="field"
        {...props}
      />
      {errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="bg-bone">
        <section className="bg-ink pb-20 pt-40 text-white">
          <div className="container-x">
            <p className="eyebrow rise mb-6 flex items-center gap-3 text-stone-400">
              <span className="h-px w-8 bg-ember" aria-hidden="true" /> Contact
            </p>
            <h1 className="display rise text-5xl sm:text-7xl" style={{ "--rise-delay": "80ms" }}>
              Contact Us. <span className="accent text-ember">Let&apos;s talk.</span>
            </h1>
            <p className="rise mt-8 max-w-xl text-lg text-white/70" style={{ "--rise-delay": "160ms" }}>
              Questions about membership, plans or a trial visit? Send us a message and our team will get back to you.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-14">
            <aside className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:block lg:space-y-10">
              <div>
                <p className="eyebrow text-stone-500">Email</p>
                <a href="mailto:amitroyk99@gmail.com" className="link-underline tap mt-1 gap-3 break-all text-lg font-medium">
                  <MdEmail aria-hidden="true" className="text-ember-600" /> amitroyk99@gmail.com
                </a>
                <p className="mt-2 text-sm text-stone-500">General questions, memberships and partnerships.</p>
              </div>
              <div className="sm:border-t-0 sm:pt-0 lg:border-t lg:border-ink/10 lg:pt-10 rule pt-10">
                <p className="eyebrow text-stone-500">Call</p>
                <a href="tel:+917904357123" className="link-underline tap mt-1 gap-3 text-lg font-medium">
                  <MdCall aria-hidden="true" className="text-ember-600" /> +91 7904 357 123
                </a>
                <p className="mt-2 text-sm text-stone-500">Speak to a member of our team.</p>
              </div>
            </aside>

            <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-10 lg:col-span-8">
              <h2 className="display-sm text-2xl">Send a message</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {field("firstName", "First name", { placeholder: "First Name", autoComplete: "given-name" })}
                {field("lastName", "Last name", { placeholder: "Last Name", autoComplete: "family-name" })}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {field("email", "Email", { type: "email", placeholder: "Your Email", autoComplete: "email" })}
                {field("phone", "Phone (optional)", { type: "tel", placeholder: "Phone Number (optional)", autoComplete: "tel" })}
              </div>
              <div>
                <label htmlFor="message" className="field-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={5}
                  aria-invalid={Boolean(errors.message)}
                  className="field resize-y"
                />
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>

              <p className="text-sm text-stone-500">We use your details only to respond to your enquiry.</p>

              {submitSuccess && <p className="alert-success" role="status">Message sent successfully! We&apos;ll be in touch soon.</p>}
              {submitError && <p className="alert-error" role="alert">{submitError}</p>}

              <button type="submit" className="btn-dark w-full py-4 sm:w-auto sm:px-10" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
