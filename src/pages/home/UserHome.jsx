import React from 'react'
import { FaHospitalUser, FaUser, FaUserDoctor } from 'react-icons/fa6';
import { Card } from '../../component/Card/Card';
import Banner from '../../component/Banner/Banner';
import Reviews from '../../component/Reviews/Reviews';

const UserHome = () => {
  return (
  <div className="bg-gradient-to-br p-6 from-sky-50 via-white to-teal-50 min-h-screen">

    {/* 🔷 HERO / BANNER */}
    <div className="mb-10">
      <Banner />
    </div>

    {/* 🔷 STATS SECTION */}
    <section className="max-w-6xl mx-auto px-6">

      <h3 className="text-3xl font-semibold text-center text-slate-700 mb-10">
        Our Impact in Care 💙
      </h3>

      <div className="grid md:grid-cols-3 gap-6">

        {/* CARD 1 */}
        <div className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition group text-center">
          <FaHospitalUser className="text-4xl text-blue-500 mx-auto mb-3 group-hover:scale-110 transition" />
          <h2 className="text-3xl font-bold text-slate-800">120+</h2>
          <p className="text-slate-500 mt-1">Happy Patients</p>
        </div>

        {/* CARD 2 */}
        <div className="bg-white/70 backdrop-blur-xl border border-teal-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition group text-center">
          <FaUserDoctor className="text-4xl text-teal-500 mx-auto mb-3 group-hover:scale-110 transition" />
          <h2 className="text-3xl font-bold text-slate-800">35+</h2>
          <p className="text-slate-500 mt-1">Expert Doctors</p>
        </div>

        {/* CARD 3 */}
        <div className="bg-white/70 backdrop-blur-xl border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition group text-center">
          <FaUser className="text-4xl text-indigo-500 mx-auto mb-3 group-hover:scale-110 transition" />
          <h2 className="text-3xl font-bold text-slate-800">50+</h2>
          <p className="text-slate-500 mt-1">Support Staff</p>
        </div>

      </div>
    </section>

    {/* 🔷 EXTRA SECTION (NEW 🔥 makes it feel premium) */}
    <section className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-2 gap-6">

      {/* WHY CHOOSE US */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-teal-100">
        <h4 className="text-xl font-semibold text-slate-700 mb-4">
          Why Choose Us?
        </h4>

        <ul className="space-y-3 text-slate-600 text-sm">
          <li>✔ 24/7 Emergency Support</li>
          <li>✔ Certified & Experienced Doctors</li>
          <li>✔ Modern Medical Equipment</li>
          <li>✔ Patient-Centered Care</li>
        </ul>
      </div>

      {/* QUICK ACTION */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
        <h4 className="text-xl font-semibold text-slate-700 mb-4">
          Quick Access
        </h4>

        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
            Book Appointment
          </button>

          <button className="px-4 py-2 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200 transition">
            Find Doctor
          </button>

          <button className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition">
            Contact Us
          </button>
        </div>
      </div>

    </section>

    {/* 🔷 REVIEWS */}
    <div className="mt-16">
      <Reviews />
    </div>

  </div>
);
}

export default UserHome