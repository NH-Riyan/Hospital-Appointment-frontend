import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineLink,
} from "react-icons/hi2"; // Updated to hi2 for consistency
import { TbCurrencyTaka } from "react-icons/tb";
import { MdVerified, MdOutlineEmail } from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";

const HistoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const { data: appointment = {}, isLoading: aptLoading, isError: aptError } = useQuery({
    queryKey: ["historyDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/appointments/${id}`);
      return res.data;
    },
  });

  const { data: doctor = {}, isLoading: doctorLoading } = useQuery({
    queryKey: ["doctor", appointment.doctorId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/doctors/${appointment.doctorId}`);
      return res.data;
    },
    enabled: !!appointment.doctorId,
  });

  const patientEmailFromAppointment = appointment?.patientEmail || appointment?.patient?.email || null;

  const { data: patient = {}, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", patientEmailFromAppointment],
    queryFn: async () => {
      const res = await axiosSecure.get(`/patient/${patientEmailFromAppointment}`);
      return res.data;
    },
    enabled: !!patientEmailFromAppointment,
  });

  const isLoading = aptLoading || doctorLoading || patientLoading;

 if (isLoading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-infinity loading-xl"></span>
        <p className="text-slate-400 text-sm">Loading visit details…</p>
      </div>
    </div>
  );
}

  if (aptError || !appointment.visited) {
    return (
      <div className="min-h-[60vh] bg-white/60 backdrop-blur-xl  flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
          <p className="text-3xl">⚠️</p>
        </div>
        <p className="text-slate-700 font-semibold">Visit record not found</p>
        <button
          onClick={() => navigate("/dashboard/myhistory")}
          className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-sm hover:shadow-md transition-all"
        >
          Back to History
        </button>
      </div>
    );
  }

  const {
    appointmentDate = null,
    note = "",
    reportLink = "", // ✅ GET REPORT LINK
    bookedAt = null,
    fee = "N/A",
    visitingHours = "N/A",
    appointmentType = "general",
    doctorName: aptDoctorName = "N/A",
    doctorPhoto: aptDoctorPhoto = null,
    specialty: aptSpecialty = "N/A",
    doctorEmail: aptDoctorEmail = "N/A",
  } = appointment;

  const {
    name: doctorName = aptDoctorName,
    photoURL: doctorPhoto = aptDoctorPhoto,
    specialty = aptSpecialty,
    email: doctorEmail = aptDoctorEmail,
  } = doctor;

  const patientName = patient?.name || appointment?.patientName || "N/A";
  const patientPhoto = patient?.photoURL || appointment?.patientPhoto || null;
  const patientEmail = patient?.email || appointment?.patientEmail || "N/A";

  const appointmentDateObj = appointmentDate ? new Date(appointmentDate) : null;
  const bookedAtObj = bookedAt ? new Date(bookedAt) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            onClick={() => navigate("/dashboard/myhistory")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors mb-3"
          >
            <HiOutlineArrowLeft className="text-sm" />
            Back to History
          </button>
         
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">History Details</h1>
          <p className="text-slate-500 text-sm mt-1">
            Summary of your completed appointment
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border bg-emerald-50 text-emerald-700 border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          VISITED
        </span>
      </div>

      {/* Visit Summary */}
      <div className="bg-white/60 backdrop-blur-xl  rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500" />
        <div className="p-6 md:p-8">
          <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <HiOutlineCalendar className="text-teal-600 text-base" />
            </div>
            Visit Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-blue-100 uppercase tracking-widest mb-1.5">Date</p>
              <p className="text-sm font-bold text-white leading-tight">
                {appointmentDateObj
                  ? appointmentDateObj.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-teal-100 uppercase tracking-widest mb-1.5">Time</p>
              <p className="text-sm font-bold text-white">{visitingHours}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-emerald-100 uppercase tracking-widest mb-1.5">Fee</p>
              <div className="flex items-center gap-0.5">
                <TbCurrencyTaka className="text-white text-sm" />
                <p className="text-sm font-bold text-white">{fee}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-violet-200 uppercase tracking-widest mb-1.5">Type</p>
              <p className="text-sm font-bold text-white capitalize">{appointmentType}</p>
            </div>
          </div>

          {bookedAtObj && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 w-fit">
              <HiOutlineClock className="text-slate-400" />
              <span>
                Booked on{" "}
                <span className="font-semibold text-slate-700">
                  {bookedAtObj.toLocaleString()}
                </span>
              </span>
            </div>
          )}

          {/* ✅ UPDATED: Notes AND Report Link Section */}
          {(note || reportLink) && (
            <div className="my-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              
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
        </div>
      </div>

      {/* Doctor & Patient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white/60 backdrop-blur-xl  rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-teal-400 to-emerald-500" />
          <div className="p-6 md:p-8">
            <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <RiStethoscopeLine className="text-teal-600 text-base" />
              </div>
              Doctor
            </h2>

            <div className="flex items-center gap-5">
              {doctorPhoto ? (
                <img
                  src={doctorPhoto}
                  alt={doctorName}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {doctorName?.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-slate-900">{doctorName}</h3>
                  <MdVerified className="text-blue-500 text-base" />
                </div>
                <span className="inline-block mt-1.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1 rounded-full">
                  {specialty}
                </span>
              </div>
              
            </div>

            <div className="flex items-center gap-3 mt-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <MdOutlineEmail className="text-violet-500 text-base" />
              </div>
              <div className="min-w-0 ">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm font-semibold text-slate-800 break-all">{doctorEmail}</p>
              </div>
            </div>
          </div>
          
        </div>

        <div className="bg-white/60 backdrop-blur-xl  rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-violet-500" />
          <div className="p-6 md:p-8">
            <h2 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <HiOutlineUser className="text-violet-600 text-base" />
              </div>
              Patient
            </h2>

            <div className="flex items-center gap-5 mb-6">
              {patientPhoto ? (
                <img
                  src={patientPhoto}
                  alt={patientName}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {patientName?.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{patientName}</h3>
                <span className="inline-block mt-1.5 text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full">
                  Patient
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3  bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <MdOutlineEmail className="text-violet-500 text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm font-semibold text-slate-800 break-all">{patientEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex justify-center pt-2 pb-6">
        <button
          onClick={() => navigate("/dashboard/myhistory")}
          className="px-12 md:px-20 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:from-blue-700 hover:to-teal-700 transition-all shadow-sm"
        >
          Back to History
        </button>
      </div>
    </div>
  );
};

export default HistoryDetails;