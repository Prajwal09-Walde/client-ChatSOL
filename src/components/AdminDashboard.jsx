import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AdminDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/auth/activities`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 403) {
          navigate("/chat"); // Redirect non-admins to chat
          return;
        }

        const data = await res.json();
        if (res.ok) {
          setActivities(data);
        } else {
          setError(data.message || "Failed to fetch activities");
        }
      } catch (err) {
        setError("Server error while fetching activities.");
      }
    };

    fetchActivities();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-[#101035] min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-white/20 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold head">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold mb-4">User Activities</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20 text-white/70">
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">User</th>
                  <th className="pb-3 px-4">Action</th>
                  <th className="pb-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-white/50">No activities found.</td>
                  </tr>
                ) : (
                  activities.map(activity => (
                    <tr key={activity._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">{new Date(activity.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {activity.userId ? (
                          <>
                            <div className="font-semibold">{activity.userId.name}</div>
                            <div className="text-xs text-white/50">{activity.userId.email}</div>
                          </>
                        ) : "Unknown User"}
                      </td>
                      <td className="py-3 px-4 font-medium text-blue-300">{activity.action}</td>
                      <td className="py-3 px-4 text-white/70">{activity.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
