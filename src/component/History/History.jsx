import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useUserRole from "../Hooks/useUserRole";
import { AuthContext } from "../../Context/AuthContext";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineClipboardList,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdVerified } from "react-icons/md";

const formatDateHeading = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const HistoryCard = ({ apt, navigate }) => (
  <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500" />

    <div className="p-5 flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
      <div className="flex items-center gap-4 min-w-[240px] w-full md:w-auto">
        {apt.doctorPhoto ? (
          <img
            src={apt.doctorPhoto}
            alt={apt.doctorName}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-slate-200">
            {apt.doctorName?.charAt(0)}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {apt.doctorName}
            </h3>
            <MdVerified className="text-blue-500 text-sm flex-shrink-0" />
          </div>

          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {apt.specialty}
          </p>
        </div>
      </div>

      <div className="hidden md:block w-px h-12 bg-slate-100" />

      <div className="flex-1 grid grid-cols-2 gap-3 w-full">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/40 transition-colors">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Time
          </p>
          <div className="flex items-center justify-center gap-1.5 text-slate-700">
            <HiOutlineClock className="text-base text-blue-500" />
            <p className="text-xs font-bold">{apt.visitingHours}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-teal-100 group-hover:bg-teal-50/40 transition-colors">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Fee
          </p>
          <div className="flex items-center justify-center gap-1.5 text-slate-700">
            <TbCurrencyTaka className="text-base text-teal-600" />
            <p className="text-xs font-bold">{apt.fee}</p>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px h-12 bg-slate-100" />

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 min-w-[140px] w-full md:w-auto">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>

        <button
          onClick={() => navigate(`/dashboard/history-details/${apt._id}`)}
          className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-teal-700 transition-all whitespace-nowrap"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const DoctorHistoryCard = ({ apt, navigate }) => (
  <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
    <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

    <div className="p-5 flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
      <div className="flex items-center gap-4 min-w-[240px] w-full md:w-auto">
        {apt.patientPhoto ? (
          <img
            src={apt.patientPhoto}
            alt={apt.patientName}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-violet-700 font-bold text-lg border border-slate-200">
            {apt.patientName?.charAt(0) || "P"}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-slate-900 text-sm truncate">
              {apt.patientName || "Patient"}
            </h3>
            <MdVerified className="text-violet-500 text-sm flex-shrink-0" />
          </div>

          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {apt.patientEmail || "No email"}
          </p>
        </div>
      </div>

      <div className="hidden md:block w-px h-12 bg-slate-100" />

      <div className="flex-1 grid grid-cols-2 gap-3 w-full">
        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-violet-100 group-hover:bg-violet-50/40 transition-colors">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Date
          </p>
          <div className="flex items-center justify-center gap-1.5 text-slate-700">
            <HiOutlineCalendar className="text-base text-violet-500" />
            <p className="text-xs font-bold">
              {new Date(apt.appointmentDate).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100 group-hover:border-fuchsia-100 group-hover:bg-fuchsia-50/40 transition-colors">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
            Time
          </p>
          <div className="flex items-center justify-center gap-1.5 text-slate-700">
            <HiOutlineClock className="text-base text-fuchsia-500" />
            <p className="text-xs font-bold">{apt.visitingHours}</p>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px h-12 bg-slate-100" />

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 min-w-[140px] w-full md:w-auto">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>

        <button
          onClick={() => navigate(`/dashboard/history-details/${apt._id}`)}
          className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm hover:shadow-md hover:from-violet-700 hover:to-fuchsia-700 transition-all whitespace-nowrap"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const History = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { role, loading: roleLoading } = useUserRole();

  // ✅ Patient-search state (doctor only)
  const [emailInput, setEmailInput] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const { data: appointments = [], isLoading: patientLoading } = useQuery({
    queryKey: ["patientHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/appointments/patient/${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  const { data: doctorAppointments = [], isLoading: doctorLoading } = useQuery({
    queryKey: ["doctorHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor?email=${user.email}`,
      );
      return res.data || [];
    },
    enabled: !!user?.email && role === "doctor",
  });

  // ✅ Fetch a specific patient's appointment history with this doctor
  const {
    data: patientSearchResults = [],
    isLoading: searchLoading,
    isError: searchError,
  } = useQuery({
    queryKey: ["doctorPatientSearch", user?.email, searchedEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor/patient/${searchedEmail}?doctorEmail=${user.email}`,
      );
      return res.data || [];
    },
    enabled: !!user?.email && role === "doctor" && !!searchedEmail,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    setSearchedEmail(trimmed);
  };

  const clearSearch = () => {
    setEmailInput("");
    setSearchedEmail("");
  };

  const searchGroupedByDate = useMemo(() => {
    const visited = patientSearchResults
      .filter((apt) => apt.visited === true)
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime(),
      );

    const groups = {};
    visited.forEach((apt) => {
      const date = new Date(apt.appointmentDate);
      const dateKey = date.toLocaleDateString("en-CA");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(apt);
    });

    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime(),
    );
  }, [patientSearchResults]);

  const groupedByDate = useMemo(() => {
    const visited = appointments
      .filter((apt) => apt.visited === true)
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime(),
      );

    const groups = {};
    visited.forEach((apt) => {
      const date = new Date(apt.appointmentDate);
      const dateKey = date.toLocaleDateString("en-CA");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(apt);
    });

    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime(),
    );
  }, [appointments]);

  const doctorGroupedByDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const recent = doctorAppointments
      .filter((apt) => apt.visited === true)
      .filter((apt) => {
        if (!apt.appointmentDate) return false;
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate >= twoDaysAgo && aptDate <= today;
      })
      .sort(
        (a, b) =>
          new Date(b.appointmentDate).getTime() -
          new Date(a.appointmentDate).getTime(),
      );

    const groups = {};
    recent.forEach((apt) => {
      const date = new Date(apt.appointmentDate);
      const dateKey = date.toLocaleDateString("en-CA");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(apt);
    });

    return Object.entries(groups).sort(
      ([dateA], [dateB]) =>
        new Date(dateB).getTime() - new Date(dateA).getTime(),
    );
  }, [doctorAppointments]);

  const totalVisited = groupedByDate.reduce(
    (sum, [, list]) => sum + list.length,
    0,
  );
  const doctorHistoryCount = doctorGroupedByDate.reduce(
    (sum, [, list]) => sum + list.length,
    0,
  );
  const searchResultCount = searchGroupedByDate.reduce(
    (sum, [, list]) => sum + list.length,
    0,
  );
  const isLoading =
    patientLoading || (role === "doctor" && (doctorLoading || roleLoading));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-8 mx-auto">
      {role !== "doctor" && (
        <>
          <div className="mb-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-black">
                  My History
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  A record of your completed appointments
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white">
                  <HiOutlineClipboardList className="text-base" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none">
                    Total Visited
                  </p>
                  <p className="text-lg font-bold text-slate-900 leading-tight">
                    {totalVisited}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            {groupedByDate.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500" />
                <div className="p-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <HiOutlineClipboardList className="text-teal-500 text-3xl" />
                  </div>
                  <p className="text-slate-700 font-semibold text-base">
                    No visit history yet
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Completed appointments will appear here once marked as
                    visited.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {groupedByDate.map(([dateKey, dayAppointments]) => (
                  <section key={dateKey}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                        <HiOutlineCalendar className="text-teal-500 text-lg" />
                        <h2 className="text-base font-bold text-slate-800">
                          {formatDateHeading(dateKey)}
                        </h2>
                      </div>
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        {dayAppointments.length} appointment
                        {dayAppointments.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {dayAppointments.map((apt) => (
                        <HistoryCard
                          key={apt._id}
                          apt={apt}
                          navigate={navigate}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {role === "doctor" && (
        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Recent Patient Visits
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Completed appointments from the last 2 days
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
                <HiOutlineUser className="text-base" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none">
                  Recent Visits
                </p>
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {doctorHistoryCount}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Patient search section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineSearch className="text-blue-500 text-lg" />
              <h3 className="text-sm font-bold text-slate-800">
                Search a Patient's History
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter a patient's email to see all completed appointments they've
              had with you.
            </p>

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!emailInput.trim()}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Search
              </button>

              {searchedEmail && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <HiOutlineX className="text-sm" />
                  Clear
                </button>
              )}
            </form>

            {/* Search results */}
            {searchedEmail && (
              <div className="mt-6">
                {searchLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <span className="loading loading-infinity loading-xl"></span>
                  </div>
                ) : searchError ? (
                  <p className="text-sm text-red-500 text-center py-6">
                    Failed to load this patient's history. Try again.
                  </p>
                ) : searchGroupedByDate.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-700 font-semibold text-sm">
                      No history found
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      No completed appointments between you and {searchedEmail}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>
                        {searchResultCount} completed appointment
                        {searchResultCount !== 1 ? "s" : ""} found for
                      </span>
                      <span className="font-semibold text-slate-700">
                        {searchedEmail}
                      </span>
                    </div>

                    {searchGroupedByDate.map(([dateKey, dayAppointments]) => (
                      <section key={dateKey}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                            <HiOutlineCalendar className="text-violet-500 text-sm" />
                            <h4 className="text-xs font-bold text-slate-700">
                              {formatDateHeading(dateKey)}
                            </h4>
                          </div>
                          <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="grid gap-3">
                          {dayAppointments.map((apt) => (
                            <DoctorHistoryCard
                              key={apt._id}
                              apt={apt}
                              navigate={navigate}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {doctorGroupedByDate.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
              <div className="p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineUser className="text-violet-500 text-3xl" />
                </div>
                <p className="text-slate-700 font-semibold text-base">
                  No recent doctor history
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Your recent completed patient visits will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {doctorGroupedByDate.map(([dateKey, dayAppointments]) => (
                <section key={dateKey}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                      <HiOutlineCalendar className="text-violet-500 text-lg" />
                      <h3 className="text-base font-bold text-slate-800">
                        {formatDateHeading(dateKey)}
                      </h3>
                    </div>
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                      {dayAppointments.length} appointment
                      {dayAppointments.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {dayAppointments.map((apt) => (
                      <DoctorHistoryCard
                        key={apt._id}
                        apt={apt}
                        navigate={navigate}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default History;
