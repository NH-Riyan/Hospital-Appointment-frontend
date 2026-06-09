import React from "react";
import Navbar from "../component/Navbar/Navbar";
import { NavLink, Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">

      <Navbar />

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-72 min-h-screen bg-white/70 backdrop-blur-md border-r border-blue-100 shadow-sm p-6">

          <h2 className="text-2xl font-bold text-blue-700 mb-8 tracking-wide">
            Health Dashboard
          </h2>

          <ul className="space-y-3">

            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`
                }
              >
                👤 My Profile
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/myhistory"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  }`
                }
              >
                📋 My History
              </NavLink>
            </li>

          </ul>

        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;