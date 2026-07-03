import React, { useEffect, useState } from "react";

import {
  FaHospitalUser,
  FaStethoscope,
  FaClock,
  FaCircleCheck,
  FaAward,
  FaHeartPulse,
  FaArrowRight,
} from "react-icons/fa6";

import Banner from "../../component/Banner/Banner";
import Reviews from "../../component/Reviews/Reviews";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const UserHome = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [patients, setPatients] = useState(0);
  const [doctors, setDoctors] = useState(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const usersRes = await axiosSecure.get("/users");
      const doctorsRes = await axiosSecure.get("/doctors");

      setPatients(usersRes.data.length);
      setDoctors(doctorsRes.data.length);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [axiosSecure]);
   

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-white to-teal-600 relative overflow-hidden  p-9">
      {/* floating gradient blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-indigo-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-teal-400/20 blur-[120px] rounded-full"></div>

      {/* HERO */}
      <div className="relative mb-10">
        <Banner />
      </div>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 bg-clip-text text-transparent">
            Why Choose MediCare?
          </h2>

          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Trusted healthcare platform designed for comfort, speed and
            reliability
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* CARD 1 */}
          <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1 ">
            <div className="text-5xl font-bold text-indigo-600 mb-3">
              {patients ? `${patients}+` : "0+"}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FaHospitalUser className="text-2xl text-indigo-500" />
              <h3 className="font-semibold text-slate-800">Happy Patients</h3>
            </div>
            <p className="text-sm text-slate-500">
              Thousands trust our care daily
            </p>
          </div>

          {/* CARD 2 */}
          <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-sky-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition">
            <div className="text-5xl font-bold text-sky-600 mb-3">
              {doctors ? `${doctors}+` : "0+"}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FaStethoscope className="text-2xl text-sky-500" />
              <h3 className="font-semibold text-slate-800">Expert Doctors</h3>
            </div>
            <p className="text-sm text-slate-500">
              Certified specialists available
            </p>
          </div>

          {/* CARD 3 */}
          <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-teal-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition">
            <div className="text-5xl font-bold text-teal-600 mb-3">50+</div>
            <div className="flex items-center gap-2 mb-2">
              <FaHeartPulse className="text-2xl text-teal-500" />
              <h3 className="font-semibold text-slate-800">Support Staff</h3>
            </div>
            <p className="text-sm text-slate-500">24/7 care & assistance</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <FaAward className="text-3xl text-indigo-600" />
            <h3 className="text-2xl font-bold text-slate-900">
              Why Choose Us?
            </h3>
          </div>

          <ul className="space-y-4">
            {[
              "24/7 Emergency Support",
              "Certified Doctors",
              "Modern Equipment",
              "Patient-Centered Care",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <FaCircleCheck className="text-indigo-600 mt-1" />
                <p className="text-slate-700 text-sm font-medium">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT CTA */}
        <div className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-indigo-100 shadow-md hover:shadow-2xl hover:-translate-y-1">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FaArrowRight className="text-sky-600" /> Quick Actions
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/appointments")}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 text-white font-semibold hover:shadow-lg transition text-left flex items-center justify-between group"
            >
              <span>View Appointment List</span>
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => navigate("/dashboard/myhistory")}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold hover:shadow-lg transition text-left flex items-center justify-between group"
            >
              <span>View Recent History</span>
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => navigate("/dashboard/profile")}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-lg transition text-left flex items-center justify-between group"
            >
              <span>Edit Your Profile</span>
              <FaArrowRight className="group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <div className="mt-16">
        <Reviews />
      </div>
    </div>
  );
};

export default UserHome;
