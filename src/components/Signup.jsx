import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

const Signup = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/signup`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user',  JSON.stringify(data.user));
        navigate('/chat');
      } else {
        setError(data.error || data.message || 'Failed to sign up');
      }
    } catch {
      setError('Failed to sign up. Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden text-white px-4 py-8"
         style={{ background: '#0f0f1a' }}>
      <div className="gradient-03 absolute" />
      <div className="gradient-04 absolute" />

      <div className="z-10 glass rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-violet-500/20">

        <div className="text-center mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ChatSOL
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your AI-powered assistant</p>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-5">Create an account</h2>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 p-3 rounded-lg mb-5 text-sm text-center break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              placeholder="Min. 6 characters"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
