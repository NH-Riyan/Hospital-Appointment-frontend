import React from "react";
import { FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useNavigate } from "react-router";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  console.log(doctor);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const isAvailableToday =
    doctor.workingDays?.includes(today);

  return (
    <div className="group relative bg-gradient-to-r from-green-0 to-green-200 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">

  

      <div className="p-5">

        {/* Top */}
        <div className="flex gap-4 items-center">

          {/* Image */}
          <div className="relative">
            <img
              src={doctor.photoURL || "https://via.placeholder.com/100"}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition duration-300"
            />

            <span className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
              <MdVerified className="text-blue-500 text-sm" />
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">

            <h3 className="font-semibold text-gray-800 text-base truncate">
              {doctor.name}
            </h3>

            <p className="text-blue-600 text-sm font-medium">
              {doctor.specialty}
            </p>

            <p className="text-gray-500 text-xs mt-1 line-clamp-1">
              {doctor.degrees?.slice(0, 3).join(", ")}
            </p>

            <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">

              {doctor.experience && (
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                  {doctor.experience}+ yrs
                </span>
              )}

              {doctor.rating && (
                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full">
                  <FaStar className="text-[10px]" />
                  {doctor.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t pt-3 flex justify-between items-center">

          <p className="text-sm text-gray-600">
            Fee
            <span className="ml-1 font-bold text-blue-600">
              ৳{doctor.fee}
            </span>
          </p>

        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">

          <button
            onClick={() => navigate(`/doctor/${doctor._id}`)}
            className="flex-1 py-2 rounded-xl border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition"
          >
            Profile
          </button>

          <button
            onClick={() => navigate(`/makeappointment/${doctor._id}`)}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold hover:scale-[1.03] active:scale-95 transition"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;