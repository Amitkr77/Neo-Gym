import { useEffect, useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";

export default function Reminder() {
  const [reminder, setReminder] = useState(null); // State to hold the reminder status
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading status
  const userId = "672cec3c41b32cfad25fbeb6"; // The user ID for fetching data

  // API function to fetch reminder status
  const fetchReminder = async () => {
    try {
      const response = await axios.get(`${FRONTEND_URL}/api/member/users/${userId}`);
      setReminder(response.data.reminder);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reminder data.");
    } finally {
      setLoading(false);
    }
  };

  // API function to dismiss the reminder
  const dismissReminder = async () => {
    try {
      const response = await axios.put(`${FRONTEND_URL}/api/member/users/${userId}/reminder`, {
        reminder: false,
      });
      setReminder(response.data.reminder); // Update the reminder state
    } catch (err) {
      setError(err.response?.data?.message || "Failed to dismiss the reminder.");
    }
  };

  useEffect(() => {
    fetchReminder();
  }, []); // Run once on component mount

  // Conditional rendering
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="w-full p-6 mx-auto mt-4">
      {reminder === true ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <h4 className="font-semibold text-lg">ALERT</h4>
          <p>
            Your current membership program is expiring soon. Please clear your payments before the due date to avoid service disruptions.
            <br />
            IT IS IMPORTANT THAT YOU CLEAR YOUR DUES ON TIME.
          </p>
          <hr className="my-2 border-t-2 border-red-300" />
          <p className="text-sm">
            We value you as our customer and look forward to serving you in the future.
          </p>
          {/* Dismiss Button */}
          <button
            onClick={dismissReminder}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Dismiss Alert
          </button>
        </div>
      ) : (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
          <h4 className="font-semibold text-lg">NO REMINDERS YET!</h4>
        </div>
      )}
    </div>
  );
}
