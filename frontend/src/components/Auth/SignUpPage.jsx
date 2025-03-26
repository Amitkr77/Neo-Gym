import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FRONTEND_URL from "../../constant/const";


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

  // Step change handlers
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const memberDetails = {
      username,
      password,
      fullName,
      contactNumber,
      gender,
      address,
      dateOfRegistration: new Date(), // Automatically set date of registration
      status: "Active", // Default to 'Active'
    };
    console.log(memberDetails)

    try {
      const res = await axios.post(`${FRONTEND_URL}/api/auth/signup`, memberDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Registration successful!", {
         position: "top-center",
      });
      navigate("/login"); // Redirect to login page
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error during registration. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage,{
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
        <h2 className="text-3xl font-extrabold text-[#1E3A8A] text-center mb-6">Sign Up as Customer</h2>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <motion.button
                type="button"
                className="w-full py-3 mt-6 bg-[#ff7e5f] text-white text-xl font-semibold rounded-full transition duration-300 hover:bg-[#ff5a4e]"
                onClick={handleNextStep}
              >
                Next Step
              </motion.button>
            </>
          )}

          {/* Step 2: Address Info */}
          {step === 2 && (
            <>
              <div className="mb-6">
                <h1 className="font-bold mb-2 text-lg">Address</h1>
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Street </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Enter your street address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Enter your city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Enter your state"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Zip Code</label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  placeholder="Enter your zip code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <motion.button
                type="button"
                className="w-full py-3 mt-6 bg-[#ff7e5f] text-white text-xl font-semibold rounded-full transition duration-300 hover:bg-[#ff5a4e]"
                onClick={handlePreviousStep}
              >
                Back
              </motion.button>
              <motion.button
                type="submit"
                className="w-full py-3 mt-6 bg-[#ff7e5f] text-white text-xl font-semibold rounded-full transition duration-300 hover:bg-[#ff5a4e]"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </motion.button>
            </>
          )}

          {/* Display Error Message */}
          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        </form>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
