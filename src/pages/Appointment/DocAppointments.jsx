import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { TbCurrencyTaka } from "react-icons/tb";
import { AuthContext } from "../../Context/AuthContext";

const DocAppointments = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState(null);

  // ✅ Fetch
  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ["docAppointments", user?.email],
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
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}

  // ✅ Helper: get local YYYY-MM-DD key for a date
  const toDateKey = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayKey = toDateKey(new Date());

  // ✅ Drop anything before today — visited or not, it's gone the next day
  const currentAppointments = appointments.filter((a) => {
    if (!a.appointmentDate) return false;
    return toDateKey(a.appointmentDate) === todayKey;
  });

  // ✅ Sort by date + queue
  const sortedAppointments = [...currentAppointments].sort((a, b) => {
    const d1 = new Date(a.appointmentDate).getTime();
    const d2 = new Date(b.appointmentDate).getTime();

    if (d1 !== d2) return d1 - d2;

    return new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime();
  });

  // ✅ Today visited count (TOP SERIAL SECTION)
  const visitedTodayCount = sortedAppointments.filter(
    (a) => a.visited && toDateKey(a.appointmentDate) === todayKey,
  ).length;

  // ✅ Visiting hour check
  // ✅ Visiting hour check — enabled once the doctor's start time arrives,
  // and stays enabled for the rest of that day (doctor may run late).
  const isPastVisitingStart = (visitingHours, appointmentDate) => {
    const now = new Date();
    const aptDate = new Date(appointmentDate);

    if (
      aptDate.getFullYear() !== now.getFullYear() ||
      aptDate.getMonth() !== now.getMonth() ||
      aptDate.getDate() !== now.getDate()
    )
      return false;
    if (!visitingHours) return false;

    const parseToken = (tok) => {
      if (!tok) return null;
      const t = tok.trim().toLowerCase();
      const m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
      if (!m) return null;
      let hh = Number(m[1]);
      const mm = m[2] ? Number(m[2]) : 0;
      const ap = m[3];
      if (ap) {
        if (ap === "pm" && hh < 12) hh += 12;
        if (ap === "am" && hh === 12) hh = 0;
      }
      return { hh, mm };
    };

    const tokens = (
      visitingHours.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi) || []
    ).filter(Boolean);
    let startTok = tokens[0];
    if (!startTok) {
      const parts = visitingHours.split("-");
      startTok = parts[0];
    }

    const startParsed = parseToken(startTok);
    if (!startParsed) return false;

    const start = new Date(aptDate);
    start.setHours(startParsed.hh, startParsed.mm, 0, 0);

    return now >= start;
  };

  // ✅ Mark done
  const handleMarkAsDone = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Mark as Done?",
      text: `Mark ${name}'s appointment as visited?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    setLoadingId(id);

    try {
      await axiosSecure.patch(`/appointments/${id}`, {
        visited: true,
      });

      await Swal.fire("Success", "Marked as visited", "success");
      refetch();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-600 via-white/60 to-cyan-600 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* ───────── HEADER ───────── */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
        
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Doctor Appointment Panel
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {sortedAppointments.length} appointment
              {sortedAppointments.length !== 1 ? "s" : ""} scheduled today
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30">
              <HiOutlineCheckCircle className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none">
                Visited Today
              </p>
              <p className="text-xl font-bold text-slate-900 leading-tight mt-0.5">
                {visitedTodayCount}
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / {sortedAppointments.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ───────── LIST ───────── */}
        {sortedAppointments.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500" />
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="text-teal-500 text-3xl" />
              </div>
              <p className="text-slate-700 font-semibold text-base">
                No appointments found
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Today's schedule will appear here once patients book.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 ">
            {sortedAppointments.map((apt, index) => {
              const isVisited = apt.visited;
              const canMarkNow = isPastVisitingStart(
                apt.visitingHours,
                apt.appointmentDate,
              );

              return (
                <div
                  key={apt._id}
                  className={`group relative bg-white/90 backdrop-blur-xl rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${
                    isVisited
                      ? "border-slate-200"
                      : "border-slate-200 hover:border-teal-200"
                  }`}
                >
                  {/* Left status rail instead of full-width top bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isVisited
                        ? "bg-emerald-400"
                        : "bg-gradient-to-b from-blue-500 via-teal-500 to-emerald-500"
                    }`}
                  />

                  <div className="p-5 pl-6">
                    {/* ── TOP ── */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border flex-shrink-0 ${
                            isVisited
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-gradient-to-br from-blue-100 to-teal-100 text-blue-700 border-slate-200"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-lg md:text-xl truncate">
                            {apt.patientName}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-slate-400 truncate">
                            <HiOutlineUserCircle className="text-sm flex-shrink-0" />
                            {apt.patientEmail}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${
                          isVisited
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${isVisited ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
                        />
                        {isVisited ? "Visited" : "Pending"}
                      </span>
                    </div>

                    {/* ── INFO + ACTIONS ── */}
                    <div className="flex flex-wrap justify-between items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                      {/* LEFT: INFO */}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-400 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700">
                          <HiOutlineCalendar className="text-blue-500 text-sm" />
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-400 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700">
                          <HiOutlineClock className="text-teal-500 text-sm" />
                          {apt.visitingHours}
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-400 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700">
                          <TbCurrencyTaka className="text-emerald-600 text-sm" />
                          {apt.fee}
                        </div>
                      </div>

                      {/* RIGHT: BUTTONS */}
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={() =>
                            navigate(`/appointment-details/${apt._id}`, {
                              state: {
                                appointment: apt,
                                serialNumber: index + 1,
                              },
                            })
                          }
                          className="px-6 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-white hover:bg-blue-600 transition-colors"
                        >
                          Details
                        </button>

                        {!isVisited && (
                          <button
                            onClick={() =>
                              handleMarkAsDone(apt._id, apt.patientName)
                            }
                            disabled={loadingId === apt._id || !canMarkNow}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all whitespace-nowrap ${
                              loadingId === apt._id
                                ? "bg-slate-400"
                                : !canMarkNow
                                  ? "bg-slate-300 cursor-not-allowed"
                                  : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-sm hover:shadow-md active:scale-[0.98]"
                            }`}
                          >
                            {loadingId === apt._id
                              ? "Processing..."
                              : !canMarkNow
                                ? "Not in Time"
                                : "Mark Done"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocAppointments;
