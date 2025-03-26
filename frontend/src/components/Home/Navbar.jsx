import React, { useState, useEffect } from "react";
import { FaBars, FaUserAlt } from "react-icons/fa"; // Import React Icons
import { IoMdLogIn } from "react-icons/io"; // Login icon
import { FiUserPlus } from "react-icons/fi"; // Sign Up icon
import { Link } from "react-router-dom";
import ServicesModal from "./ServicesModal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black bg-opacity-90" : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            <span className="text-[#ff7e5f] font-extrabold">Neo</span>Gym
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
            to="/"
              className="text-white text-lg font-medium hover:text-[#ff7e5f] transition duration-300"
            >
              Home
            </Link>
            <button
              onClick={toggleModal}
              className="text-white text-lg font-medium hover:text-[#ff7e5f] transition duration-300"
            >
              Services
            </button>
            <Link
              to="/AboutPage"
              className="text-white text-lg font-medium hover:text-[#ff7e5f] transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contactUs"
              className="text-white text-lg font-medium hover:text-[#ff7e5f] transition duration-300"
            >
              Contact
            </Link>

            <div className="flex space-x-4">
              <Link to="login">
                <button className="text-white bg-transparent border-2 border-white py-2 px-6 rounded-full text-lg hover:bg-white hover:text-[#ff7e5f] transition duration-300">
                  <IoMdLogIn className="inline mr-2" />
                  Login
                </button>
              </Link>
              <Link to="Signup">
                <button className="text-white bg-[#ff7e5f] py-2 px-6 rounded-full text-lg hover:bg-[#ff5a4e] transition duration-300">
                  <FiUserPlus className="inline mr-2" />
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              className="text-white text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaBars />
            </button>
          </div>
        </div>
        {/* Modal Component */}
        {isModalOpen && <ServicesModal toggleModal={toggleModal} />}

        {menuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center space-y-6 py-8">
            <a
              href="#home"
              className="text-white text-lg font-medium hover:text-[#ff7e5f]"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#services"
              className="text-white text-lg font-medium hover:text-[#ff7e5f]"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#about"
              className="text-white text-lg font-medium hover:text-[#ff7e5f]"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white text-lg font-medium hover:text-[#ff7e5f]"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>

            <div className="flex flex-col space-y-4 mt-6">
              <button className="text-white bg-transparent border-2 border-white py-2 px-6 rounded-full text-lg hover:bg-white hover:text-[#ff7e5f] transition duration-300">
                <IoMdLogIn className="inline mr-2" />
                Login
              </button>
              <button className="text-white bg-[#ff7e5f] py-2 px-6 rounded-full text-lg hover:bg-[#ff5a4e] transition duration-300">
                <FiUserPlus className="inline mr-2" />
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
