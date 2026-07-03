import React from "react";
import UserProfile from "./UserProfile";
import DocProfile from "./DocProfile";
import useUserRole from "../Hooks/useUserRole";

const Profile = () => {
  const { role, loading } = useUserRole();

  // ⏳ While role is loading
  if (loading) {
    return <span className="loading loading-infinity loading-xl"></span>;
  }

  // ❌ If no role found
  if (!role) {
    return <div className="text-center mt-10">No role found</div>;
  }

  // ✅ Render based on role
  if (role === "doctor") return <DocProfile />;
  return <UserProfile />;
};

export default Profile;
