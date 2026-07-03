import React, { useContext, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import {
  HiArrowLeft,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineLink,
} from "react-icons/hi2";
import { TbCurrencyTaka } from "react-icons/tb";
import {
  MdVerified,
  MdOutlineWorkOutline,
  MdOutlineEmail,
} from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";
import useUserRole from "../../component/Hooks/useUserRole";

const AppointmentDetails = () => {
  const { role } = useUserRole();
  const pageBg =
    role === "doctor"
      ? "bg-gradient-to-b from-cyan-700 via-white to-cyan-700"
      : "bg-gradient-to-br from-teal-600 via-white to-teal-600";
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
  const {
    data: appointment = {},
    isLoading: aptLoading,
    isError: aptError,
  } = useQuery({
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

  // Fetch patient info using the appointment's patient email
  const patientEmailFromAppointment =
    appointment?.patientEmail || appointment?.patient?.email || null;

  const { data: patient = {}, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", patientEmailFromAppointment],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/patient/${patientEmailFromAppointment}`,
      );
      return res.data;
    },
    enabled: !!patientEmailFromAppointment,
  });

  // Fetch all appointments for this doctor on this date
  const dateStr = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
    : null;
  const { data: doctorAppointmentsOnDate = [] } = useQuery({
    queryKey: ["doctorAppointmentsOnDate", appointment.doctorId, dateStr],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor/${appointment.doctorId}?date=${dateStr}`,
      );
      const sorted = (res.data || []).sort((a, b) => {
        return new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime();
      });
      return sorted;
    },
    enabled: !!appointment.doctorId && !!dateStr,
  });

  // Use passed data if available, otherwise calculate from fetched data
  const serialNumber =
    passedSerialNumber ||
    doctorAppointmentsOnDate.findIndex((a) => a._id === appointment._id) + 1;

  const totalAppointments =
    passedTotalAppointments || doctorAppointmentsOnDate.length;

  const isLoading = aptLoading || doctorLoading || patientLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (aptError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">⚠️</p>
        <p className="text-gray-700 font-bold">
          Failed to load appointment details
        </p>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-primary rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    appointmentDate = null,
    status = "pending",
    note = "",
    reportLink = "", // ✅ GET REPORT LINK
    bookedAt = null,
    fee = "N/A",
    visitingHours = "N/A",
    appointmentType = "general",
    visited = false,
  } = appointment;

  const {
    name: doctorName = "N/A",
    photoURL: doctorPhoto = null,
    specialty = "N/A",
  } = doctor;

  const patientName = patient?.name || appointment?.patientName || "N/A";
  const patientPhoto = patient?.photoURL || appointment?.patientPhoto || null;
  const patientEmail = patient?.email || appointment?.patientEmail || "N/A";

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
      const errorMessage =
        error.response?.data?.message || "Failed to cancel appointment";
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
    <div className={`min-h-screen ${pageBg}`}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-black">
            <p className="text-md font-semibold tracking-widest uppercase mb-1">
              Appointment Details
            </p>
            <h1 className="text-2xl font-bold">Booking Overview</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              View full information about your booking
            </p>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border ${
              visited
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : status === "pending"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {visited ? "VISITED" : status.toUpperCase()}
          </span>
        </div>

        {/* Appointment Summary */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-teal-400 to-emerald-400" />
          <div className="p-8">
            <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <HiOutlineCalendar className="text-blue-500 text-lg" />
              Appointment Summary
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Date */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-sm font-semibold text-white leading-tight">
                  {appointmentDateObj
                    ? appointmentDateObj.toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              {/* Time */}
              <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-semibold text-teal-100 uppercase tracking-widest mb-1">
                  Time
                </p>
                <p className="text-sm font-semibold text-white">
                  {visitingHours}
                </p>
              </div>

              {/* Fee */}
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-widest mb-1">
                  Fee
                </p>
                <p className="text-sm font-semibold text-white">৳{fee}</p>
              </div>

              {/* Type */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-semibold text-violet-200 uppercase tracking-widest mb-1">
                  Type
                </p>
                <p className="text-sm font-semibold text-white capitalize">
                  {appointmentType}
                </p>
              </div>

              {/* Booked At */}
              <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest mb-1">
                  Booked At
                </p>
                <p className="text-xs font-semibold text-white leading-tight">
                  {bookedAtObj ? bookedAtObj.toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            {/* ✅ UPDATED: Notes AND Report Link Section */}
            {(note || reportLink) && (
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Show Note if exists */}
                {note && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <HiOutlineDocumentText className="text-amber-500" />
                      Patient Notes
                    </h3>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 relative h-full">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-xl"></div>
                      <p className="text-amber-900 text-sm leading-relaxed italic">
                        "{note}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Show Report Link if exists */}
                {reportLink && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <HiOutlineLink className="text-blue-500" />
                      Attached Report
                    </h3>
                    <a 
                      href={reportLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-xl p-5 relative h-full transition-colors group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl group-hover:bg-blue-600"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 text-sm font-medium truncate pr-4">
                          View Attached Document
                        </span>
                        <HiOutlineLink className="text-blue-500 text-lg" />
                      </div>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Queue */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl shadow-sm">
                <div>
                  <p className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest">
                    Queue position
                  </p>
                  <p className="text-base font-bold">Serial : {serialNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor & Patient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor */}
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-teal-100 shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 to-emerald-500" />
            <div className="p-8">
              <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <RiStethoscopeLine className="text-teal-500 text-lg" />
                Doctor Information
              </h2>

              <div className="flex items-center gap-5 mb-6">
                {doctorPhoto ? (
                  <img
                    src={doctor.photoURL}
                    alt={doctorName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                    {doctorName?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {doctorName}
                    </h3>
                    <MdVerified className="text-blue-500 text-base" />
                  </div>
                  <span className="inline-block mt-1 text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-full">
                    {specialty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-100">
                <RiStethoscopeLine className="text-teal-500 text-lg flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">
                    Specialty
                  </p>
                  <p className="text-sm font-semibold text-teal-900">
                    {specialty}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient */}
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-violet-100 shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-600" />
            <div className="p-8">
              <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <HiOutlineUser className="text-violet-500 text-lg" />
                Patient Information
              </h2>

              <div className="flex items-center gap-5 mb-6">
                {patientPhoto ? (
                  <img
                    src={patientPhoto}
                    alt={patientName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                    {patientName?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {patientName}
                  </h3>
                  <span className="inline-block mt-1 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full">
                    Patient
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                <MdOutlineEmail className="text-violet-500 text-lg flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-violet-900 break-all">
                    {patientEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-20 py-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all shadow-sm"
          >
            Back to Appointments
          </button>
          {status === "pending" && !visited && (
            <button
              onClick={handleCancelAppointment}
              disabled={isCancelling}
              className="px-9 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCancelling ? (
                <>
                  <span className="loading loading-infinity loading-xl"></span>
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