import React, { useEffect, useState } from "react"; // Import React
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import axios from "axios";
import { Link } from "react-router-dom";
import FRONTEND_URL from "../../../constant/const";

// Sample data for the equipment table
const EQUIPMENT_TABLE_HEAD = [
  "#",
  "E. Name",
  "Description",
  "Qty",
  "Amount",
  "Vendor",
  "Address",
  "Contact",
  "Purchased Date",
];

export function EquipmentList() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Declare fetchData inside useEffect
    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const res = await axios.get(`${FRONTEND_URL}/api/equipment`);
        if (res.data.data && Array.isArray(res.data.data)) {
          setEquipmentData(res.data.data); // Set data on success
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch data"); // Set error state
      } finally {
        setLoading(false); // Always stop loading, whether successful or not
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array to call only once on mount

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object

    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY (or change locale to suit)
  };

  // Conditional rendering based on loading and error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Check if equipmentData is empty and show message if so
  if (equipmentData.length === 0) return <div>No equipment available</div>;

  return (
    <Card className=" w-full p-6">
      <CardHeader floated={false} shadow={false} className="rounded-none">
      <div className="text-right mb-4 space-x-2">
        <Link to="/admin/equipment/EquipmentInfoForm"
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Add Equipment
        </Link>
        <Link to="/admin/equipment/EquipmentManagement"
          className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Manage Equipment
        </Link>
      </div>
        <Typography variant="h5" color="blue-gray">
          Equipment Table
        </Typography>
      </CardHeader>
      <CardBody className="px-0">
        <table className="table table-bordered table-hover w-full">
          <thead>
            <tr>
              {EQUIPMENT_TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipmentData.map((item, index) => (
              <tr key={item._id || index}>
                <td className="text-center p-4">{index + 1}</td>
                <td className="text-center p-4">{item.name}</td>
                <td className="text-center p-4">{item.description}</td>
                <td className="text-center p-4">{item.qty}</td>
                <td className="text-center p-4">{item.amount || "$0.00"}</td>
                <td className="text-center p-4">{item.vendor}</td>
                <td className="text-center p-4">{item.address}</td>
                <td className="text-center p-4">{item.contact}</td>
                <td className="text-center p-4">{formatDate(item.purchasedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
