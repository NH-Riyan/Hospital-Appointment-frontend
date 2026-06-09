import React, { useContext, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import { HiArrowLeft, HiOutlineCalendar, HiOutlineClock, HiOutlineUser } from "react-icons/hi";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdVerified, MdOutlineWorkOutline, MdOutlineEmail } from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [isCancelling, setIsCancelling] = useState(false);

  // Get state from navigation (if coming from PatientAppointments)
  const stateData = location.state || {};
  const passedSerialNumber = stateData.serialNumber;
  const passedTotalAppointments = stateData.totalAppointments;

  // Fetch appointment details
  const { data: appointment = {}, isLoading: aptLoading, isError: aptError } = useQuery({
    queryKey: ["appointmentDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/appointments/${id}`);
      return res.data;
    },
  });

  // Fetch doctor info using doctorId
  const { data: doctor = {}, isLoading: doctorLoading } = useQuery({
    queryKey: ["doctor", appointment.doctorId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/doctors/${appointment.doctorId}`);
      return res.data;
    },
    enabled: !!appointment.doctorId,
  });


  // Fetch patient info using email
  const { data: patient = {}, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/patient/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch all appointments for this doctor on this date (only if not coming from PatientAppointments)
  const dateStr = appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().split('T')[0] : null;
  const { data: doctorAppointmentsOnDate = [] } = useQuery({
    queryKey: ["doctorAppointmentsOnDate", appointment.doctorId, dateStr],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor/${appointment.doctorId}?date=${dateStr}`
      );
      // Sort by bookedAt time to get the queue order
      const sorted = (res.data || []).sort((a, b) => {
        return new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime();
      });
      return sorted;
    },
    // Always fetch appointments for the doctor on this date when we have the doctor and date.
    enabled: !!appointment.doctorId && !!dateStr,
  });

  // Use passed data if available, otherwise calculate from fetched data
  const serialNumber = passedSerialNumber || (doctorAppointmentsOnDate.findIndex(
    (a) => a._id === appointment._id
  ) + 1);
  
  const totalAppointments = passedTotalAppointments || doctorAppointmentsOnDate.length;

  // Count visited today (appointments with visited=true on the same date)
  const visitedTodayCount = doctorAppointmentsOnDate.filter((a) => {
    if (!a.visited) return false;
    const aDate = new Date(a.appointmentDate).toISOString().split("T")[0];
    return aDate === dateStr;
  }).length;

  // Helper: check if current time is within visiting hours string (e.g. "09:00 - 12:30")
  const isNowWithinVisitingHours = (visitingHoursStr, appointmentDateIso) => {
    try {
      if (!visitingHoursStr || !appointmentDateIso) return false;
      const aptDate = new Date(appointmentDateIso);
      const now = new Date();
      if (
        aptDate.getFullYear() !== now.getFullYear() ||
        aptDate.getMonth() !== now.getMonth() ||
        aptDate.getDate() !== now.getDate()
      )
        return false;

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

      const tokens = (visitingHoursStr.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/gi) || []).filter(Boolean);
      let startTok = tokens[0];
      let endTok = tokens[1];
      if (!startTok || !endTok) {
        const parts = visitingHoursStr.split("-");
        startTok = startTok || parts[0];
        endTok = endTok || parts[1];
      }

      const startParsed = parseToken(startTok);
      const endParsed = parseToken(endTok);
      if (!startParsed || !endParsed) return false;

      const start = new Date(aptDate);
      start.setHours(startParsed.hh, startParsed.mm, 0, 0);
      const end = new Date(aptDate);
      end.setHours(endParsed.hh, endParsed.mm, 0, 0);

      return now >= start && now <= end;
    } catch (e) {
      return false;
    }
  };


  const isLoading = aptLoading || doctorLoading || patientLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-blue-500" />
          <p className="text-gray-400 text-sm">Loading appointment details…</p>
        </div>
      </div>
    );
  }

  if (aptError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">⚠️</p>
        <p className="text-gray-700 font-bold">Failed to load appointment details</p>
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-primary rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const {
    appointmentDate = null,
    status = "pending",
    note = "",
    bookedAt = null,
    fee = "N/A",
    visitingHours = "N/A",
  } = appointment;

  const {
    name: doctorName = "N/A",
    photoURL: doctorPhoto = null,
    specialty = "N/A",
  } = doctor;

  const {
    name: patientName = "N/A",
    photoURL: patientPhoto = null,
    email: patientEmail = "N/A",
  } = patient;

  const appointmentDateObj = appointmentDate ? new Date(appointmentDate) : null;
  const bookedAtObj = bookedAt ? new Date(bookedAt) : null;


  const handleCancelAppointment = async () => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel It!",
      cancelButtonText: "No, Keep It",
    });

    // Only proceed if user confirmed
    if (!result.isConfirmed) {
      return;
    }

    setIsCancelling(true);

    try {
      await axiosSecure.delete(`/appointments/${id}`);
      await Swal.fire({
        title: "Cancelled!",
        text: "Your appointment has been cancelled successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      const errorMessage = error.response?.data?.message || "Failed to cancel appointment";
      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
  <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
  <div>

    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
      Appointment Details
    </h1>
    <p className="text-gray-500 text-sm mt-1">
      View full information about your booking
    </p>
  </div>

  <span
    className={`px-5 py-2 rounded-full text-xs font-bold shadow-sm ${
      status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : status === "completed"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {status.toUpperCase()}
  </span>
</div>
        {/* Appointment Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Date */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <HiOutlineCalendar className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Date</p>
                <p className="font-semibold text-gray-900">
                  {appointmentDateObj ? appointmentDateObj.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <HiOutlineClock className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Time</p>
                <p className="font-semibold text-gray-900">{visitingHours}</p>
              </div>
            </div>

            {/* Fee */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TbCurrencyTaka className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Fee</p>
                <p className="font-semibold text-gray-900">৳{fee}</p>
              </div>
            </div>

            {/* Booked At */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <HiOutlineClock className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Booked At</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {bookedAtObj ? bookedAtObj.toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Note */}
          {note && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Special Notes</p>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{note}</p>
            </div>
          )}

          {/* Queue Position */}
          <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="px-6 py-2 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-md">
                     <p className="text-xs font-bold text-white uppercase mb-2">Patients Position in Queue</p>
                    Serial Number : {serialNumber}
                  </div>
                   {isNowWithinVisitingHours(visitingHours, appointment.appointmentDate) && (
                    <div className="ml-3 px-6 py-2 rounded-lg bg-green-800 text-sm font-semibold text-white shadow-sm">
                      Visited today: {visitedTodayCount}
                     </div>
                     )}
               </div>
            </div>

        </div>

        {/* Doctor & Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Doctor Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <RiStethoscopeLine className="text-green-600 text-2xl" />
              Doctor Information
            </h2>

            <div className="flex flex-col items-center text-center mb-6">
              {doctorPhoto ? (
                <img
                  src={doctor.photoURL}
                  alt={doctorName}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg mb-4 ring-4 ring-green-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 ring-4 ring-green-100">
                  {doctorName?.charAt(0)}
                </div>
              )}
              <div className="flex items-center gap-2 justify-center">
                <h3 className="text-2xl font-bold text-gray-900">{doctorName}</h3>
                <MdVerified className="text-blue-500 text-xl" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <RiStethoscopeLine className="text-green-600 text-lg mt-1" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Specialty</p>
                  <p className="font-semibold text-gray-900">{specialty}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HiOutlineUser className="text-purple-600 text-2xl" />
              Patient Information
            </h2>

            <div className="flex flex-col items-center text-center mb-6">
              {patientPhoto ? (
                <img
                  src={patientPhoto}
                  alt={patientName}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg mb-4 ring-4 ring-purple-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4 ring-4 ring-purple-100">
                  {patientName?.charAt(0)}
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900">{patientName}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdOutlineEmail className="text-purple-600 text-lg mt-1" />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{patientEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Appointments
          </button>
          {status === "pending" && (
            <button
              onClick={handleCancelAppointment}
              disabled={isCancelling}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCancelling ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Cancelling...
                </>
              ) : (
                "Cancel Appointment"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
