import React, { useState } from "react";
import PieChart from "./Dashboard/PieChart";
import Expense from "./Dashboard/Expense";
import ChartConfig from "./Dashboard/ChartConfig";
import { FiUserCheck } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { MdCurrencyRupee } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import FRONTEND_URL from "../../../../frontend/src/constant/const";
function DashBorad() {
  const [member, setMember] = useState("");
  const [announcement, setAnnouncements] = useState("");
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [statusMessage, setStatusMessage] = useState(""); // To show status messages
  const [reqInfo, setReqInfo] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${FRONTEND_URL}/api/member/users`);
        setMember(response.data.length);
      } catch (error) {
        console.log(error.message || "An error occurred while fetching data.");
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/announcements`);
        setAnnouncements(res.data.data);
      } catch (error) {
        console.log(error.message || "An error occurred while fetching data.");
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${FRONTEND_URL}/api/task`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setStatusMessage("Failed to load tasks.");
      }
    };

    const fetchContactForms = async () => {
      try {
        const response = await fetch(`${FRONTEND_URL}/api/contact`);

        if (response.ok) {
          const result = await response.json();
          console.log(result.data); // Result contains the list of submissions
          // You can then set the fetched data into your state to display it
          setReqInfo(result.data);
        } else {
          console.error("Failed to fetch contact forms:", result.message);
        }
      } catch (error) {
        console.error("Error fetching contact forms:", error);
      }
    };

    fetchContactForms();
    fetchTasks();
    fetchAnnouncements();
    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object

    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY (or change locale to suit)
  };

  // Handle task removal
  const handleRemoveTask = async (taskId) => {
    try {
      const response = await axios.delete(`${FRONTEND_URL}/api/task/${taskId}`); // Replace with your delete endpoint
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
    <>
      {/* first section starts here */}
      <div className="p-6 flex gap-10 ">
        <div className="cursor-pointer group relative w-64 h-28 border rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-slate-700 hover:text-white">
          <div>
            <FiUserCheck className="h-10 w-10" />
          </div>
          <h1 className="">Active Members</h1>
          <div className="group-hover:scale-150 transition-all ease-in-out group-hover:duration-1000 duration-1000 absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2 z-10">
            5
          </div>
        </div>

        <Link to="/admin/member/RegisteredMembers">
          <div className="cursor-pointer group relative w-64 h-28 border rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-slate-700 hover:text-white">
            <div>
              <HiOutlineUserGroup className="h-10 w-10" />
            </div>
            <h1 className="">Registered Members</h1>
            <div className="group-hover:scale-150 transition-all ease-in-out group-hover:duration-1000 duration-1000 absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2 z-10">
              {member}
            </div>
          </div>
        </Link>

        <div className="cursor-pointer  w-64 h-28 border rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-slate-700 hover:text-white">
          <div>
            <MdCurrencyRupee className="h-10 w-10" />
          </div>
          <h1 className="">Total Earnings</h1>
        </div>

        <Link to="/admin/annoucement/MakeAnnouncement">
          <div className="cursor-pointer group relative w-64 h-28 border rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-slate-700 hover:text-white">
            <div>
              <TfiAnnouncement className="h-10 w-10" />
            </div>
            <h1 className="">Annoucments</h1>
            <div className="group-hover:scale-150 transition-all ease-in-out group-hover:duration-1000 duration-1000 absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2 z-10">
              {announcement.length}
            </div>
          </div>
        </Link>
      </div>
      {/* first section ends here */}

      {/* second section starts here */}
      <ChartConfig />
      {/* second section ends here */}

      {/* third section starts here */}
      <Expense />
      {/* third sections ends here */}

      {/* forth section starts here */}
      <PieChart />
      {/* forth section ends here */}

      {/* Fifth section starts here */}
      <div className="flex ">
        <section className="w-full p-2 border-t">
          <div className="mx-auto max-w-7xl p-6 bg-white rounded-lg shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-blue-600 text-3xl">
                <i className="fas fa-info-circle"></i>{" "}
                {/* Icon for Request Info */}
              </span>
              <h5 className="text-3xl font-semibold text-gray-800">
                Request Information
              </h5>
            </div>

            {reqInfo.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-lg">
                No request information found.
              </div>
            ) : (
              reqInfo.map((request, index) => (
                <div
                  key={index}
                  className="mb-8 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl "
                >
                  <div className="flex gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col bg-blue-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <h6 className="text-lg font-semibold text-blue-700">
                        Full Name
                      </h6>
                      <p className="text-gray-700">
                        {request.firstName} {request.lastName}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col  bg-green-100 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                      <h6 className="text-lg font-semibold text-green-700">
                        Email
                      </h6>
                      <p className="text-gray-700">{request.email}</p>
                    </div>
                  </div>

                  {/* Message Section */}
                  <div className="mt-6 p-6 bg-gray-100 rounded-2xl shadow-sm transition-all duration-500 transform hover:scale-105">
                    <h6 className="text-lg font-semibold text-gray-700">
                      Message
                    </h6>
                    <p className="text-gray-700">{request.message}</p>
                  </div>

                  {/* Date Section */}
                  <div className="mt-4 text-gray-500 text-sm ">
                    <p>
                      <strong>Requested At:</strong>{" "}
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="w-full p-2 border-t">
          <div className="w-full  p-6 bg-white rounded-lg shadow-lg  ">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <TfiAnnouncement className="text-blue-400 text-xl" />
              <h1 className="text-lg font-semibold text-gray-800">
                Gym Announcements
              </h1>
            </div>

            <div className="overflow-auto bg-gray-800 rounded-lg shadow-sm p-6 space-y-3">
              {announcement.length === 0 ? (
                <div className="text-center py-3 text-gray-400 text-sm">
                  No announcements found.
                </div>
              ) : (
                announcement.map((announcement, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-md bg-[#2d2f39] hover:bg-[#3e434d] transition-all duration-500 transform hover:scale-105"
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
              to="/admin/annoucement/ManageAnnouncement"
              className=" text-center mt-4 px-4 py-2 rounded-full border bg-lime-500 text-white text-sm hover:bg-lime-600 transition-all duration-200"
            >
              View All
            </Link>
          </div>
        </section>
      </div>
      {/* Fifth section ends here */}
    </>
  );
}

export default DashBorad;
