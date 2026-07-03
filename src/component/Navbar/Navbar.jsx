import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useUserRole from "../Hooks/useUserRole";
import {
  FaHospital,
  FaSignOutAlt,
  FaUser,
  FaFlask,
  FaHistory,
  FaUserMd,
  FaFileMedical,
  FaClipboardList,
} from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, loading, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { role } = useUserRole();

  const adminSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='%230ea5e9'/><text x='50%' y='50%' font-size='64' fill='white' text-anchor='middle' dominant-baseline='central' font-family='Arial'>A</text></svg>`;
  const adminAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(adminSvg)}`;

  const handleLogout = () => {
    logOut()
      .then(() => {
        setDropdownOpen(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const link = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            isActive
              ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
              : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
          }`
        }
      >
        <FaHospital className="text-xs" />
        Home
      </NavLink>

      {role === "admin" ? (
        <>
          {/* Doctors List */}
          <NavLink
            to="/docList"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <FaUserMd className="text-xs" />
            Doctors
          </NavLink>

          {/* Test Bookings */}
          <NavLink
            to="/tests"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <FaFlask className="text-xs" />
            Tests
          </NavLink>

          {/* Pending Reports */}
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <FaFileMedical className="text-xs" />
            Reports
          </NavLink>

          {/* Report History */}
          <NavLink
            to="/admin/report-history"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <FaHistory className="text-xs" />
            Report History
          </NavLink>
        </>
      ) : role === "doctor" ? (
        // 👨‍⚕️ DOCTOR VIEW: Only Appointments
        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
              isActive
                ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
            }`
          }
        >
          <FaHistory className="text-xs" />
          Appointments
        </NavLink>
      ) : (
        // 👤 PATIENT VIEW: Appointments + My Reports
        <>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <FaHistory className="text-xs" />
            Appointments
          </NavLink>

          {/* 🔹 User Reports Link (Only for Patients) */}
          <NavLink
            to="/user-reports"
            className={({ isActive }) =>
              `px-6j py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-sky-100 to-teal-100 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <FaClipboardList className="text-xs" />
            My Reports
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50  bg-white/70 backdrop-blur-xl border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 shadow-md">
              <FaHospital className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              MediCare
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-sky-100 shadow-inner">
            {link}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex justify-center items-center w-20 h-12">
                <span className="loading loading-infinity loading-md"></span>
              </div>
            ) : user || role === "admin" ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-sky-300 transition"
                >
                  <img
                    src={
                      role === "admin"
                        ? adminAvatar
                        : user?.photoURL || "/default-avatar.png"
                    }
                    alt="profile"
                    className="w-11 h-11 rounded-full border-2 border-sky-200 shadow-sm"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white  border border-sky-100 rounded-2xl shadow-2xl p-3 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-sky-100">
                      <p className="font-semibold text-slate-900 text-sm">
                        {role === "admin"
                          ? "🔑 Admin Account"
                          : user?.displayName || user?.email}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {user?.email || "admin@hospital.com"}
                      </p>
                    </div>

                    {role !== "admin" && (
                      <NavLink
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 mt-2 hover:bg-sky-50 rounded-xl transition text-slate-700 text-sm font-medium"
                      >
                        <FaUser className="text-sky-600" />
                        Dashboard
                      </NavLink>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 mt-2 hover:bg-red-50 rounded-xl transition text-red-600 text-sm font-medium w-full text-left"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg transition"
                >
                  Login
                </Link>

                <Link
                  to="/auth/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
