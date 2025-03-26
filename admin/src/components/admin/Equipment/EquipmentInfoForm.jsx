import React, { useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../../constant/const";

export function EquipmentInfoForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purchasedDate: "", // Change 'date' to 'purchasedDate'
    qty: "", // Change 'quantity' to 'qty'
    vendor: "",
    address: "",
    contact: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${FRONTEND_URL}/api/equipment`,
        formData
      );
      setSuccess("Equipment successfully added!");
      setFormData({
        name: "",
        description: "",
        purchasedDate: "", // Reset 'purchasedDate'
        qty: "", // Reset 'qty'
        vendor: "",
        address: "",
        contact: "",
        amount: "",
      });
    } catch (err) {
      setError("Error adding equipment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Equipment Info Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h5 className="text-xl font-semibold mb-6">Add New Equipment</h5>

        {/* Display Success or Error Messages */}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment Info Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Equipment Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Enter equipment name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description:
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Enter a short description"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Date of Purchase:
              </label>
              <input
                type="date"
                name="purchasedDate" // Change 'date' to 'purchasedDate'
                value={formData.purchasedDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
              />
              <span className="text-xs text-gray-500">
                Please mention the date of purchase
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Quantity:
              </label>
              <input
                type="number"
                name="qty" // Change 'quantity' to 'qty'
                value={formData.qty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Enter equipment quantity"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor and Pricing Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Vendor:</label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Enter vendor name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Enter vendor address"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Contact Number:
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="(999) 999-9999"
                minLength="10"
                maxLength="10"
                required
              />
              <span className="text-xs text-gray-500">(999) 999-9999</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Cost Per Item:
              </label>
              <div className="flex items-center">
                <span className="text-sm font-medium">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 ml-2"
                  placeholder="Enter cost per item"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
