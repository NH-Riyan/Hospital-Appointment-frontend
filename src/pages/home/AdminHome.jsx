import React, { useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import useUserRole from "../../component/Hooks/useUserRole";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";

const AdminHome = () => {
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();
  const { role } = useUserRole();

  const [emailQuery, setEmailQuery] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const { data: doctorsList = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["admin", "doctorsList"],
    queryFn: async () => {
      const res = await axiosInstance.get("/doctors");
      return res.data || [];
    },
  });

  const { data: usersList = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "usersList"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data || [];
    },
  });

  const { data: todaysAppointments = [], isLoading: apptsLoading } = useQuery({
    queryKey: ["admin", "appointmentsToday", todayStr],
    queryFn: async () => {
      const res = await axiosInstance.get(`/appointments?date=${todayStr}`);
      return res.data || [];
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchEmail", searchEmail],
    enabled: !!searchEmail,
    queryFn: async () => {
      try {
        const dres = await axiosInstance.get(
          `/doctor-profile?email=${encodeURIComponent(searchEmail)}`,
        );
        if (dres.data && Object.keys(dres.data).length) {
          return { type: "doctor", data: dres.data };
        }
      } catch {}

      try {
        const ures = await axiosInstance.get(
          `/user-profile?email=${encodeURIComponent(searchEmail)}`,
        );
        if (ures.data && Object.keys(ures.data).length) {
          return { type: "user", data: ures.data };
        }
      } catch {}

      return { type: "none" };
    },
  });
  console.log(data);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* HEADER */}
          <div className="flex items-center gap-4">
            <HiOutlineUserGroup className="text-4xl text-blue-600" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <p className="text-gray-600">
            Manage users, doctors, and appointments efficiently.
          </p>

          {/* 🔍 SEARCH BOX */}
          <div className="p-5 bg-gray-50 rounded-xl border space-y-4">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Search doctor or user by email..."
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={() => setSearchEmail(emailQuery)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {/* 🔄 STATES */}
            {isLoading && <p className="text-blue-500 text-sm">Searching...</p>}

            {isError && (
              <p className="text-red-500 text-sm">Something went wrong</p>
            )}

            {/* 📦 RESULT */}
            {data && (
              <div className="mt-4">
                {data.type === "none" && (
                  <div className="p-3 bg-yellow-50 border rounded-lg">
                    No record found
                  </div>
                )}

                {data.type === "doctor" && (
                  <div className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <img
                        src={data.data.photoURL}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          Dr. {data.data.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {data.data.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {data.data.specialty}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/admin/user/${data.email}`, {
                          state: data.data,
                        })
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Details
                    </button>
                  </div>
                )}

                {data.type === "user" && (
                  <div className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
                        {(data.data.name || "U")[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {data.data.name || "User"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {data.data.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/user/${encodeURIComponent(data.data.email)}`,
                          { state: data.data },
                        )
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 📊 STATS */}
        <div className="flex justify-center gap-6 my-12">
          {/* Doctors */}
          <div
            className="p-6 w-1/4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 
               border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <p className="text-sm text-blue-700 font-medium">Total Doctors</p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {doctorsLoading ? "…" : doctorsList.length}
            </p>

            <div className="w-10 h-1 bg-blue-400 rounded-full mt-3"></div>
          </div>

          {/* Patients */}
          <div
            className="p-6 w-1/4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 
              border border-green-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <p className="text-sm text-green-700 font-medium">Total Patients</p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {usersLoading ? "…" : usersList.length}
            </p>

            <div className="w-10 h-1 bg-green-400 rounded-full mt-3"></div>
          </div>

          {/* Appointments */}
          <div className="p-6 w-1/4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border
           border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-sm text-orange-700 font-medium">
              Appointments Today
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {apptsLoading ? "…" : todaysAppointments.length}
            </p>

            <div className="w-10 h-1 bg-orange-400 rounded-full mt-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
