import React, { useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../constant/const";

export default function Todo() {
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [statusMessage, setStatusMessage] = useState("");

  const handleTaskDescChange = (e) => {
    setTaskDesc(e.target.value);
  };

  const handleTaskStatusChange = (e) => {
    setTaskStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    if (!taskDesc || !taskStatus) {
      setStatusMessage("Please fill in all fields.");
      return;
    }

    // Data to send to the server
    const taskData = { taskDesc, taskStatus };

    // Send the data using Axios
    axios
      .post(`${FRONTEND_URL}/api/task`, taskData)
      .then((response) => {
        // Handle success response
        console.log("Task added:", response.data);
        setStatusMessage("Task added successfully!");
        setTaskDesc("");
        setTaskStatus("In Progress");
      })
      .catch((error) => {
        // Handle error
        console.error("Error adding task:", error);
        setStatusMessage("Error adding task. Please try again.");
      });
  };

  return (
    <div className="border p-6 w-full  mx-auto rounded-lg shadow-lg bg-white">
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-blue-500 text-2xl">
          <i className="fas fa-check-circle"></i>{" "}
          {/* Add any icon if you prefer */}
        </span>
        <h5 className="text-xl font-semibold text-gray-800">To-Do Lists</h5>
      </div>
      <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please Enter Your Task:
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              name="task_desc"
              placeholder="I'll be doing 12 set up and . . ."
              value={taskDesc}
              onChange={handleTaskDescChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please Select a Status:
            </label>
            <select
              name="task_status"
              value={taskStatus}
              onChange={handleTaskStatusChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className=" px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Add To List
            </button>
          </div>

          {statusMessage && (
            <div id="status" className="text-sm text-green-500">
              {statusMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
