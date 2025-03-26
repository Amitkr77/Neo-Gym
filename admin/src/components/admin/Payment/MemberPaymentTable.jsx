import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FRONTEND_URL from "../../../../../frontend/src/constant/const";

const MemberPaymentTable = () => {
  // State variables
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState({}); // Track reminder status for each member

  // Fetch payment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/payment/`);
        setPaymentData(res.data.payments || []); // Assuming the API sends an object with payments
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setError("Failed to load payment data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object
    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY (or change locale to suit)
  };

  // Toggle reminder status for a specific member
  const toggleReminder = async (memberId, value) => {
    try {
      // Send the update request to the backend API
      const response = await axios.put(`${FRONTEND_URL}/api/member/users/${memberId}/reminder`, {
        reminder: value,
      });
      setReminders((prevReminders) => ({
        ...prevReminders,
        [memberId]: response.data.reminder, // Update reminder status for the specific member
      }));
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  // Handle search logic (optional)
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.target.search.value;
    // Add search functionality as needed
    console.log("Search query:", searchQuery);
  };

  if (loading) {
    return <div>Loading...</div>; // You can use a spinner or a loading animation instead.
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold text-gray-800">Member's Payment Table</h5>
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            name="search"
            required
            placeholder="Search"
            className="border border-gray-300 rounded-lg px-4 py-2 mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Member</th>
              <th className="py-2 px-4 border-b">Last Payment Date</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Chosen Service</th>
              <th className="py-2 px-4 border-b">Plan</th>
              <th className="py-2 px-4 border-b">Action</th>
              <th className="py-2 px-4 border-b">Remind</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.length > 0 ? (
              paymentData.map((payment, index) => (
                <tr key={payment._id} className="hover:bg-gray-50 capitalize">
                  <td className="text-center py-2 px-4 border-b">{index + 1}</td>
                  <td className="text-center py-2 px-4 border-b">{payment.member.fullName}</td>
                  <td className="text-center py-2 px-4 border-b">{formatDate(payment.paymentDate)}</td>
                  <td className="text-center py-2 px-4 border-b">{payment.amountPaid}</td>
                  <td className="text-center py-2 px-4 border-b">{payment.chosenService}</td>
                  <td className="text-center py-2 px-4 border-b">{payment.plan}</td>
                  <td className="text-center py-2 px-4 border-b">
                    <Link to="/admin/payment/PaymentForm" state={{ data: payment }}>
                      <button className="px-3 py-1 rounded-md hover:bg-green-600 bg-green-500 text-white">
                        Make Payment
                      </button>
                    </Link>
                  </td>
                  <td className="text-center py-2 px-4 border-b">
                    <button
                      className={`px-3 py-1 rounded-md ${reminders[payment.member._id] ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                      onClick={() => toggleReminder(payment.member._id, !reminders[payment.member._id])}
                    >
                      {reminders[payment.member._id] ? 'Cancel Alert' : 'Set Alert'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 px-4 border-b">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberPaymentTable;
