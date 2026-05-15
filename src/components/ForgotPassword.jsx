import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res  = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('A password reset link has been sent to your email.');
      } else {
        setError(data.error || data.message || 'Failed to send reset link.');
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden text-white px-4 py-8"
         style={{ background: '#0f0f1a' }}>
      <div className="gradient-01 absolute" />
      <div className="gradient-02 absolute" />

      <div className="z-10 glass rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-6 sm:p-8 border border-violet-500/20">

        <div className="text-center mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            ChatSOL
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your AI-powered assistant</p>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-1">Forgot Password</h2>
        <p className="text-center text-sm text-slate-400 mb-5">Enter your email to receive a reset link</p>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 p-3 rounded-lg mb-4 text-sm text-center break-words">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 p-3 rounded-lg mb-4 text-sm text-center break-words">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button type="submit" disabled={loading} className="btn-primary mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
