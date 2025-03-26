import React from "react";
import bgImage from "../../assets/bgImage.jpg";
import Navbar from "./Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <section className="py-24 bg-gray-300 h-screen">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
          <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - About NeoGym */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Welcome to NeoGym
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                At NeoGym, we’re not just a gym – we’re a community. Whether
                you’re new to fitness or a seasoned pro, we have the equipment,
                the expertise, and the environment to help you achieve your
                goals.
              </p>

              <div className="flex justify-center lg:justify-start gap-8 mb-10">
                <div className="text-center">
                  <h3 className="text-3xl font-semibold text-indigo-600">
                    10+
                  </h3>
                  <p className="text-gray-500 text-sm">Years of Experience</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-semibold text-indigo-600">
                    5000+
                  </h3>
                  <p className="text-gray-500 text-sm">Happy Members</p>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <button className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg transition-all duration-300 ease-in-out">
                  Join Us Today
                  <svg
                    className="ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column - Gym Image */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                src={bgImage}
                alt="NeoGym"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Achievement 1 */}
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">
                  30+
                </h4>
                <p className="text-gray-500 text-base">Awards & Recognitions</p>
              </div>

              {/* Achievement 2 */}
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">
                  5000+
                </h4>
                <p className="text-gray-500 text-base">Happy Clients</p>
              </div>

              {/* Achievement 3 */}
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">
                  98%
                </h4>
                <p className="text-gray-500 text-base">Client Satisfaction</p>
              </div>

              {/* Achievement 4 */}
              <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">
                  10+
                </h4>
                <p className="text-gray-500 text-base">Years in Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
