import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import {
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";
import { TbCurrencyTaka } from "react-icons/tb";
import { AuthContext } from "../../Context/AuthContext";

const DocAppointments = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState(null);

  // ✅ Fetch
  const { data: appointments = [], refetch } = useQuery({
    queryKey: ["docAppointments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor?email=${user.email}`
      );
      return res.data || [];
    },
  });

  // ✅ Sort by date + queue
  const sortedAppointments = [...appointments].sort((a, b) => {
    const d1 = new Date(a.appointmentDate).getTime();
    const d2 = new Date(b.appointmentDate).getTime();

    if (d1 !== d2) return d1 - d2;

    return new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime();
  });

  // ✅ Today visited count (TOP SERIAL SECTION)
  const todayIso = new Date().toISOString().split("T")[0];
  const visitedTodayCount = sortedAppointments.filter(
    (a) =>
      a.visited &&
      new Date(a.appointmentDate).toISOString().split("T")[0] === todayIso
  ).length;

  // ✅ Visiting hour check
  const isNowWithinVisitingHours = (visitingHours, appointmentDate) => {
    const now = new Date();
    const aptDate = new Date(appointmentDate);

    // compare local date components to avoid timezone string mismatches
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

      // Try to capture time tokens like "12pm" or "09:30 am"
      const tokens = (visitingHours.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi) || []).filter(Boolean);
      let startTok = tokens[0];
      let endTok = tokens[1];
      if (!startTok || !endTok) {
        // fallback: try split by hyphen
        const parts = visitingHours.split("-");
        startTok = startTok || parts[0];
        endTok = endTok || parts[1];
      }

      const startParsed = parseToken(startTok);
      const endParsed = parseToken(endTok);
      if (!startParsed || !endParsed) return false; // unable to parse -> disable by default

      const start = new Date(aptDate);
      start.setHours(startParsed.hh, startParsed.mm, 0, 0);
      const end = new Date(aptDate);
      end.setHours(endParsed.hh, endParsed.mm, 0, 0);

      return now >= start && now <= end;
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
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed",
        "error"
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* ───────── HEADER ───────── */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Doctor Dashboard
          </h1>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md">
            <p className="text-xs opacity-80">Visited Today</p>
            <p className="text-2xl font-bold">{visitedTodayCount}</p>
          </div>
        </div>

        {/* ───────── LIST ───────── */}
        {sortedAppointments.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center shadow">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((apt, index) => {
              const isVisited = apt.visited;
              const canMarkNow = isNowWithinVisitingHours(
                apt.visitingHours,
                apt.appointmentDate
              );

              return (
                <div
                  key={apt._id}
                  className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
                >
                  {/* ── TOP ── */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg text-gray-800">
                        #{index + 1} {apt.patientName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {apt.patientEmail}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        isVisited
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {isVisited ? "Visited" : "Pending"}
                    </span>
                  </div>

                  {/* ── INFO + ACTIONS SAME ROW ── */}
                  <div className="flex justify-between items-center mt-4">

                    {/* LEFT: INFO */}
                    <div className="flex gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <HiOutlineCalendar className="text-blue-500" />
                        {new Date(
                          apt.appointmentDate
                        ).toLocaleDateString()}
                      </span>

                      <span className="flex items-center gap-2">
                        <HiOutlineClock className="text-purple-500" />
                        {apt.visitingHours}
                      </span>

                      <span className="flex items-center gap-2">
                        <TbCurrencyTaka className="text-green-500" />
                        {apt.fee}
                      </span>
                    </div>

                    {/* RIGHT: BUTTONS */}
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/appointment-details/${apt._id}`, {
                            state: {
                              appointment: apt,
                              serialNumber: index + 1,
                            },
                          })
                        }
                        className="px-4 py-2 text-sm rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition"
                      >
                        Details
                      </button>

                      {!isVisited && (
                        <button
                          onClick={() =>
                            handleMarkAsDone(apt._id, apt.patientName)
                          }
                          disabled={
                            loadingId === apt._id || !canMarkNow
                          }
                          className={`px-4 py-2 text-sm rounded-lg text-white ${
                            loadingId === apt._id
                              ? "bg-gray-400"
                              : !canMarkNow
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocAppointments;