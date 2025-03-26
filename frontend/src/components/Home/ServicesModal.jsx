import React from "react";
import treadmill from '../../assets/treadmill.png';
import nutrition from '../../assets/nutrition-plan.png';
import membership from '../../assets/membership.png';

function ServicesModal({ toggleModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full sm:w-10/12  max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-4xl font-extrabold text-gray-900">Our Services</h3>
          <button 
            onClick={toggleModal} 
            className="text-4xl text-gray-600 hover:text-gray-800 transition duration-300 focus:outline-none"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Personal Training Card */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <div className="flex items-center mb-4">
              <img src={treadmill} alt="Personal Training" className="w-12 h-12 mr-4" />
              <h4 className="text-2xl font-semibold text-white">Personal Training</h4>
            </div>
            <p className="text-white mb-4">
              Get one-on-one coaching from our certified trainers to achieve your fitness goals faster. We create personalized workout plans tailored to your needs.
            </p>
            <ul className="text-white mb-4 list-disc pl-6">
              <li>Personalized workout plans</li>
              <li>Flexible scheduling</li>
              <li>One-on-one support</li>
            </ul>
            <a href="/personal-training" className="text-white font-medium hover:underline">Learn More</a>
          </div>

          {/* Nutrition Plans Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <div className="flex items-center mb-4">
              <img src={nutrition} alt="Nutrition Plans" className="w-12 h-12 mr-4" />
              <h4 className="text-2xl font-semibold text-white">Nutrition Plans</h4>
            </div>
            <p className="text-white mb-4">
              Fuel your body with the right nutrients. Our experts will design a meal plan to fit your fitness goals, helping you build muscle, lose weight, or maintain a healthy lifestyle.
            </p>
            <ul className="text-white mb-4 list-disc pl-6">
              <li>Customized meal plans</li>
              <li>Weekly progress checks</li>
              <li>Healthy, easy-to-follow recipes</li>
            </ul>
            <a href="/nutrition-plans" className="text-white font-medium hover:underline">Learn More</a>
          </div>

          {/* Membership Plans Card */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
            <div className="flex items-center mb-4">
              <img src={membership} alt="Membership Plans" className="w-12 h-12 mr-4" />
              <h4 className="text-2xl font-semibold text-white">Membership Plans</h4>
            </div>
            <p className="text-white mb-4">
              Find the perfect membership plan for your fitness needs. Whether you’re just starting or are a seasoned athlete, we have options to suit all levels.
            </p>
            <div className="space-y-4">
              {/* Basic Plan */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h5 className="font-semibold text-white">Basic Plan</h5>
                <p className="text-gray-300">Access to gym facilities and group fitness classes.</p>
                <a href="/membership" className="text-teal-400 font-medium hover:underline">Learn More</a>
              </div>

              {/* Standard Plan */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h5 className="font-semibold text-white">Standard Plan</h5>
                <p className="text-gray-300">Access to gym, personal training, and nutrition coaching.</p>
                <a href="/membership" className="text-teal-400 font-medium hover:underline">Learn More</a>
              </div>

              {/* Premium Plan */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h5 className="font-semibold text-white">Premium Plan</h5>
                <p className="text-gray-300">24/7 access, unlimited personal training, and specialized workshops.</p>
                <a href="/membership" className="text-teal-400 font-medium hover:underline">Learn More</a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ServicesModal;
