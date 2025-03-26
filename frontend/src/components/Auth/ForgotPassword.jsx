import React, { useState } from 'react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Track the current step (1 = email, 2 = OTP)
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // You can add your logic here to send OTP to the provided email (API call, etc.)
    setOtpSent(true);
    setMessage('An OTP has been sent to your email. Please enter it below.');
    setStep(2); // Move to the OTP entry step
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // You can add your logic here to verify OTP (API call, etc.)
    setMessage('OTP verified! You can now reset your password.');
    // Reset form after OTP verification
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Forgot Password
        </h2>
        
        {/* Display the message if any */}
        {message && <p className="text-center text-sm text-green-600 mb-4">{message}</p>}
        
        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <p className="text-center text-sm text-gray-600 mb-6">Enter your email to receive a password reset OTP</p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Generate OTP
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && otpSent && (
          <form onSubmit={handleOtpSubmit}>
            <p className="text-center text-sm text-gray-600 mb-6">Enter the OTP sent to your email</p>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Verify OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
