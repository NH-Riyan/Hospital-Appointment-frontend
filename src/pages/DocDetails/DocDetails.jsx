import React from "react";
import { useParams, NavLink, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { FaEnvelope, FaPhoneAlt, FaClock } from "react-icons/fa";
import useUserRole from "../../component/Hooks/useUserRole";

const DocDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { role } = useUserRole();

  console.log(role);
  const cardHover =
    "transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl";

  // 🔥 Fetch doctor
  const {
    data: doctor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/doctors/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-spinner text-blue-600 scale-150"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">Failed to load doctor</p>
    );
  }

  // 🔥 Availability Logic
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  const daysMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const getWorkingDays = (input) => {
    if (input.includes("-")) {
      const [start, end] = input
        .split("-")
        .map((d) => d.trim().toLowerCase().slice(0, 3));

      const startIndex = daysMap.indexOf(start);
      const endIndex = daysMap.indexOf(end);

      if (startIndex === -1 || endIndex === -1) return [];

      return startIndex <= endIndex
        ? daysMap.slice(startIndex, endIndex + 1)
        : [...daysMap.slice(startIndex), ...daysMap.slice(0, endIndex + 1)];
    }
    // comma format
    return input.split(",").map((d) => d.trim().toLowerCase().slice(0, 3));
  };

  const isAvailableToday = getWorkingDays(doctor.workingDays).includes(today);

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">

        {/* 🔥 PROFILE CARD */}
        <div
          className={`group backdrop-blur-lg bg-white/70 border border-white/40 rounded-3xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 hover:border-purple-300 ${cardHover}`}
        >
          {/* Image */}
          <div>
            <img
              src={doctor.photoURL}
              alt={doctor.name}
              className="w-44 h-44 rounded-2xl object-cover border-4 border-purple-200 shadow-md"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold capitalize bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Dr. {doctor.name}
            </h1>

            <p className="text-lg font-medium text-indigo-600">
              {doctor.specialty}
            </p>

            {/* Degrees */}
            <div className="flex flex-wrap gap-2 mt-3">
              {doctor.degrees?.map((deg, i) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {deg}
                </span>
              ))}
            </div>

            <span
              className={`absolute top-5 right-5 px-3 py-1 text-xs rounded-full text-white font-semibold
              ${
                isAvailableToday
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : "bg-gradient-to-r from-red-400 to-pink-500"
              }`}
            >
              {isAvailableToday ? "Available" : "Offline"}
            </span>

            {/* ✅ Working Days + Time */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full shadow-sm">
                🗓 {doctor.workingDays}
              </span>

              <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1 rounded-full shadow-sm">
                ⏰ {doctor.visitingHours}
              </span>
            </div>

            {/* Info Cards */}
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-3 rounded-xl shadow-sm">
                🧠 Experience
                <p className="font-semibold text-indigo-700">
                  {doctor.experience}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-3 rounded-xl shadow-sm">
                💰 Fee
                <p className="font-semibold text-green-700">৳{doctor.fee}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 GRID SECTION */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {/* Bio */}
          <div
            className={`bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-md p-6 ${cardHover}`}
          >
            <h2 className="text-xl font-semibold mb-2 text-purple-700">
              About Doctor
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {doctor.bio || "No bio available."}
            </p>
          </div>

          {/* Contact */}
          <div
            className={`bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md p-6 space-y-4 ${cardHover}`}
          >
            <h2 className="text-xl font-semibold text-blue-700">
              Contact Info
            </h2>

            <p className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-pink-500" />
              {doctor.email}
            </p>

            <p className="flex items-center gap-3 text-gray-700">
              <FaPhoneAlt className="text-green-500" />
              {doctor.phone}
            </p>

            <p className="flex items-center gap-3 text-gray-700">
              <FaClock className="text-purple-500" />
              {doctor.visitingHours}
            </p>
          </div>
        </div>

        {role !== "admin" && (
          <div className="mt-10 flex w-2/3 mx-auto flex-col md:flex-row gap-4">
            <NavLink
              to={`/makeappointment/${id}`}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 text-center"
            >
              Book Appointment
            </NavLink>
          </div>
        )}
      </div>
  
  );
};

export default DocDetails;
