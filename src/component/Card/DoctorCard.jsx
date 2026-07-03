import React from "react";
import {
  FaStar,
  FaClock,
  FaCalendar,
} from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const normalizeAvailability = (value) => {
    if (typeof value === "boolean") return value ? "yes" : "no";
    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();
      return normalized === "yes" || normalized === "true" ? "yes" : "no";
    }
    return "no";
  };

  const isAvailable = normalizeAvailability(doctor?.availability) === "yes";

  return (
    <div className="group relative bg-gradient-to-br from-white via-sky-50 to-teal-50 rounded-2xl border border-sky-100 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
      {/* glowing top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />

      {/* Status Badge */}
      {/* <div className="absolute top-4 right-4 z-10">
        {isAvailable ? (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg">
            <FaCircleCheck size={12} /> Available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-slate-400 to-slate-500 text-white text-xs font-semibold rounded-full shadow-md">
            Offline
          </span>
        )}
      </div> */}

      <div className="p-6">
        {/* TOP */}
        <div className="flex gap-4 items-start mb-4">
          {/* IMAGE */}
          <div className="relative flex-shrink-0">
            <img
              src={doctor.photoURL || "https://via.placeholder.com/100"}
              alt={doctor.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-200 shadow-lg group-hover:scale-105 transition"
            />

            <span className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-sky-200">
              <MdVerified className="text-sky-600 text-lg" />
            </span>
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base truncate">
              Dr. {doctor.name}
            </h3>

            <p className="text-sky-600 text-sm font-semibold">
              {doctor.specialty}
            </p>

            <p className="text-slate-500 text-xs mt-2 line-clamp-2">
              {doctor.degrees?.slice(0, 2).join(", ")}
            </p>

            {/* TAGS */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {doctor.experience && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                  {doctor.experience}+ yrs
                </span>
              )}

              {doctor.rating && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                  <FaStar size={10} /> {doctor.rating}
                </span>
              )}

              <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-medium border border-teal-200">
                Verified Doctor
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="border-t border-sky-100 pt-4 mb-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <FaClock className="text-sky-600" />
            {isAvailable ? "Available for appointments" : "Currently unavailable"}
          </div>

          <div className="flex items-center gap-2">
            <FaCalendar className="text-sky-600" />
            {doctor.workingDays || "Schedule not specified"}
          </div>

          {/* <div className="flex items-center gap-2">
            <FaMapPin className="text-teal-600" />
            Clinic Available
          </div> */}

          <div className="flex items-center justify-between pt-2">
            <span>Consultation Fee</span>
            <span className="text-sky-700 font-bold text-sm">
              ৳{doctor.fee || "500"}
            </span>
          </div>
        </div>

        {/* BUTTONS */}
       
          {/* BUTTONS */}
          <div className="flex gap-3">
            {/* PROFILE BUTTON */}
            <button
              onClick={() => navigate(`/doctor/${doctor._id}`)}
              className="
      flex-1 py-2.5 rounded-xl
      border border-sky-500
      text-sky-600 text-sm font-semibold

      transition-all duration-300

      hover:shadow-md
      hover:-translate-y-0.5
    "
            >
              Profile
            </button>

            {/* BOOK BUTTON */}
            <button
              onClick={() => {
                if (!isAvailable) return;
                navigate(`/makeappointment/${doctor._id}`);
              }}
              disabled={!isAvailable}
              className={`
      flex-1 py-2.5 rounded-xl text-sm font-semibold
      transition-all duration-300
      ${
        isAvailable
          ? "bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 text-white hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110"
          : "bg-slate-300 text-slate-600 cursor-not-allowed"
      }
    `}
            >
              {isAvailable ? "Book Now" : "Unavailable"}
            </button>
          
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
