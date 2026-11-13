import { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // User icon
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS for animations

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <section className="py-20 bg-[#F9FAFB]" id="testimonials">
      <div className="max-w-screen-xl mx-auto text-center px-4">
        {/* Section Title */}
        <h2
          className="text-5xl font-extrabold text-[#1C1C1E] mb-12 tracking-tight"
          data-aos="fade-up"
        >
          Our Happy Clients
        </h2>

        {/* Testimonials Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {/* Testimonial 1 */}
          <div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border-t-4 border-[#6C63FF]"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#6C63FF] text-white flex items-center justify-center text-3xl">
                <FaUserCircle />
              </div>
            </div>
            <p className="italic text-lg text-[#4A4A4A] mb-4">
              "Joining this gym was the best decision I made. The environment is motivating and the trainers really know their stuff!"
            </p>
            <h4 className="font-semibold text-[#2B6CB0] text-xl mb-1">John Doe</h4>
            <p className="text-sm text-[#A0AEC0]">Member since 2021</p>
          </div>

          {/* Testimonial 2 */}
          <div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border-t-4 border-[#FF6A6A]"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#FF6A6A] text-white flex items-center justify-center text-3xl">
                <FaUserCircle />
              </div>
            </div>
            <p className="italic text-lg text-[#4A4A4A] mb-4">
              "I’m so glad I found this gym. The wide variety of classes keeps me engaged and motivated, and I’ve seen real results."
            </p>
            <h4 className="font-semibold text-[#2B6CB0] text-xl mb-1">Jane Smith</h4>
            <p className="text-sm text-[#A0AEC0]">Member since 2019</p>
          </div>

          {/* Testimonial 3 */}
          <div
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 border-t-4 border-[#38B2AC]"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#38B2AC] text-white flex items-center justify-center text-3xl">
                <FaUserCircle />
              </div>
            </div>
            <p className="italic text-lg text-[#4A4A4A] mb-4">
              "The trainers are incredibly supportive, and the workouts are tailored to meet my needs. I feel stronger and more confident every day."
            </p>
            <h4 className="font-semibold text-[#2B6CB0] text-xl mb-1">Emily Johnson</h4>
            <p className="text-sm text-[#A0AEC0]">Member since 2020</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
