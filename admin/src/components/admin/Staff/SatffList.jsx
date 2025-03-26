import axios from "axios";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import FRONTEND_URL from "../../../../../frontend/src/constant/const";

Modal.setAppElement('#root'); // Required for accessibility - set root element for the modal

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStaffData, setEditStaffData] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get(`${FRONTEND_URL}/api/staff`);
        setStaff(data);
      } catch (error) {
        setError("Something went wrong while fetching staff data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleDelete = async (staffId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
      if (confirmDelete) {
        await axios.delete(`${FRONTEND_URL}/api/staff/${staffId}`);
        setStaff(staff.filter((member) => member._id !== staffId));
        alert("Staff member deleted successfully.");
      }
    } catch (error) {
      alert("Failed to delete staff member.");
    }
  };

  const handleEdit = (staffId) => {
    const staffToEdit = staff.find((member) => member._id === staffId);
    setEditStaffData(staffToEdit);
    setIsModalOpen(true);
    setFormError("");  // Reset form error message
    setSuccessMessage(""); // Reset success message
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!editStaffData.fullname || !editStaffData.username || !editStaffData.email || !editStaffData.gender) {
      setFormError("Please fill out all required fields.");
      return;
    }

    try {
      const { _id, ...updatedData } = editStaffData;
      await axios.put(`${FRONTEND_URL}/api/staff/${_id}`, updatedData);
      setStaff((prevStaff) =>
        prevStaff.map((member) =>
          member._id === _id ? { ...member, ...updatedData } : member
        )
      );
      setIsModalOpen(false);
      setSuccessMessage("Staff updated successfully.");
    } catch (error) {
      setFormError("Failed to update staff member. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Add Staff Button */}
      <div className="text-right mb-4">
        <Link to="/admin/StaffManagement/StaffAdd"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Add Staff Member
        </Link>
      </div>

      {/* Staff Table */}
      <div className="widget-box">
        <div className="widget-title flex items-center mb-4">
          <span className="text-blue-500 text-2xl mr-2">
          
          </span>
          <h5 className="text-xl font-bold">Staff Table</h5>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                {[
                  "#",
                  "Fullname",
                  "Username",
                  "Gender",
                  "Designation",
                  "Email",
                  "Address",
                  "Contact",
                  "Actions",
                ].map((header, index) => (
                  <th key={index} className="py-3 px-4 border-b">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {staff.map((member, index) => (
                <tr key={member._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="text-center py-3 px-4 border-b">{index + 1}</td>
                  <td className="text-center py-3 px-4 border-b">{member.fullname}</td>
                  <td className="text-center py-3 px-4 border-b">{member.username}</td>
                  <td className="text-center py-3 px-4 border-b">{member.gender}</td>
                  <td className="text-center py-3 px-4 border-b">{member.designation}</td>
                  <td className="text-center py-3 px-4 border-b">{member.email}</td>
                  <td className="text-center py-3 px-4 border-b">
                    {member.address
                      ? `${member.address.street}, ${member.address.city}, ${member.address.state} ${member.address.zipCode}`
                      : "N/A"}
                  </td>
                  <td className="text-center py-3 px-4 border-b">{member.contact}</td>
                  <td className="text-center py-3 px-4 border-b">
                    <button
                      onClick={() => handleEdit(member._id)}
                      className="text-green-500 hover:text-green-700 transition mr-2"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(member._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Edit Staff Member"
        className="modal max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Edit Staff Member</h2>

        {/* Form Errors */}
        {formError && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{formError}</div>}
        {successMessage && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fullname */}
          <div>
            <label className="block text-gray-700" htmlFor="fullname">
              Fullname
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={editStaffData?.fullname || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={editStaffData?.username || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={editStaffData?.email || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={editStaffData?.gender || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={editStaffData?.address || ""}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
          </div>

          {/* Submit and Cancel buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
