import React, { useState } from "react";
import axios from "axios";
import FRONTEND_URL from "../../../constant/const";

export default function MemberEntryForm() {
  const [selectedService, setSelectedService] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    gender: "male",
    dor: "",
    plan: "premium",
    contactNumber: "",
    address: {
      street: "",
      zipCode: "",
      city: "",
      state: "",
    },
    status: "Active",
    attendanceCount: "",
    initialWeight: "",
    currentWeight: "",
    initialBodyType: "",
    currentBodyType: "",
    progressDate: "",
    reminder: true,
    paidDate: "",
    chosenService: "",
  });

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle the service selection and set corresponding amount
  const handleServiceChange = (e) => {
    const service = e.target.value;
    setSelectedService(service);

    // Update the formData with the selected service
    setFormData((prevData) => ({
      ...prevData,
      chosenService: service, // Store selected service in formData
    }));

    if (service === "Fitness") {
      setAmount(55);
    } else if (service === "Sauna") {
      setAmount(35);
    } else if (service === "Cardio") {
      setAmount(40);
    }
  };

  const nextStep = () => setStep(step + 1);
  const previousStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const { street, city, state, zipCode } = formData.address;
    const  address = {street, city, state, zipCode}
    // Create the form data object from formData state
    const dataToSubmit = {
      fullName: formData.fullName,
      username: formData.username,
      password: formData.password,
      gender: formData.gender,
      dor: formData.dor,
      plan: formData.plan,
      contactNumber: formData.contactNumber,
      address,
      status: formData.status,
      attendanceCount: formData.attendanceCount,
      initialWeight: formData.initialWeight,
      currentWeight: formData.currentWeight,
      initialBodyType: formData.initialBodyType,
      currentBodyType: formData.currentBodyType,
      progressDate: formData.progressDate,
      reminder: formData.reminder,
      paidDate: formData.paidDate,
      chosenService: formData.chosenService,
      amount: amount,
    }

    try {
      const response = await axios.post(
        `${FRONTEND_URL}/api/member/users`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the request was successful
      console.log("Form submitted successfully:", response.data);
      // Handle success (e.g., show a success message, clear form, etc.)
    } catch (error) {
      console.error("Error submitting form:", error.response || error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h5 className="text-lg font-semibold mb-4">Member Entry Form</h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info and contactNumber */}
            {step === 1 && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="fullName"
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username:
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="**********"
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender:
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  >
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="other">other</option>
                  </select>
                </div>

                {/* Date of Registration */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    D.O.R:
                  </label>
                  <input
                    type="date"
                    name="dor"
                    value={formData.dor}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Plan */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plans:
                  </label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  >
                    <option value="premium">premium</option>
                    <option value="standard">standard</option>
                    <option value="basic">basic</option>
                  </select>
                </div>

                {/* contactNumber Number */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    contactNumber Number:
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Address Fields */}
                <div className="p-4 mb-2 border">
                  <h1 className="text-xl my-2 font-bold ml-2">Address</h1>
                  {/* Street */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="address.street"
                    >
                      Street
                    </label>
                    <input
                      id="address.street"
                      type="text"
                      name="address.street"
                      required
                      value={formData.address.street}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md w-full p-2"
                    />
                  </div>
                  {/* City */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="address.city"
                    >
                      City
                    </label>
                    <input
                      id="address.city"
                      type="text"
                      name="address.city"
                      required
                      value={formData.address.city}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md w-full p-2"
                    />
                  </div>
                  {/* State */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="address.state"
                    >
                      State
                    </label>
                    <input
                      id="address.state"
                      type="text"
                      name="address.state"
                      required
                      value={formData.address.state}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md w-full p-2"
                    />
                  </div>
                  {/* Zipcode */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      htmlFor="address.zipCode"
                    >
                      Zipcode
                    </label>
                    <input
                      id="address.zipCode"
                      type="text"
                      name="address.zipCode"
                      required
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md w-full p-2"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Service Details and Additional Details */}
            {step === 2 && (
              <>
                {/* chosenService Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    chosenService:
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Fitness"
                        name="chosenService"
                        checked={formData.chosenService === "Fitness"}
                        onChange={handleServiceChange}
                        className="mr-2"
                        required
                      />
                      Fitness <small>- $55 per month</small>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Sauna"
                        name="chosenService"
                        checked={formData.chosenService === "Sauna"}
                        onChange={handleServiceChange}
                        className="mr-2"
                      />
                      Sauna <small>- $35 per month</small>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="Cardio"
                        name="chosenService"
                        checked={formData.chosenService === "Cardio"}
                        onChange={handleServiceChange}
                        className="mr-2"
                      />
                      Cardio <small>- $40 per month</small>
                    </label>
                  </div>
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Amount:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md p-2">
                    <span className="text-lg font-bold">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      required
                      className="w-full border-none focus:outline-none p-1"
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status:
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-md w-full p-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Attendance Count */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Attendance Count:
                  </label>
                  <input
                    type="number"
                    name="attendanceCount"
                    value={formData.attendanceCount}
                    onChange={handleChange}
                    min="0"
                    placeholder="Attendance Count"
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Initial Weight */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Initial Weight:
                  </label>
                  <input
                    type="number"
                    name="initialWeight"
                    value={formData.initialWeight}
                    onChange={handleChange}
                    placeholder="Initial Weight"
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Current Weight */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Weight:
                  </label>
                  <input
                    type="number"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleChange}
                    placeholder="Current Weight"
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Initial Body Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Initial Body Type:
                  </label>
                  <input
                    type="text"
                    name="initialBodyType"
                    value={formData.initialBodyType}
                    onChange={handleChange}
                    placeholder="Slim, Fat, etc."
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Current Body Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Body Type:
                  </label>
                  <input
                    type="text"
                    name="currentBodyType"
                    value={formData.currentBodyType}
                    onChange={handleChange}
                    placeholder="Buffed, Bulked, etc."
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Progress Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Progress Date:
                  </label>
                  <input
                    type="date"
                    name="progressDate"
                    value={formData.progressDate}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>

                {/* Reminder */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reminder:
                  </label>
                  <select
                    name="reminder"
                    value={formData.reminder}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* Paid Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Paid Date:
                  </label>
                  <input
                    type="date"
                    name="paidDate"
                    value={formData.paidDate}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md w-full p-2"
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                  type="button"
                  onClick={previousStep}
                >
                  Back
                </button>
              )}
              {step < 2 && (
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                  type="button"
                  onClick={nextStep}
                >
                  Next
                </button>
              )}
              {step === 2 && (
                <button
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition"
                  type="submit"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
