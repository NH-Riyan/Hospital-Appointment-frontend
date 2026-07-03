import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import {
  FaStethoscope,
  FaClipboardList,
  FaAward,
  FaArrowRight,
} from "react-icons/fa6";
import { FaUsers, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";

const DocHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Fetch all appointments for this doctor (same endpoint used in DocAppointments)
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["docHomeAppointments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor?email=${user.email}`,
      );
      return res.data || [];
    },
  });

  if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}

  // ✅ Helper: local YYYY-MM-DD key for a date
  const toDateKey = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayKey = toDateKey(new Date());

  // ✅ Card 1: appointments scheduled today
  const todaysAppointments = appointments.filter(
    (a) => a.appointmentDate && toDateKey(a.appointmentDate) === todayKey,
  );
  const todaysAppointmentCount = todaysAppointments.length;

  // ✅ Card 2: today's appointments that are report reviews
  const todaysReportCount = todaysAppointments.filter(
    (a) => a.appointmentType === "report",
  ).length;

  // ✅ Card 3: unique patients ever treated (visited === true), deduplicated
  const uniquePatientsTreated = new Set(
    appointments
      .filter((a) => a.visited)
      .map((a) => a.patientEmail || a.patientId),
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-700 via-white to-cyan-700 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* 🔷 HERO SECTION */}
        <div className="mb-12">
          <div
            className="rounded-3xl p-12 text-white shadow-2xl 
            bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 
            relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -right-20 blur-3xl"></div>
            <div className="absolute w-64 h-64 bg-white/5 rounded-full bottom-10 left-10 blur-3xl"></div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-wide">
                Doctor Dashboard
              </h1>
              <p className="text-lg opacity-90 font-medium">
                Manage appointments, patients & your practice efficiently
              </p>
            </div>
          </div>
        </div>

        {/* 🔷 STATS SECTION */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Today's Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* APPOINTMENTS TODAY */}
            <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-sky-100 rounded-xl group-hover:scale-110 transition">
                  <FaStethoscope className="text-3xl text-sky-600" />
                </div>
                <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold">
                  Today
                </span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-1">
                {todaysAppointmentCount}
              </h2>
              <p className="text-slate-600 font-medium">Appointments Today</p>
              <p className="text-xs text-slate-500 mt-2">
                Your daily appointment count
              </p>
            </div>

            {/* REPORT REVIEWS TODAY */}
            <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-teal-100 rounded-xl group-hover:scale-110 transition">
                  <FaClipboardList className="text-3xl text-teal-600" />
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                  Action Needed
                </span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-1">
                {todaysReportCount}
              </h2>
              <p className="text-slate-600 font-medium">Report Reviews Today</p>
              <p className="text-xs text-slate-500 mt-2">
                Total Report Appointments
              </p>
            </div>

            {/* PATIENTS TREATED (ALL TIME, DEDUPED) */}
            <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl group-hover:scale-110 transition">
                  <FaUsers className="text-3xl text-emerald-600" />
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  Completed
                </span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800 mb-1">
                {uniquePatientsTreated}
              </h2>
              <p className="text-slate-600 font-medium">Patients Treated</p>
              <p className="text-xs text-slate-500 mt-2">All Time Counting</p>
            </div>
          </div>
        </section>

        {/* 🔷 QUICK ACTIONS & TOOLKIT */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* QUICK ACTIONS */}
            <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaArrowRight className="text-sky-600" /> Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/appointments")}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold hover:shadow-lg transition text-left flex items-center justify-between group"
              >
                <span>View Appointment List</span>
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => navigate("/dashboard/myhistory")}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold hover:shadow-lg transition text-left flex items-center justify-between group"
              >
                <span>View Recent History</span>
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => navigate("/dashboard/profile")}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-lg transition text-left flex items-center justify-between group"
              >
                <span>Edit Your Profile</span>
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          {/* YOUR TOOLKIT */}
            <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaClipboardList className="text-amber-500" /> Your Toolkit
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-100 rounded-lg mt-0.5">
                  <FaUsers className="text-sky-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Manage Your Profile
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Keep your specialty, fee, and visiting hours current so
                    patients always see the right details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-100 rounded-lg mt-0.5">
                  <FaClipboardList className="text-teal-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Recent History
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Review appointments from the last two days at a glance,
                    without digging through old records.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg mt-0.5">
                  <FaStethoscope className="text-emerald-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Full Appointment List
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    See every booking in one queue, sorted by time, so you
                    always know who's next.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg mt-0.5">
                  <FaAward className="text-amber-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Appointment Details
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Open any booking to see patient notes, fee breakdown, and
                    visit type before they arrive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocHome;
