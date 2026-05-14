import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user',  JSON.stringify(data.user));
        navigate(data.user.role === 'admin' ? '/admin' : '/chat');
      } else {
        setError(data.error || data.message || 'Invalid credentials');
      }
    } catch {
      setError('Failed to login. Server error.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden text-white"
         style={{ background: '#0f0f1a' }}>
      {/* Gradient blobs */}
      <div className="gradient-01 absolute" />
      <div className="gradient-02 absolute" />

      {/* Card */}
      <div className="z-10 glass rounded-2xl shadow-2xl w-full max-w-md mx-4 sm:mx-0 p-8 border border-violet-500/20
                      transition-all duration-300">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400
                         bg-clip-text text-transparent">
            ChatSOL
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your AI-powered assistant</p>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-6">Welcome back</h2>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 p-3 rounded-lg mb-5 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end -mt-1">
            <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary mt-1">
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-7">
          No account?{' '}
          <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
