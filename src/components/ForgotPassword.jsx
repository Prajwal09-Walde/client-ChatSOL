import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const ForgotPassword = () => {
  const [email, setEmail]                     = useState('');
  const [step, setStep]                       = useState(1); // 1 = Verify Email, 2 = Set New Password, 3 = Success
  const [resetToken, setResetToken]           = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]                 = useState('');
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);

  const handleVerifyEmail = async (e) => {
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
        if (data.resetToken) {
          setResetToken(data.resetToken);
          setStep(2);
          setMessage('Email verified. You can now reset your password directly within the app.');
        } else {
          setMessage('A password reset link has been sent to your email.');
          setStep(3);
        }
      } else {
        setError(data.error || data.message || 'User not found.');
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password updated successfully! You can now log in.');
        setStep(3);
      } else {
        setError(data.error || data.message || 'Failed to reset password.');
      }
    } catch {
      setError('Server error. Please try again.');
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
        <p className="text-center text-sm text-slate-400 mb-5">
          {step === 1 && 'Enter your email to verify and reset password'}
          {step === 2 && 'Set your new account password'}
          {step === 3 && 'All steps complete'}
        </p>

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

        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="flex flex-col gap-4">
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
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="flex justify-center mt-2">
            <Link to="/login" className="btn-primary w-full text-center py-2.5 rounded-lg text-sm font-semibold">
              Return to Sign In
            </Link>
          </div>
        )}

        {step !== 3 && (
          <p className="text-center text-sm text-slate-400 mt-6">
            Remembered your password?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
