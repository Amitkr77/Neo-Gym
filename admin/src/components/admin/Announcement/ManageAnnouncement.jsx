import axios from "axios";
import React, { useEffect, useState } from "react";
import FRONTEND_URL from "../../../constant/const";

const API_URL = `${FRONTEND_URL}/api/announcement`;

export default function ManageAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch announcements from the backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(API_URL);
        setAnnouncements(res.data.data); // Assuming response structure is { data: [...announcements] }
        setLoading(false);
      } catch (error) {
        setError("Failed to load announcements.");
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object

    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY (or change locale to suit)
  };

  // Handle delete request
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${FRONTEND_URL}/api/announcement/${_id}`);
      // Directly update state to avoid stale closures
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.filter((announcement) => announcement._id !== _id)
      );
    } catch (error) {
      setError("Failed to delete the announcement.");
      console.error("Error deleting announcement:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <div className="flex items-center mb-4">
        <span className="text-blue-500 text-3xl mr-2">
          <i className="fas fa-bullhorn"></i>
        </span>
        <h5 className="text-2xl font-bold">Announcement Table</h5>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Manage</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-3 px-4">
                  No announcements found
                </td>
              </tr>
            ) : (
              announcements.map((announcement, index) => (
                <tr key={announcement.id || index} className="border-b hover:bg-gray-50">
                  <td className="text-center py-3 px-4">{index + 1}</td>
                  <td className="text-center py-3 px-4">{formatDate(announcement.appliedDate)}</td>
                  <td className="py-3 px-4">{announcement.message}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
