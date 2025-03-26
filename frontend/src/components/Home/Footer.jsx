import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import ServicesModal from "./ServicesModal";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Company Section */}
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-4xl font-semibold text-[#ff7e5f]">
            Neo<span className="text-white">Gym</span>
          </h3>
          <p className="text-gray-400 text-sm">
            Your Fitness Journey Starts Here
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">
              Quick Links
            </h4>
            <ul>
              <li>
                <Link to="/AboutPage" className="hover:text-[#ff7e5f]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/ContactUs" className="hover:text-[#ff7e5f]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">
              Services
            </h4>
            <ul>
              <li>
                <button onClick={toggleModal} className="hover:text-[#ff7e5f]">
                  Personal Training
                </button>
              </li>
              <li>
                <button onClick={toggleModal} className="hover:text-[#ff7e5f]">
                  Nutrition Plans
                </button>
              </li>
              <li>
                <button onClick={toggleModal} className="hover:text-[#ff7e5f]">
                  Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">
              Follow Us
            </h4>
            <div className="flex space-x-6">
              <a
                href="#"
                className="hover:text-[#ff7e5f] transition duration-200"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                className="hover:text-[#ff7e5f] transition duration-200"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="hover:text-[#ff7e5f] transition duration-200"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="hover:text-[#ff7e5f] transition duration-200"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-4">
              Subscribe to Our Newsletter
            </h4>
            <form className="flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 text-white px-4 py-2 rounded-l-full w-72 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="submit"
                className="bg-[#ff7e5f] text-gray-800 px-6 py-2 rounded-r-full hover:text-white transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-400">
          <p>&copy; 2024 NeoGym. All rights reserved.</p>
        </div>
      </div>
      {/* Modal Component */}
      {isModalOpen && <ServicesModal toggleModal={toggleModal} />}
    </footer>
  );
};

export default Footer;
