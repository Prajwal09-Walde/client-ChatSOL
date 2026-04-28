import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(data.user.role === 'admin' ? '/admin' : '/chat');
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to login. Server error.");
    }
  };

  return (
    <div className="bg-[#101035] h-screen flex justify-center items-center relative overflow-hidden text-white">
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>
      
      <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6 head">Login to ChatSOL</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="p-3 rounded bg-black/30 border border-white/10 focus:outline-none focus:border-white/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3 rounded bg-black/30 border border-white/10 focus:outline-none focus:border-white/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">Forgot Password?</Link>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold transition-colors duration-200">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
