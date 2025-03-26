import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Reminder from "./Reminder";
import Reports from "./Reports";
import Todo from "./Todo";
import Annoucements from "./Annoucements";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import FRONTEND_URL from "../../constant/const";

export default function Customer() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    confirm("are you sure");

    // Redirect user to the login page or home page
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const id = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `${FRONTEND_URL}/api/member/users/${id}`
        );
        setUser(response.data);
        console.log(user);
        
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex bg-gray-100 p-6">
      <aside className="w-64 h-full bg-gray-800 text-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <nav>
          <ul>
            <Link to="/Customer/dashboard">
              <li className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                DashBoard
              </li>
            </Link>
            <Link to="/Customer/Todo">
              <li className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                To-Do
              </li>
            </Link>
            <Link to="/Customer/Reminder">
              <li className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Reminder
              </li>
            </Link>
            <Link to="/Customer/Annoucements">
              <li className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Annoucements
              </li>
            </Link>
            {/* <Link to="/Customer/Reports">
              <li className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200">
                Reports
              </li>
            </Link> */}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 h-full flex flex-col overflow-y-auto bg-gray-100 shadow-inner space-y-2">
        <div className="space-x-2 border p-2 flex ">
          <button
            onClick={() => setIsModalOpen(true)}
            className="border px-2 py-1 bg-slate-900 text-white rounded-md flex items-center gap-1"
          >
            welcome {user ? user.fullName : "User"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 border px-2 py-1 text-white rounded-md flex items-center gap-1"
          >
            Logout
          </button>
          {/* Show the modal if it's open */}
          {isModalOpen && <Modal user={user} setIsModalOpen={setIsModalOpen} />}
        </div>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Reminder" element={<Reminder />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/Todo" element={<Todo />} />
          <Route path="/Annoucements" element={<Annoucements />} />
          {/* Default route */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
