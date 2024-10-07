'use client';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // State to hold the success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https:devsalman.tech/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    // Check if the response is successful and set the message accordingly
    if (res.ok) {
      setMessage('Password reset link sent! Please check your email.');
      setEmail(''); // Clear the email input field
    } else {
      setMessage(data.message); // Set error message if any
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-green-500 text-center mt-4">{message}</p>} {/* Display success message */}
      </div>
    </div>
  );
}
