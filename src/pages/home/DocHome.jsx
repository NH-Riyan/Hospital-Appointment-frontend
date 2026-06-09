import React from 'react'
import { FaUserDoctor } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa'

const DocHome = () => {
   return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-teal-50 p-10">
          {/* 🔷 HERO SECTION */}
          <div className="max-w-6xl mx-auto mb-10">
            <div
              className="rounded-3xl p-10 text-white shadow-xl 
            bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 
            relative overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-10 -right-10 blur-3xl"></div>
  
              <h1 className="text-4xl font-bold mb-2 tracking-wide">
                Doctor Dashboard 👨‍⚕️
              </h1>
              <p className="text-lg opacity-90">
                Manage patients, appointments & performance easily
              </p>
            </div>
          </div>
  
          {/* 🔷 MAIN SECTION */}
          <section className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-700 mb-8">
              Welcome back, Doctor 👋
            </h3>
  
            {/* 🔷 CARDS */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* APPOINTMENTS */}
              <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-xl border border-blue-100 shadow-lg hover:shadow-xl transition group">
                <div className="flex items-center justify-between mb-4">
                  <FaUserDoctor className="text-3xl text-blue-500 group-hover:scale-110 transition" />
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Today
                  </span>
                </div>
  
                <h2 className="text-3xl font-bold text-slate-800">24</h2>
                <p className="text-slate-500">Appointments</p>
              </div>
  
              {/* REVIEWS */}
              <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-xl border border-teal-100 shadow-lg hover:shadow-xl transition group">
                <div className="flex items-center justify-between mb-4">
                  <FaUser className="text-3xl text-teal-500 group-hover:scale-110 transition" />
                  <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
  
                <h2 className="text-3xl font-bold text-slate-800">5</h2>
                <p className="text-slate-500">Pending Reviews</p>
              </div>
  
              {/* EXTRA CARD (NEW 🔥) */}
              <div className="rounded-2xl p-6 bg-white/70 backdrop-blur-xl border border-indigo-100 shadow-lg hover:shadow-xl transition group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl text-indigo-500 group-hover:scale-110 transition">
                    💊
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    Today
                  </span>
                </div>
  
                <h2 className="text-3xl font-bold text-slate-800">18</h2>
                <p className="text-slate-500">Patients Treated</p>
              </div>
            </div>
  
            {/* 🔷 OPTIONAL EXTRA SECTION */}
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {/* QUICK ACTION */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
                <h4 className="font-semibold text-slate-700 mb-4">
                  Quick Actions
                </h4>
  
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                    View Appointments
                  </button>
  
                  <button className="px-4 py-2 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200 transition">
                    Add Notes
                  </button>
  
                  <button className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition">
                    Reports
                  </button>
                </div>
              </div>
             
            </div>
          </section>
        </div>
      );
}

export default DocHome