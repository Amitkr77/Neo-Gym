import React, { useEffect, useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../../../../frontend/src/constant/const";

export function EquipmentManagement() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  // Fetch equipment data from API on component mount
  useEffect(() => {
    const fetchEquipmentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/equipment`);
        if (res.data.data && Array.isArray(res.data.data)) {
          setEquipmentData(res.data.data); // Set equipment data
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError("Failed to fetch equipment data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object
    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY (or change locale to suit)
  };

  // Handle equipment deletion
  const handleDelete = async (_id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this equipment?"
      );
      if (confirmDelete) {
        await axios.delete(`${FRONTEND_URL}/api/equipment/${_id}`);
        // Remove deleted equipment from state
        setEquipmentData((prevData) =>
          prevData.filter((item) => item._id !== _id)
        );
      }
    } catch (err) {
      console.error("Error deleting equipment:", err);
      setError("Failed to delete equipment");
    }
  };

  // Handle equipment update (open modal with existing data)
  const handleUpdate = (equipment) => {
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  // Submit the updated equipment data
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    if (editingEquipment) {
      try {
        // Send updated data to the API
        await axios.put(
          `${FRONTEND_URL}/api/equipment/${editingEquipment._id}`,
          editingEquipment
        );

        // Refresh equipment data after updating
        const res = await axios.get(`${FRONTEND_URL}/api/equipment`);
        setEquipmentData(res.data.data);

        // Close the modal after successful update
        setIsModalOpen(false);
        setEditingEquipment(null);
      } catch (err) {
        console.error("Error updating equipment:", err);
        setError("Failed to update equipment");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEquipment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="flex items-center  p-4 rounded-t-lg ">
          <h5 className="text-xl font-semibold my-4">Equipment Management</h5>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="min-w-full table-auto ">
            <thead>
              <tr className="border-y text-sm ">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Equipment</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Purchased Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipmentData.map((equipment, index) => (
                <tr key={equipment._id} className="hover:bg-gray-50 transition-all">
                  <td className="p-3 text-center">{index + 1}</td>
                  <td className="p-3">{equipment.name}</td>
                  <td className="p-3">{equipment.description}</td>
                  <td className="p-3 text-center">{equipment.qty}</td>
                  <td className="p-3 text-center">{equipment.amount}</td>
                  <td className="p-3">{equipment.vendor}</td>
                  <td className="p-3">{equipment.contact}</td>
                  <td className="p-3 text-center">{formatDate(equipment.purchasedDate)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleUpdate(equipment)}
                      className="text-blue-600 hover:text-blue-800 mr-4 transition-colors"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(equipment._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
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

      {/* Modal for updating equipment */}
      {isModalOpen && editingEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Edit Equipment</h3>
            <form onSubmit={handleSubmitUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Equipment Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingEquipment.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editingEquipment.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  value={editingEquipment.qty}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input
                  type="text"
                  name="amount"
                  value={editingEquipment.amount}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
