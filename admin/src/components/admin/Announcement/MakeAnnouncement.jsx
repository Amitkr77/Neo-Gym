import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FRONTEND_URL from "../../../constant/const";

const MakeAnnouncement = () => {
  // Step 1: Set up state to manage form data
  const [message, setMessage] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Step 2: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    // Prepare the data to send
    const data = {
      message,
      appliedDate: appliedDate, // Make sure the backend expects the correct format
    };

    try {
      // Step 3: Send POST request using Axios
      const response = await axios.post(
        `${FRONTEND_URL}/api/announcement`,
        data
      );

      // Handle successful submission
      setSuccessMessage("Announcement published successfully!");
      setMessage(""); // Reset form
      setAppliedDate(""); // Reset form
    } catch (err) {
      // Handle errors
      setError("There was an error while submitting your announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-2">
        <Link
          to="/admin/annoucement/ManageAnnouncement"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Manage your announcement
        </Link>
      </div>

      <div className="w-full bg-white rounded-lg shadow-lg p-8 m-2">
        <div className="flex items-center mb-6">
          <span className="text-blue-500 text-2xl mr-2">
            <i className="fas fa-bullhorn"></i>
          </span>
          <h5 className="text-xl font-semibold">Make Announcements</h5>
        </div>

        {/* Step 4: Show success/error messages */}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              className="w-full h-24 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="message"
              rows="6"
              placeholder="Enter your announcement here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Capture the message
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Applied Date:
              <input
                type="date"
                name="date"
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)} // Capture the applied date
              />
            </label>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Publishing..." : "Publish Now"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MakeAnnouncement;
