import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
  FaStar,
  FaStethoscope,
} from "react-icons/fa";

const DocDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

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
    <div className="flex items-center justify-center min-h-screen">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-50 to-teal-50">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-4">
            Failed to load doctor profile
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const normalizeAvailability = (value) => {
    if (typeof value === "boolean") return value ? "yes" : "no";
    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();
      return normalized === "yes" || normalized === "true" ? "yes" : "no";
    }
    return "no";
  };

  const isDoctorAvailable = normalizeAvailability(doctor?.availability) === "yes";

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-white to-teal-600 py-12 px-4 relative overflow-hidden">
      {/* soft background glow blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-300/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/30 blur-3xl rounded-full"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl p-8 md:p-10 mb-10 transition-all duration-300 hover:shadow-[0_20px_60px_-10px_rgba(0,150,255,0.25)] hover:-translate-y-1">
          <div className="grid md:grid-cols-3 gap-8">
            {/* IMAGE */}
            <div className="md:col-span-1">
              <div className="relative group">
                <img
                  src={doctor.photoURL}
                  alt={doctor.name}
                  className="w-full h-56 object-cover rounded-2xl border-4 border-white shadow-xl group-hover:scale-105 transition duration-500"
                />

                {/* STATUS */}
                <div className="absolute top-4 right-4">
                  {isDoctorAvailable ? (
                    <span className="px-4 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 shadow-lg animate-pulse">
                      ✓ Available
                    </span>
                  ) : (
                    <span className="px-4 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-slate-400 to-slate-600 shadow-md">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                  Dr. {doctor.name}
                </h1>

                <p className="text-lg font-semibold text-sky-600 mt-2 flex items-center gap-2">
                  <FaStethoscope className="text-sky-500" />
                  {doctor.specialty}
                </p>
              </div>

              {/* QUALIFICATIONS */}
              <div className="flex flex-wrap gap-2">
                {doctor.degrees?.map((deg, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-sky-100 via-white to-teal-100 border border-sky-200 shadow-sm hover:scale-105 transition"
                  >
                    {deg}
                  </span>
                ))}
              </div>

              {/* AVAILABILITY SECTION */}
              <div className="mt-6 mr-10">
                {isDoctorAvailable ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-100 via-white to-indigo-100 border border-sky-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-sky-600" />
                        <p className="text-xs font-bold text-sky-700 uppercase tracking-wide">
                          Working Days
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        {doctor.workingDays || "Not specified"}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-100 via-white to-emerald-100 border border-teal-200 shadow-sm hover:shadow-md hover:scale-[1.02]">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-teal-600" />
                        <p className="text-xs font-bold text-teal-700 uppercase tracking-wide">
                          Visiting Hours
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        {doctor.visitingHours || "Not specified"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-200 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-slate-500" />
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Availability
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      Currently unavailable
                    </p>
                  </div>
                )}
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 border border-sky-200 hover:scale-105 transition">
                  <p className="text-xs text-sky-600">Experience</p>
                  <p className="text-2xl font-bold text-sky-800">
                    {doctor.experience}+
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 border border-teal-200 hover:scale-105 transition">
                  <p className="text-xs text-teal-600">Fee</p>
                  <p className="text-2xl font-bold text-teal-800">
                    ৳{doctor.fee}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* ABOUT */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition">
            <h2 className="text-xl font-bold text-sky-700 mb-4">
              About Doctor
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {doctor.bio || "No bio available."}
            </p>
          </div>

          {/* CONTACT */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition">
            <h2 className="text-xl font-bold text-teal-700 mb-6">
              Contact Info
            </h2>

            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3 hover:text-sky-600 transition">
                <FaEnvelope />
                {doctor.email}
              </div>

              <div className="flex items-center gap-3 hover:text-teal-600 transition">
                <FaPhoneAlt />
                {doctor.phone}
              </div>

            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => {
              if (!isDoctorAvailable) return;
              navigate(`/makeappointment/${id}`);
            }}
            disabled={!isDoctorAvailable}
            className={`px-32 py-4 rounded-2xl font-bold shadow-lg transition ${
              isDoctorAvailable
                ? "text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-500 hover:shadow-[0_10px_30px_rgba(0,150,255,0.4)] hover:-translate-y-1"
                : "text-slate-500 bg-slate-300 cursor-not-allowed"
            }`}
          >
            {isDoctorAvailable ? "Book Appointment" : "Currently Unavailable"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-15 py-4 rounded-2xl font-bold border border-sky-300 text-sky-700 bg-white/70 backdrop-blur hover:bg-sky-50 hover:-translate-y-1 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocDetails;
