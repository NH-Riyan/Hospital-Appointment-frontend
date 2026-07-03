import React from "react";
import useUserRole from "../../component/Hooks/useUserRole";
import DocHome from "./DocHome";
import UserHome from "./UserHome";
import AdminHome from "./AdminHome";

const Home = () => {
  const { role, loading } = useUserRole();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  if (role === "admin") return <AdminHome />;
  if (role === "doctor") return <DocHome />;
  return <UserHome />;
};

export default Home;
