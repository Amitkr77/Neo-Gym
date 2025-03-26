import axios from "axios";
import React, { useEffect, useState } from "react";
import { TfiAnnouncement } from "react-icons/tfi";
import FRONTEND_URL from "../../constant/const";

export default function Annoucements() {
  const [announcement, setAnnouncements] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${FRONTEND_URL}/api/announcement`);
        setAnnouncements(res.data.data);
      } catch (error) {
        console.log(error.message || "An error occurred while fetching data.");
      }
    };
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert ISO string to Date object

    return date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY (or change locale to suit)
  };
  return (
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
                    <p className="text-sm text-white">{announcement.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
      </div>
    </section>
  );
}
