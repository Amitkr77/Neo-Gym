import React, { useEffect } from "react";
import AOS from "aos"; // Importing AOS for scroll animations
import "aos/dist/aos.css"; // Import AOS CSS
import { FaDumbbell, FaCogs, FaRunning } from "react-icons/fa"; // Importing icons

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration
      easing: "ease-out-quart", // Smoother easing
      once: true, // Trigger animation only once
    });
  }, []);

  return (
    <section className="py-20 px-8 bg-[#F3F4F6]" id="about">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2
          className="text-5xl font-extrabold text-[#1E3A8A] mb-8 tracking-tight leading-tight"
          data-aos="fade-up"
        >
          About Us
        </h2>
        <p
          className="text-lg text-[#374151] mb-16 max-w-3xl mx-auto leading-relaxed opacity-80"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Our mission is to empower you to achieve your fitness goals in a
          welcoming and inspiring environment. With expert trainers,
          cutting-edge equipment, and diverse classes, we’re committed to your
          success every step of the way.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div
            className="bg-white p-10 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl  hover:text-white"
            data-aos="fade-up"
          >
            <div className="text-4xl text-[#070B15] mb-4">
              <FaDumbbell />
            </div>
            <h3 className="text-3xl font-semibold text-[#1E3A8A] mb-5">
              Expert Trainers
            </h3>
            <p className="text-[#374151]">
              Our trainers are certified professionals, ready to guide you
              through personalized workout plans tailored to your goals.
            </p>
          </div>
          <div
            className="bg-white p-10 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl  hover:text-white"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-4xl text-[#070B15] mb-4">
              <FaCogs />
            </div>
            <h3 className="text-3xl font-semibold text-[#1E3A8A] mb-5">
              State-of-the-Art Equipment
            </h3>
            <p className="text-[#374151]">
              Equipped with the latest fitness machines and tools, our gym
              ensures you have everything you need to achieve your best.
            </p>
          </div>
          <div
            className="bg-white p-10 rounded-xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl  hover:text-white"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="text-4xl text-[#070B15] mb-4">
              <FaRunning />
            </div>
            <h3 className="text-3xl font-semibold text-[#1E3A8A] mb-5">
              Variety of Classes
            </h3>
            <p className="text-[#374151]">
              From Yoga to HIIT, we offer a wide range of classes to challenge
              you and keep you motivated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
