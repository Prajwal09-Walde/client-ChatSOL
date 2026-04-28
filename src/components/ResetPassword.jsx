import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`http://localhost:3080/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Password has been successfully reset. Redirecting to login...");
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || "Failed to reset password. The token may be invalid or expired.");
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
      
      <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 head">Create New Password</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm text-center">{error}</div>}
        {message && <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 rounded mb-4 text-sm text-center">{message}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="New Password" 
            className="p-3 rounded bg-black/30 border border-white/10 focus:outline-none focus:border-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input 
            type="password" 
            placeholder="Confirm New Password" 
            className="p-3 rounded bg-black/30 border border-white/10 focus:outline-none focus:border-white/50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded font-semibold transition-colors duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
