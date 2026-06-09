import React from "react";
import useUserRole from "../../component/Hooks/useUserRole";
import DocHome from "./DocHome";
import UserHome from "./UserHome";
import AdminHome from "./AdminHome";

const Home = () => {
  const { role, loading } = useUserRole();

  if (loading ) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (role === "admin") return <AdminHome />;
  if (role === "doctor") return <DocHome />;
  return <UserHome />;
};

export default Home;
