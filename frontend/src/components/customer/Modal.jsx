import React, { useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";

const Modal = ({ user, setIsModalOpen }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData, // Simplified using spread operator
      };
      const id = localStorage.getItem("userId");

      await axios.put(`${FRONTEND_URL}/api/member/users/${id}`, updatedData);
      alert("User details updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user data", error);
      alert("Failed to update user data");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 transform transition-all duration-500 ease-in-out">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Update User Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reuse form input styles from Customer component */}
          <div>
            <label htmlFor="fullName" className="block text-lg font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="w-full p-4 mt-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              className="w-full p-4 mt-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Address */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                id="street"
                name="street"
                value={formData.address?.street || ""}
                onChange={handleAddressChange}
                placeholder="Street"
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <input
                type="text"
                id="city"
                name="city"
                value={formData.address?.city || ""}
                onChange={handleAddressChange}
                placeholder="City"
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
