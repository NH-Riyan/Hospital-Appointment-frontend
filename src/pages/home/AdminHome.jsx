import React, { useState, useEffect } from "react";
import { HiOutlineUserGroup, HiMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { FaStethoscope, FaUsers, FaCalendarCheck } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import useUserRole from "../../component/Hooks/useUserRole";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";

const AdminHome = () => {
  const axiosInstance = useAxiosSecure();
  const navigate = useNavigate();
  const { role } = useUserRole();

  // ✅ Search state now lives in the URL, so back/forward restores it
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [emailQuery, setEmailQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [dropdownOpen, setDropdownOpen] = useState(!!urlQuery);

  const todayStr = new Date().toISOString().split("T")[0];

  // ✅ Debounce the raw input, then sync it into the URL (replace, not push,
  // so typing doesn't spam browser history — only the final search matters there)
  useEffect(() => {
    const trimmed = emailQuery.trim();

    if (!trimmed) {
      setDebouncedQuery("");
      setDropdownOpen(false);
      setSearchParams({}, { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(trimmed);
      setDropdownOpen(true);
      setSearchParams({ q: trimmed }, { replace: true });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailQuery]);

  // ✅ If the URL query changes from outside (e.g. browser back/forward),
  // keep the input and dropdown in sync with it
  useEffect(() => {
    if (urlQuery !== debouncedQuery) {
      setEmailQuery(urlQuery);
      setDebouncedQuery(urlQuery);
      setDropdownOpen(!!urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

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

  // ✅ Live partial-match search across doctors + patients
  const {
    data: searchResults = { doctors: [], users: [] },
    isLoading: searchLoading,
    isError: searchError,
  } = useQuery({
    queryKey: ["admin", "searchAccounts", debouncedQuery],
    enabled: !!debouncedQuery,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/admin/search-accounts?email=${encodeURIComponent(debouncedQuery)}`
      );
      return res.data || { doctors: [], users: [] };
    },
    staleTime: 1000 * 60, // ✅ cached results reappear instantly on back-navigation
  });

  const totalResults = searchResults.doctors.length + searchResults.users.length;

  // ✅ No longer clears the query — search state stays intact when you return
  // Always navigate to UserDetails and pass the item via state so admin stays on the same details page
  const handleSelectResult = (type, item) => {
    setDropdownOpen(false);
    navigate(`/admin/user/${encodeURIComponent(item.email)}`, { state: item });
  };

  const clearSearch = () => {
    setEmailQuery("");
    setDebouncedQuery("");
    setDropdownOpen(false);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* 🔷 HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-sky-600 to-teal-600 rounded-xl">
              <HiOutlineUserGroup className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your healthcare platform
              </p>
            </div>
          </div>
        </div>

        {/* 🔷 SEARCH SECTION — moved to top */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-lg p-8 mb-8 relative">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HiMagnifyingGlass className="text-sky-600" />
            Search Users & Doctors
          </h2>

          {/* Search Box */}
          <div className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  type="email"
                  placeholder="Start typing an email address…"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  onFocus={() => emailQuery.trim() && setDropdownOpen(true)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                />
              </div>
              {emailQuery && (
                <button
                  onClick={clearSearch}
                  className="px-5 py-3 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition flex items-center gap-1.5 font-medium text-sm"
                >
                  <HiOutlineXMark />
                  Clear
                </button>
              )}
            </div>

            {/* ── Live results dropdown ── */}
            {dropdownOpen && debouncedQuery && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 max-h-96 overflow-y-auto">
                {searchLoading && (
                  <div className="flex justify-center items-center py-8">
                    <span className="loading loading-spinner loading-md text-sky-500"></span>
                  </div>
                )}

                {searchError && (
                  <div className="p-4 text-sm text-red-600">
                    Something went wrong. Please try again.
                  </div>
                )}

                {!searchLoading && !searchError && totalResults === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No matches for "<span className="font-semibold text-slate-700">{debouncedQuery}</span>"
                    </p>
                  </div>
                )}

                {!searchLoading && totalResults > 0 && (
                  <div className="py-2">
                    {searchResults.doctors.length > 0 && (
                      <div>
                        <p className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-sky-600">
                          Doctors
                        </p>
                        {searchResults.doctors.map((doc) => (
                          <button
                            key={doc._id}
                            onClick={() => handleSelectResult("doctor", doc)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sky-50 transition text-left"
                          >
                            {doc.photoURL ? (
                              <img
                                src={doc.photoURL}
                                alt={doc.name}
                                className="w-9 h-9 rounded-lg object-cover border border-sky-200 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {(doc.name || "D")[0]}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                Dr. {doc.name}
                              </p>
                              <p className="text-xs text-slate-500 truncate">{doc.email}</p>
                            </div>
                            <span className="text-[10px] font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full flex-shrink-0">
                              Doctor
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {searchResults.users.length > 0 && (
                      <div>
                        <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-teal-600">
                          Patients
                        </p>
                        {searchResults.users.map((usr) => (
                          <button
                            key={usr._id}
                            onClick={() => handleSelectResult("user", usr)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition text-left"
                          >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {(usr.name || "U")[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {usr.name || "User"}
                              </p>
                              <p className="text-xs text-slate-500 truncate">{usr.email}</p>
                            </div>
                            <span className="text-[10px] font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full flex-shrink-0">
                              Patient
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-3">
            Results update as you type. Select an entry to view full details.
          </p>
        </div>

        {/* 🔷 STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Doctors */}
          <div className="bg-white rounded-2xl border border-sky-100 shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-100 rounded-lg">
                <FaStethoscope className="text-2xl text-sky-600" />
              </div>
              <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold">
                System
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Doctors
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {doctorsLoading ? "..." : doctorsList.length}
            </p>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-2xl border border-teal-100 shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <FaUsers className="text-2xl text-teal-600" />
              </div>
              <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                System
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Patients
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {usersLoading ? "..." : usersList.length}
            </p>
          </div>

          {/* Appointments Today */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FaCalendarCheck className="text-2xl text-emerald-600" />
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                Today
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">
              Appointments
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {apptsLoading ? "..." : todaysAppointments.length}
            </p>
          </div>
        </div>

        {/* 🔷 QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white rounded-2xl border border-sky-100 shadow-lg p-6 hover:shadow-xl transition text-left">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-slate-900 mb-1">Manage Doctors</h3>
            <p className="text-sm text-slate-600">
              Approve, reject or manage doctor profiles
            </p>
          </button>

          <button className="bg-white rounded-2xl border border-teal-100 shadow-lg p-6 hover:shadow-xl transition text-left">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-bold text-slate-900 mb-1">Manage Patients</h3>
            <p className="text-sm text-slate-600">
              View and manage patient accounts
            </p>
          </button>

          <button className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-6 hover:shadow-xl transition text-left">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-slate-900 mb-1">View Reports</h3>
            <p className="text-sm text-slate-600">
              Analytics and system performance
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;