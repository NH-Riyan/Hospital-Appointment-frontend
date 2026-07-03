import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiChevronRight,
} from "react-icons/hi2";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdVerified } from "react-icons/md"; 
import { FaStethoscope } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";

const AppointmentCard = ({ apt, navigate, axiosSecure }) => {
  const dateStr = new Date(apt.appointmentDate).toISOString().split("T")[0];

  const { data: doctorAppointmentsOnDate = [] } = useQuery({
    queryKey: ["doctorAppointmentsOnDate", apt.doctorId, dateStr],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor/${apt.doctorId}?date=${dateStr}`
      );
      const sorted = (res.data || []).sort(
        (a, b) =>
          new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime()
      );
      return sorted;
    },
    staleTime: 1000 * 60 * 5,
  });

  const serialNumber =
    doctorAppointmentsOnDate.findIndex((a) => a._id === apt._id) + 1;

  return (
    <div className="group bg-white/80 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-100 transition-all duration-300 overflow-hidden relative">
      {/* Decorative Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
          
          {/* Doctor Info Section */}
          <div className="flex items-center gap-4 min-w-[240px]">
            <div className="relative">
              {apt.doctorPhoto ? (
                <img
                  src={apt.doctorPhoto}
                  alt={apt.doctorName}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 flex items-center justify-center text-sky-600 text-2xl font-bold shadow-sm border-2 border-white">
                  {apt.doctorName?.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                <MdVerified className="text-blue-500 text-lg" />
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">
                {apt.doctorName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <FaStethoscope className="text-teal-500 text-sm" />
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {apt.specialty}
                </span>
              </div>
            </div>
          </div>

          {/* Divider for larger screens */}
          <div className="hidden lg:block w-px h-16 bg-slate-100 mx-2" />

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineCalendar className="text-sky-500" /> Date
              </span>
              <span className="font-semibold text-slate-700 text-sm">
                {new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <HiOutlineClock className="text-teal-500" /> Time
              </span>
              <span className="font-semibold text-slate-700 text-sm">
                {apt.visitingHours}
              </span>
            </div>

            {/* Fee */}
            <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <TbCurrencyTaka className="text-emerald-500" /> Fee
              </span>
              <span className="font-semibold text-slate-700 text-sm">
                ৳{apt.fee}
              </span>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex flex-col items-end gap-3 min-w-[160px] w-full lg:w-auto">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Your Serial
              </span>
              <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg shadow-sky-200 font-bold text-lg min-w-[80px] text-center">
                {serialNumber || "-"}
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/appointment-details/${apt._id}`, {
                  state: {
                    serialNumber,
                    totalAppointments: doctorAppointmentsOnDate.length,
                  },
                })
              }
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-sky-600 hover:text-white hover:border-sky-200 transition-all"
            >
              View Details
              <HiChevronRight className="text-xs" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const PatientAppointments = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patientAppointments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/appointments/patient/${user.email}`);
      return res.data || [];
    },
    // ✅ FIX: Refetch data whenever the component mounts or window focuses
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= today && !apt.visited;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <span className="loading loading-infinity loading-xl text-sky-600"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-white to-teal-600  flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
          <p className="text-red-500 font-semibold mb-2">Oops!</p>
          <p className="text-slate-600">Failed to load your appointments.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-sm text-sky-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-white to-teal-600 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div>
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">
              Patient Portal
            </p>
            <h1 className="text-3xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Appointments
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-lg">
              Manage your upcoming consultations. You have{" "}
              <span className="font-bold text-slate-800">
                {filteredAppointments.length}
              </span>{" "}
              scheduled visits.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl  mx-auto px-6 mt-8">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white/80 rounded-3xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineCalendar className="text-sky-400 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Upcoming Appointments
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              You don't have any scheduled visits at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((apt) => (
              <AppointmentCard
                key={apt._id}
                apt={apt}
                navigate={navigate}
                axiosSecure={axiosSecure}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;