import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineTrash,
} from "react-icons/hi";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdVerified } from "react-icons/md";
import { AuthContext } from "../../Context/AuthContext";

// ✅ Appointment Card Component
const AppointmentCard = ({ apt, handleCancelAppointment, navigate, axiosSecure }) => {
  // Get the date in YYYY-MM-DD format
  const dateStr = new Date(apt.appointmentDate).toISOString().split('T')[0];

  // Fetch all appointments for this doctor on this date
  const { data: doctorAppointmentsOnDate = [] } = useQuery({
    queryKey: ["doctorAppointmentsOnDate", apt.doctorId, dateStr],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/doctor/${apt.doctorId}?date=${dateStr}`
      );
      // Sort by bookedAt time to get the queue order
      const sorted = (res.data || []).sort((a, b) => {
        return new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime();
      });
      return sorted;
    },
  });
  console.log('dk')
  console.log("Doctor's appointments on date", doctorAppointmentsOnDate);

  // Find the serial number for this appointment
  const serialNumber = doctorAppointmentsOnDate.findIndex(
    (a) => a._id === apt._id
  ) + 1;

  return (
    <div
      key={apt._id}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border p-5 flex flex-col md:flex-row items-center gap-6"
    >
      {/* Doctor */}
      <div className="flex items-center gap-4 min-w-[220px]">
        {apt.doctorPhoto ? (
          <img
            src={apt.doctorPhoto}
            alt={apt.doctorName}
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-xl font-bold">
            {apt.doctorName?.charAt(0)}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{apt.doctorName}</h3>
            <MdVerified className="text-blue-500" />
          </div>
          <p className="text-sm text-gray-500">{apt.specialty}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 grid grid-cols-3 gap-6 text-sm text-center">
        <div>
          <p className="text-gray-400 text-xs">Date</p>
          <p className="flex items-center justify-center gap-1 font-semibold">
            <HiOutlineCalendar />
            {new Date(apt.appointmentDate).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Time</p>
          <p className="flex items-center justify-center gap-1 font-semibold">
            <HiOutlineClock />
            {apt.visitingHours}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-xs">Fee</p>
          <p className="flex items-center justify-center gap-1 font-semibold">
            <TbCurrencyTaka />
            {apt.fee}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-3 min-w-[180px]">
        <div className="flex flex-col items-center gap-1">
          <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md">
            Serial Number: {serialNumber}
          </span>
          <span className="text-xs text-gray-500">
            {doctorAppointmentsOnDate.length} total appointments
          </span>
        </div>

        <div className="flex gap-2">
          {/* DETAILS */}
          <button
            onClick={() => navigate(`/appointment-details/${apt._id}`, {
              state: {
                serialNumber,
                totalAppointments: doctorAppointmentsOnDate.length
              }
            })}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
          >
            Details
          </button>

          {/* CANCEL */}
          {apt.status === "pending" && (
            <button
              onClick={() => handleCancelAppointment(apt._id)}
              className="px-3 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center gap-1"
            >
              <HiOutlineTrash />
              Cancel
            </button>
          )}
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
    refetch,
  } = useQuery({
    queryKey: ["patientAppointments"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/appointments/patient/${user.email}`
      );
      return res.data || [];
    },
  });

  console.log("All patient appointments", appointments);

  const today = new Date();
today.setHours(0, 0, 0, 0);

const filteredAppointments = appointments.filter((apt) => {
  const aptDate = new Date(apt.appointmentDate);
  aptDate.setHours(0, 0, 0, 0);
  // Exclude past dates and appointments already marked visited by doctor
  return aptDate >= today && !apt.visited;
});

  const handleCancelAppointment = async (appointmentId) => {
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

    try {
      await axiosSecure.delete(`/appointments/${appointmentId}`);
      await Swal.fire({
        title: "Cancelled!",
        text: "Your appointment has been cancelled successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      refetch();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      const errorMessage = error.response?.data?.message || "Failed to cancel appointment";
      await Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load appointments</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Upcoming Appointments
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Here are your scheduled doctor visits
          </p>
        </div>

        {/* List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              No upcoming appointments found
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAppointments.map((apt) => (
              <AppointmentCard
                key={apt._id}
                apt={apt}
                handleCancelAppointment={handleCancelAppointment}
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