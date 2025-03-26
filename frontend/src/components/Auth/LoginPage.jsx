import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiUser } from "react-icons/fi";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Importing toast
import FRONTEND_URL from "../../constant/const";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`${FRONTEND_URL}/api/auth/login`, formData);

      if (res.status === 200 && res.data.token) {
        const { token, userId } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        
        // Notify on successful login
        toast.success("Login successful!");

        // Redirect to the customer page
        navigate("/customer");
      } else {
        // Display the error message from the API
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      // Handle errors with the API call
      toast.error(error.response?.data?.message || "An error occurred during login");
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
        <h2 className="text-3xl font-extrabold text-[#1E3A8A] text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff7e5f]">
              <FiUser className="text-xl text-[#ff7e5f] mr-2" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full outline-none text-lg text-[#374151]"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium text-[#1E3A8A] mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff7e5f]">
              <FiLock className="text-xl text-[#ff7e5f] mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none text-lg text-[#374151]"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 mt-6 bg-[#ff7e5f] text-white text-xl font-semibold rounded-full transition duration-300 hover:bg-[#ff5a4e] transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading} // Disable the button when loading
          >
            {loading ? <span>Loading...</span> : <><FaSignInAlt className="inline mr-2" />Login</>}
          </motion.button>
          <Link >
          forget password
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
