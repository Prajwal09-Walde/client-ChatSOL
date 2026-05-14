import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError]           = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const res = await fetch(`${API_URL}/api/auth/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) { navigate('/chat'); return; }

        const data = await res.json();
        if (res.ok) setActivities(data);
        else setError(data.error || data.message || 'Failed to fetch activities');
      } catch {
        setError('Server error while fetching activities.');
      }
    };
    fetchActivities();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalUsers = [...new Set(activities.map(a => a.userId?.email).filter(Boolean))].length;
  const lastActivity = activities[0] ? new Date(activities[0].createdAt).toLocaleString() : '—';

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: '#0f0f1a' }}>
      {/* Gradient blobs */}
      <div className="gradient-01 absolute" />
      <div className="gradient-04 absolute" />

      {/* ── Sticky header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-violet-500/15 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M3 17h18" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400
                           bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30
                     text-rose-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </header>

      {/* ── Main content ───────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ── Stats cards ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Card 1 */}
          <div className="glass rounded-xl p-5 border border-violet-500/20 hover:border-violet-500/40
                          transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Total Events</p>
            <p className="text-3xl font-bold text-white">{activities.length}</p>
            <p className="text-xs text-violet-400 mt-1">All recorded activities</p>
          </div>
          {/* Card 2 */}
          <div className="glass rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-500/40
                          transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Unique Users</p>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
            <p className="text-xs text-cyan-400 mt-1">Active users tracked</p>
          </div>
          {/* Card 3 */}
          <div className="glass rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-500/40
                          transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Last Activity</p>
            <p className="text-sm font-bold text-white truncate">{lastActivity}</p>
            <p className="text-xs text-indigo-400 mt-1">Most recent event</p>
          </div>
        </div>

        {/* ── Activity table ─────────────────────────── */}
        <div className="glass rounded-2xl border border-violet-500/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-sm font-semibold text-slate-200">User Activities</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/5 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500 text-sm">
                      No activities found.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr
                      key={activity._id}
                      className="border-b border-white/5 hover:bg-violet-500/5 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                        {new Date(activity.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {activity.userId ? (
                          <>
                            <div className="font-medium text-slate-200">{activity.userId.name}</div>
                            <div className="text-xs text-slate-500">{activity.userId.email}</div>
                          </>
                        ) : (
                          <span className="text-slate-500">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                         bg-violet-500/15 text-violet-300 border border-violet-500/20">
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{activity.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
