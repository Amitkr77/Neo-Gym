import React, { useEffect, useState } from "react";
import { TfiAnnouncement } from "react-icons/tfi";
import { Link } from "react-router-dom";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";

export default function Dashboard() {
  const [announcement, setAnnouncements] = useState("");
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [statusMessage, setStatusMessage] = useState(""); // To show status messages

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/announcement`);
        setAnnouncements(res.data.data);
      } catch (error) {
        console.log(error.message || "An error occurred while fetching data.");
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${FRONTEND_URL}/api/task`); // Replace with your backend API URL
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setStatusMessage("Failed to load tasks.");
      }
    };

    fetchTasks();
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object

    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY (or change locale to suit)
  };
  

  // Handle task removal
  const handleRemoveTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `${FRONTEND_URL}/api/task/${taskId}`
      ); // Replace with your delete endpoint
      setTasks(tasks.filter((task) => task._id !== taskId)); // Remove task from state
      setStatusMessage("Task removed successfully!");
    } catch (error) {
      console.error("Error removing task:", error);
      setStatusMessage("Failed to remove task.");
    }
  };

  // Handle task update (You can adjust this based on your update API)
  const handleUpdateTask = (taskId) => {
    // Redirect or handle updating logic (can use a modal or form for editing)
    console.log("Updating task with ID:", taskId);
  };

  return (
    <div className="flex ">
      <section className="w-full p-2 border-t">
        <div className="mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-blue-500 text-2xl">
              <i className="fas fa-clock"></i> {/* Icon for To-Do List */}
            </span>
            <h5 className="text-xl font-semibold text-gray-800">
              My To-Do List
            </h5>
          </div>

          <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Opts
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 flex items-center space-x-2 text-sm text-gray-700">
                        <a
                          href="#!"
                          onClick={() => handleUpdateTask(task._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <i className="fas fa-plus-circle"></i>
                        </a>
                        <span>{task.taskDesc}</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            task.taskStatus === "In Progress"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {task.taskStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm space-x-3">
                        <a
                          href="#!"
                          className="text-yellow-500 hover:text-yellow-700"
                          onClick={() => handleUpdateTask(task._id)}
                          title="Update"
                        >
                          <i className="fas fa-edit"></i>
                        </a>
                        <a
                          href="#!"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleRemoveTask(task._id)}
                          title="Mark as Done"
                        >
                          <input type="checkbox" name="" id="" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No tasks available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {statusMessage && (
            <div
              id="status"
              className="mt-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg"
            >
              {statusMessage}
            </div>
          )}
        </div>
      </section>
      <section className="w-full p-2 border-t">
        <div className="w-full sm:w-3/4  mx-auto ">
          <div className="flex items-center gap-2 border-b pb-2 mb-4">
            <TfiAnnouncement className="text-blue-400 text-xl" />
            <h1 className="text-lg font-semibold text-gray-800">
              Gym Announcements
            </h1>
          </div>

          <div className="overflow-y-auto bg-gray-800 rounded-lg shadow-sm p-3 space-y-3">
            {announcement.length === 0 ? (
              <div className="text-center py-3 text-gray-400 text-sm">
                No announcements found.
              </div>
            ) : (
              announcement.map((announcement, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-md bg-[#2d2f39] hover:bg-[#3e434d] transition-all duration-200"
                >
                  <div className="flex gap-2 items-center">
                    {/* Icon */}
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                    </div>
                    {/* Announcement details */}
                    <div>
                      <p className="text-xs text-blue-400">
                        {formatDate(announcement.appliedDate)}
                      </p>
                      <p className="text-sm text-white">
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            to="#"
            className="block text-center mt-4 px-4 py-2 rounded-full border bg-lime-500 text-white text-sm hover:bg-lime-600 transition-all duration-200"
          >
            View All
          </Link>
        </div>
      </section>
    </div>
  );
}
