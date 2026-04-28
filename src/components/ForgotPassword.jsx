import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setError(data.error || data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101035] h-screen flex justify-center items-center relative overflow-hidden text-white">
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>
      
      <div className="z-10 bg-white/10 backdrop-blur-md p-6 sm:p-8 mx-4 sm:mx-0 rounded-2xl shadow-2xl w-full sm:max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-2 head">Reset Password</h2>
        <p className="text-center text-sm text-white/70 mb-6">Enter your email to receive a reset link</p>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm text-center">{error}</div>}
        {message && <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 rounded mb-4 text-sm text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="p-3 rounded bg-black/30 border border-white/10 focus:outline-none focus:border-white/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded font-semibold transition-colors duration-200"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Remembered your password? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
