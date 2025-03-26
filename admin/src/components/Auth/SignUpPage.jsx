import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FRONTEND_URL from "../../constant/const";

const SignUpPage = () => {
  const [fullname, setfullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    const userDetails = {
      fullname,
      email,
      password,
    };

    try {
      const res = await axios.post(`${FRONTEND_URL}/api/admin/register`, userDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Registration successful!", {
        position: "top-center",
      });
      navigate("/"); // Redirect to login page
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error during registration. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
      });
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] flex justify-center items-center relative">
      <Link to="/" className="absolute top-4 left-4 text-white text-3xl font-bold hover:text-[#ff7e5f] transition">
        &times;
      </Link>

      <motion.div
        className="bg-white p-10 rounded-xl shadow-xl max-w-lg w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-extrabold text-[#1E3A8A] text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff7e5f]">
              <FiMail className="text-xl text-[#ff7e5f] mr-2" />
              <input
                type="text"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                placeholder="Enter your full name"
                className="w-full outline-none text-lg text-[#374151]"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff7e5f]">
              <FiMail className="text-xl text-[#ff7e5f] mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full outline-none text-lg text-[#374151]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff7e5f]">
              <FiLock className="text-xl text-[#ff7e5f] mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full outline-none text-lg text-[#374151]"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff7e5f]">
              <FiLock className="text-xl text-[#ff7e5f] mr-2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full outline-none text-lg text-[#374151]"
                required
              />
            </div>
          </div>

          {/* Display Error Message */}
          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 mt-6 bg-[#ff7e5f] text-white text-xl font-semibold rounded-full transition duration-300 hover:bg-[#ff5a4e] transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Submitting..." : <><FaUserPlus className="inline mr-2" />Sign Up</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
