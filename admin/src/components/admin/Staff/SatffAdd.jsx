import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FRONTEND_URL from "../../../constant/const";

const StaffAdd = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
    },
    designation: 'cashier',
    gender: 'male',
    contact: '',
  });

  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address')) {
      const addressField = name.split('.')[1];
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    if (!/^[0-9]{10,15}$/.test(formData.contact)) {
      setError('Contact number must be 10 to 15 digits.');
      return;
    }
    setSubmitting(true);

    // Ensure address is properly formatted
    const { street, city, state, zipcode } = formData.address;
    const address = { street, city, state, zipCode: zipcode };

    const requestData = {
      fullname: formData.fullname,
      username: formData.username,
      email: formData.email,
      gender: formData.gender,
      designation: formData.designation,
      contact: formData.contact,
      address,  // Send address as an object
    };

    try {
      // Send form data to backend
      await axios.post(`${FRONTEND_URL}/api/staff`, requestData);
      toast.success(`${formData.fullname} added to staff`);
      setStep(1);
      setFormData({
        fullname: '',
        username: '',
        email: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipcode: '',
        },
        designation: 'cashier',
        gender: 'male',
        contact: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add the staff member. Please check the details.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const previousStep = () => setStep(step - 1);

  return (
    <div className="max-full m-2 p-6 bg-white shadow-md rounded-lg mt-10">
      <div className="widget-title flex items-center mb-4">
        <span className="text-blue-500 text-2xl mr-2">
          <i className="fas fa-briefcase"></i>
        </span>
        <h1 className="text-xl font-bold">Add staff member</h1>
        <Link to="/admin/staffManagement/StaffList" className="ml-auto text-blue-600 underline text-sm">Back to staff list</Link>
      </div>
      {error && <p className="mb-4 p-3 rounded bg-red-50 text-red-700" role="alert">{error}</p>}

      <div className="widget-content">
        <form id="form-wizard" onSubmit={handleSubmit} className="form-horizontal">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="step ui-formwizard-content">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="fullname">
                  Enter Staff's Fullname
                </label>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  required
                  value={formData.fullname}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">
                  Enter a Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                  Enter Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Staff records are for the gym's roster. Staff logins are not available yet.
              </p>
            </div>
          )}

          {/* Step 2: Additional Information */}
          {step === 2 && (
            <div className="step ui-formwizard-content">
              {/* Address Fields */}
              <div className="p-4 mb-2 border">
                <h1 className="text-xl my-2 font-bold ml-2">Address</h1>
                {/* Street */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="address.street">
                    Street
                  </label>
                  <input
                    id="address.street"
                    type="text"
                    name="address.street"
                    required
                    value={formData.address.street}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                  />
                </div>
                {/* City */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="address.city">
                    City
                  </label>
                  <input
                    id="address.city"
                    type="text"
                    name="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                  />
                </div>
                {/* State */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="address.state">
                    State
                  </label>
                  <input
                    id="address.state"
                    type="text"
                    name="address.state"
                    required
                    value={formData.address.state}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                  />
                </div>
                {/* Zipcode */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="address.zipcode">
                    PIN / ZIP code
                  </label>
                  <input
                    id="address.zipcode"
                    type="text"
                    name="address.zipcode"
                    required
                    value={formData.address.zipcode}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="designation">
                  Designation
                </label>
                <select
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                >
                  <option value="cashier">Cashier</option>
                  <option value="trainer">Trainer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="gender">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Contact */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="contact">
                  Contact Number
                </label>
                <input
                  id="contact"
                  type="tel"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
                />
              </div>
            </div>
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
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAdd;
