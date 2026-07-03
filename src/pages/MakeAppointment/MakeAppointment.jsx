import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { HiArrowLeft, HiOutlineClock, HiOutlineCalendar, HiOutlineLink } from "react-icons/hi";
import { MdVerified, MdOutlineWorkOutline } from "react-icons/md";
import { RiStethoscopeLine, RiHeartPulseLine } from "react-icons/ri";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaCheckCircle } from "react-icons/fa";

// ── helpers (unchanged) ──────────────────────────────────────────────────────
const daysMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const getWorkingDaysList = (range = "") => {
  const [start, end] = range.toLowerCase().split("-");
  const si = daysMap.indexOf(start?.trim());
  const ei = daysMap.indexOf(end?.trim());
  if (si < 0 || ei < 0) return [];
  return si <= ei
    ? daysMap.slice(si, ei + 1)
    : [...daysMap.slice(si), ...daysMap.slice(0, ei + 1)];
};

const getNext7Days = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

const parseTimeToken = (tok) => {
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

const getVisitingEndTime = (visitingHours, date) => {
  if (!visitingHours) return null;

  const tokens = (
    visitingHours.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi) || []
  ).filter(Boolean);
  let endTok = tokens[1];
  if (!endTok) {
    const parts = visitingHours.split("-");
    endTok = parts[1];
  }

  const endParsed = parseTimeToken(endTok);
  if (!endParsed) return null;

  const end = new Date(date);
  end.setHours(endParsed.hh, endParsed.mm, 0, 0);
  return end;
};

const specialtyGrad = {
  Cardiology: "from-green-600   to-cyan-500",
  Neurology: "from-violet-600 to-purple-500",
  Dermatology: "from-pink-500   to-fuchsia-400",
  Orthopedics: "from-orange-500 to-amber-400",
  Pediatrics: "from-yellow-400 to-amber-400",
  "General Medicine": "from-teal-500   to-emerald-400",
  Psychiatry: "from-indigo-600 to-blue-500",
  Radiology: "from-cyan-500   to-sky-400",
  Oncology: "from-fuchsia-600 to-purple-500",
  Physiotherapy: "from-emerald-500 to-teal-400",
};
const defaultGrad = "from-blue-100 to-sky-500";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];

// ── component ─────────────────────────────────────────────────────────────────
const MakeAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient(); // ✅ needed to invalidate caches after booking

  const passedDate = location.state?.date
    ? new Date(location.state.date)
    : null;

  const [selectedDate, setSelectedDate] = useState(passedDate);
  const [note, setNote] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [appointmentType, setAppointmentType] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    data: doctor = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctorAppointment", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/doctors/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const selectedDateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null;
  const { data: appointmentsOnDate = [] } = useQuery({
    queryKey: ["doctorAppointmentsOnDate", id, selectedDateStr],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor/${id}?date=${selectedDateStr}`,
      );
      return res.data || [];
    },
    enabled: !!selectedDateStr,
  });

  const {
    name = "Doctor",
    specialty = "General Medicine",
    photoURL,
    visitingHours = "",
    workingDays = "",
    fee = "",
    experience = "",
    verified = true,
    email: doctorEmail,
  } = doctor;

  const grad = specialtyGrad[specialty] || defaultGrad;
  const workingDaysList = getWorkingDaysList(workingDays);
  const next7 = getNext7Days();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const Fee = parseInt(fee);
  const calculatedFee =
    appointmentType === "report" ? Math.round(Fee * 0.6) : Fee;

  const isDayWorking = (date) =>
    workingDaysList.includes(daysMap[date.getDay()]);

  const isBookableDay = (date) => {
    if (!isDayWorking(date)) return false;

    const now = new Date();
    const isSameCalendarDay = date.toDateString() === now.toDateString();

    if (isSameCalendarDay) {
      const end = getVisitingEndTime(visitingHours, date);
      if (end && now > end) return false;
    }

    return true;
  };

  // ── submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedDate) return;

    setIsSubmitting(true);
    setError("");

    const appointmentData = {
      patientId: user?.uid || user?._id,
      patientName: user?.displayName || user?.name || "Patient",
      patientPhoto: user?.photoURL || null,
      patientEmail: user?.email,

      doctorId: id,
      doctorName: name,
      doctorPhoto: photoURL || null,
      doctorEmail: doctor?.email || "",

      appointmentDate: selectedDate.toISOString(),
      bookedAt: new Date().toISOString(),
      visitingHours,
      appointmentType,
      fee: calculatedFee,
      normalFee: fee,
      specialty,
      note,
      reportLink,
      visited: false,
    };

    try {
      await axiosSecure.post("/appointments", appointmentData);

      // ✅ Invalidate every cached "doctorAppointmentsOnDate" query for this
      // doctor+date combo, wherever it's cached (this page, PatientAppointments,
      // DocAppointments, etc.) — forces a fresh refetch instead of serving
      // the pre-booking snapshot.
      queryClient.invalidateQueries({
        queryKey: ["doctorAppointmentsOnDate", id, selectedDateStr],
      });

      // ✅ Also invalidate the patient's own appointment list, so it includes
      // the newly booked appointment the moment they land on that page.
      if (user?.email) {
        queryClient.invalidateQueries({
          queryKey: ["patientAppointments", user.email],
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  // ── loading / error ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (isError)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">⚠️</p>
        <p className="text-gray-700 font-bold">Failed to load doctor</p>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-primary rounded-xl"
        >
          Go Back
        </button>
      </div>
    );

  if (submitted)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center mx-auto mb-5 shadow-lg`}
          >
            <FaCheckCircle className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            Appointment Requested!
          </h2>
          <p className="text-gray-500 text-sm mt-2 mb-1">
            with <span className="font-semibold text-gray-700">{name}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {visitingHours && ` · ${visitingHours}`}
          </p>

          {reportLink && (
             <div className="mb-4">
               <a 
                 href={reportLink} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline decoration-dotted"
               >
                 <HiOutlineLink /> View Attached Report
               </a>
             </div>
          )}

          <div className="mb-6 text-left bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-xs font-semibold uppercase">
                Type:
              </span>
              <span className="text-gray-800 font-bold capitalize">
                {appointmentType}
              </span>
            </div>
            {Fee && (
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs font-semibold uppercase">
                  Fee:
                </span>
                <span className="text-gray-800 font-bold">
                  ৳{calculatedFee}
                </span>
              </div>
            )}
          </div>
          <div
            className={`bg-gradient-to-r ${grad} text-white rounded-2xl px-5 py-3 text-sm font-semibold mb-6`}
          >
            Please arrive during: {visitingHours || "your scheduled time"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 btn btn-ghost btn-sm rounded-xl border border-gray-200"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/appointments")}
              className="flex-1 btn btn-sm rounded-xl text-white border-0 bg-gradient-to-r from-blue-600 to-sky-500"
            >
              My Appointments
            </button>
          </div>
        </div>
      </div>
    );

  // ── main (unchanged) ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br m-8 rounded-3xl from-slate-50 via-blue-50 to-indigo-50">
      <div
        className={`bg-gradient-to-br rounded-t-3xl ${grad} relative overflow-hidden shadow-lg`}
      >
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8  w-40 h-40 rounded-full bg-black/5 blur-2xl" />

        <div className="relative max-w-4xl mx-auto px-6 pt-6 pb-24">
          <div className="flex items-center gap-5">
            {photoURL ? (
              <img
                src={photoURL}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-xl shrink-0">
                {initials}
              </div>
            )}
            <div className="text-white">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {name}
                </h1>
                {verified && <MdVerified className="text-white/80 text-xl" />}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-white/80">
                <RiStethoscopeLine />
                <span className="font-medium text-sm">{specialty}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/70">
                {experience && (
                  <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full">
                    <MdOutlineWorkOutline /> {experience} exp
                  </span>
                )}
                {fee && (
                  <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full font-semibold text-white">
                    <TbCurrencyTaka className="text-sm" /> {fee} / visit
                  </span>
                )}
                {visitingHours && (
                  <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full">
                    <HiOutlineClock /> {visitingHours}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 pb-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden backdrop-blur-sm">
          <div className={`h-1 w-full bg-gradient-to-r ${grad}`} />

          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
              Book Your Appointment
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Select your preferred date below to schedule a visit
            </p>

            <div className="mb-7">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <HiOutlineCalendar className="text-lg" />
                Select Date{" "}
                <span className="normal-case font-normal text-gray-400">
                  (next 7 days)
                </span>
              </p>
              <div className="grid grid-cols-7 gap-2">
                {next7.map((date, i) => {
                  const working = isBookableDay(date);
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  const isToday = i === 0;
                  const dayLabel = daysMap[date.getDay()]
                    .slice(0, 2)
                    .toUpperCase();
                  const mon = MONTHS[date.getMonth()];

                  const timeExpiredToday =
                    isToday && isDayWorking(date) && !working;

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!working}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        flex flex-col items-center py-3 px-1 rounded-2xl border text-xs font-semibold transition-all duration-200
                        ${
                          !working
                            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                            : isSelected
                              ? `bg-gradient-to-br ${grad} text-white border-transparent shadow-xl scale-105`
                              : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer"
                        }
                      `}
                    >
                      <span className="text-[10px] font-bold opacity-60">
                        {dayLabel}
                      </span>
                      <span className="text-lg font-extrabold mt-0.5 leading-none">
                        {date.getDate()}
                      </span>
                      <span className="text-[9px] opacity-50 mt-0.5">
                        {mon}
                      </span>
                      {isToday && (
                        <span
                          className={`text-[8px] mt-1 font-bold px-1.5 py-0.5 rounded-full
                          ${isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-500"}`}
                        >
                          Today
                        </span>
                      )}
                      {!working && !timeExpiredToday && (
                        <span className="text-[8px] mt-1 text-gray-300">
                          Off
                        </span>
                      )}
                      {timeExpiredToday && (
                        <span className="text-[8px] mt-1 text-gray-300">
                          Time's up
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {visitingHours && (
              <div className="mb-7">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiOutlineClock className="text-lg" />
                  Available Time Slot
                </p>
                <div
                  className={`flex items-center gap-3 bg-gradient-to-r ${grad} rounded-2xl px-5 py-4 text-white shadow-lg`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <HiOutlineClock className="text-xl" />
                  </div>
                  <div>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                      Doctor's visiting hours
                    </p>
                    <p className="text-white font-extrabold text-lg">
                      {visitingHours}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <RiHeartPulseLine className="text-white/40 text-2xl" />
                  </div>
                </div>
              </div>
            )}
            {selectedDate && (
              <div className="mb-7">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiOutlineCalendar className="text-lg" />
                  Current Queue Status
                </p>
                <div
                  className={`rounded-2xl px-5 py-4 border-2 flex items-center justify-between
                  ${
                    appointmentsOnDate.length === 0
                      ? "bg-green-50 border-green-300"
                      : appointmentsOnDate.length < 5
                        ? "bg-blue-50 border-blue-300"
                        : "bg-amber-50 border-amber-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white
                      ${
                        appointmentsOnDate.length === 0
                          ? "bg-green-500"
                          : appointmentsOnDate.length < 5
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                    >
                      {appointmentsOnDate.length}
                    </div>
                    <div>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider
                        ${
                          appointmentsOnDate.length === 0
                            ? "text-green-600"
                            : appointmentsOnDate.length < 5
                              ? "text-blue-600"
                              : "text-amber-600"
                        }`}
                      >
                        Appointments Booked
                      </p>
                      <p
                        className={`font-semibold text-sm
                        ${
                          appointmentsOnDate.length === 0
                            ? "text-green-900"
                            : appointmentsOnDate.length < 5
                              ? "text-blue-900"
                              : "text-amber-900"
                        }`}
                      >
                        {appointmentsOnDate.length === 0
                          ? "No appointments yet - You'll be first!"
                          : appointmentsOnDate.length === 1
                            ? "1 appointment ahead"
                            : `${appointmentsOnDate.length} appointments ahead`}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-bold
                    ${
                      appointmentsOnDate.length === 0
                        ? "text-green-500"
                        : appointmentsOnDate.length < 5
                          ? "text-blue-500"
                          : "text-amber-500"
                    }`}
                  >
                    Your serial number : {appointmentsOnDate.length + 1}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-7 bg-red-50 border border-red-300 rounded-2xl px-5 py-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold mt-0.5 shrink-0">
                  ✕
                </div>
                <div>
                  <p className="font-semibold text-red-800 text-sm">
                    Booking failed
                  </p>
                  <p className="text-red-700 text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                  Additional Note{" "}
                  <span className="normal-case font-normal text-gray-500">
                    (optional)
                  </span>
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Describe symptoms..."
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-colors resize-none"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <HiOutlineLink /> Attach Report Link{" "}
                  <span className="normal-case font-normal text-gray-500">
                    (optional)
                  </span>
                </p>
                <input
                  type="url"
                  value={reportLink}
                  onChange={(e) => setReportLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1 ml-1">
                  Paste a link to previous reports or medical history.
                </p>
              </div>
            </div>

            <div className="mb-7">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                Appointment Type
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 
                  ${
                    appointmentType === "general"
                      ? `bg-gradient-to-br ${grad} border-transparent text-white shadow-lg`
                      : "bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="general"
                      checked={appointmentType === "general"}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-base">General Checkup</p>
                      <p
                        className={`text-sm ${appointmentType === "general" ? "text-white/80" : "text-gray-600"}`}
                      >
                        Regular consultation with doctor
                      </p>
                    </div>
                  </div>
                  {Fee && (
                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-semibold ${appointmentType === "general" ? "text-white/70" : "text-gray-500"}`}
                      >
                        Full Fee
                      </p>
                      <p
                        className={`text-lg font-bold flex items-center ${appointmentType === "general" ? "text-white" : "text-slate-900"}`}
                      >
                        <TbCurrencyTaka className="text-base" />
                        {Fee}
                      </p>
                    </div>
                  )}
                </label>

                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 
                  ${
                    appointmentType === "report"
                      ? `bg-gradient-to-br from-amber-500 to-orange-500 border-transparent text-white shadow-lg`
                      : "bg-white border-gray-300 text-gray-700 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="report"
                      checked={appointmentType === "report"}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-base">Report Review</p>
                      <p
                        className={`text-sm ${appointmentType === "report" ? "text-white/80" : "text-gray-600"}`}
                      >
                        Review existing medical reports
                      </p>
                    </div>
                  </div>
                  {Fee && (
                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-semibold ${appointmentType === "report" ? "text-white/70" : "text-gray-500"}`}
                      >
                        60% Off
                      </p>
                      <p
                        className={`text-lg font-bold flex items-center ${appointmentType === "report" ? "text-white" : "text-slate-900"}`}
                      >
                        <TbCurrencyTaka className="text-base" />
                        {Math.round(Fee * 0.6)}
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {selectedDate && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-6 py-5 mb-7 flex flex-wrap gap-5 items-center shadow-sm">
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <HiOutlineCalendar className="text-lg" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                      Date
                    </p>
                    <p className="font-bold text-sm text-gray-800">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {visitingHours && (
                  <div className="flex items-center gap-3 text-blue-700">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <HiOutlineClock className="text-lg" />
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                        Time
                      </p>
                      <p className="font-bold text-sm text-gray-800">
                        {visitingHours}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 text-blue-700">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MdOutlineWorkOutline className="text-lg" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                      Type
                    </p>
                    <p className="font-bold text-sm text-gray-800 capitalize">
                      {appointmentType}
                    </p>
                  </div>
                </div>
                {Fee && (
                  <div className="flex items-center gap-3 text-blue-700 ml-auto">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <TbCurrencyTaka className="text-lg" />
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                        Fee
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-800">
                          ৳{calculatedFee}
                        </p>
                        {appointmentType === "report" && Fee && (
                          <p className="text-xs text-gray-500 line-through">
                            ৳{Fee}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-sm hover:bg-red-500 hover:border-red-400 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedDate || isSubmitting}
                className={`flex-2 flex-grow-[2] py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    selectedDate && !isSubmitting
                      ? `bg-gradient-to-r ${grad} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-infinity loading-xl"></span>
                  </>
                ) : selectedDate ? (
                  `Confirm Appointment`
                ) : (
                  "Select a date to continue"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAppointment;