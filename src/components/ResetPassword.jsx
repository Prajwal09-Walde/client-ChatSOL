import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]             = useState('');
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError(data.error || data.message || 'Failed to reset password. The link may be expired.');
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

        <h2 className="text-xl font-semibold text-white text-center mb-1">Create New Password</h2>
        <p className="text-center text-sm text-slate-400 mb-5">Choose a strong password for your account</p>

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
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">New Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
