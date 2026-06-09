import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state;

  // 🔥 Redirect if doctor
  console.log("UserDetails received user:", user);
  console.log("UserDetails received user:", user?.role);
  useEffect(() => {
    if (user.role === "doctor") {
      navigate(`/doctor/${user._id}`);
    }
  }, [user, navigate]);

  // ⚠️ fallback (if no data)
  if (!user) {
    return <p className="text-center mt-10">No user data found</p>;
  }

  // ✅ PATIENT UI
  if (user.role === "patient") {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 space-y-4">
        <h1 className="text-2xl font-bold text-blue-600">
          Patient Details
        </h1>

        <div className="flex items-center gap-4">
          <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover" />

          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2 text-gray-700">
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default UserDetails;