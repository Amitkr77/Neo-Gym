import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { MdCall } from "react-icons/md";
import { GrSupport } from "react-icons/gr";
import Navbar from "./Navbar";
import FRONTEND_URL from "../../constant/const";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null); // For handling submission errors

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Basic form validation
  const validate = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid";
    if (!formData.message) newErrors.message = "Message is required";

    // Phone number validation
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\+?\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Phone number is invalid";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitSuccess(null); // Reset success message
      setSubmitError(null); // Reset error message

      try {
        const response = await fetch(`${FRONTEND_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          setSubmitSuccess(true);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
          });
        } else {
          setSubmitError("Something went wrong, please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitError("Something went wrong, please try again.");
      }

      setIsSubmitting(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Navbar />
      <section
        className="relative pt-32 min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 lg:px-12 animate__animated animate__fadeIn"
        style={{
          backgroundImage: "url('./contactUs.jpg')", // Replace with your image path
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white p-8 rounded-xl shadow-lg max-w-lg w-full z-10"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Contact Us
          </h2>

          {/* Input fields */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="5"
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.message && (
            <p className="text-red-500 text-xs">{errors.message}</p>
          )}

          {/* Terms and conditions */}
          <p className="text-sm text-gray-600 mb-6">
            By submitting this form, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-500 hover:text-blue-600 transition duration-300"
            >
              terms and conditions
            </a>{" "}
            and our{" "}
            <a
              href="/privacy"
              className="text-blue-500 hover:text-blue-600 transition duration-300"
            >
              privacy policy
            </a>
            , which explains how we may collect, use, and disclose your personal
            information, including to third parties.
          </p>

          {/* Send message button */}
          <button
            type="submit"
            className={`w-full p-4 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            } text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {submitSuccess && (
            <p className="text-green-500 text-center mt-4 animate__animated animate__fadeIn">
              Message sent successfully!
            </p>
          )}
          {submitError && (
            <p className="text-red-500 text-center mt-4 animate__animated animate__fadeIn">
              {submitError}
            </p>
          )}
        </form>

        <div className="w-full flex flex-wrap justify-center gap-8 mt-12 animate__animated animate__fadeIn">
          {/* Email */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg p-6 rounded-lg w-72 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="mb-4">
              <MdEmail className="text-5xl text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Email
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Email us for general queries, including marketing and
                partnership opportunities.
              </p>
              <a
                href="mailto:amitroyk99@gmail.com"
                className="text-blue-500 text-lg font-semibold hover:text-blue-600 transition duration-300"
              >
                amitroyk99@gmail.com
              </a>
            </div>
          </div>

          {/* Call */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg p-6 rounded-lg w-72 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="mb-4">
              <MdCall className="text-5xl text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Call us to speak to a member of our team. We are always happy to
                help.
              </p>
              <a
                href="tel:7904357123"
                className="text-blue-500 text-lg font-semibold hover:text-blue-600 transition duration-300"
              >
                +91 7904 357 123
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center justify-center bg-white shadow-lg p-6 rounded-lg w-72 transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="mb-4">
              <GrSupport className="text-5xl text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Support
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Reach out to us for customer support or product-related
                questions.
              </p>
              <a
                href="mailto:support@example.com"
                className="text-blue-500 text-lg font-semibold hover:text-blue-600 transition duration-300"
              >
                support@example.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
