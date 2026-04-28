import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatUI from './components/ChatUI';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/chat" element={<ChatUI />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={
        <div className="flex justify-center items-center h-screen bg-[#101035] text-white">
          <h1 className="text-4xl">404 - Page Not Found</h1>
        </div>
      } />
    </Routes>
  );
}

export default App;
