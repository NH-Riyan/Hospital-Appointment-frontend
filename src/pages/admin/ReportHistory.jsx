import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { FaSearch, FaFilePdf, FaUser, FaEnvelope, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const ReportHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch all test bookings
  const { data: allBookings = [], isLoading } = useQuery({
    queryKey: ["allTestBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/test-bookings");
      return res.data || [];
    },
  });

  // Filter logic: Only show completed reports + Search by Email
  const filteredReports = allBookings.filter(booking => {
    const isCompleted = booking.status === 'completed';
    
    // ✅ FIX: Use 'email' instead of 'patientEmail' to match your database schema
    const matchesEmail = booking.email?.toLowerCase().includes(searchEmail.toLowerCase());
    
    // If search is empty, just show completed. If search exists, match both.
    if (searchEmail) {
      return isCompleted && matchesEmail;
    }
    return isCompleted;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-infinity loading-xl text-sky-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FaCheckCircle className="text-emerald-500" />
              Completed Reports History
            </h1>
            <p className="text-slate-500 mt-1">Archive of all submitted diagnostic results.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
          <span className="font-bold text-slate-800">{filteredReports.length}</span> 
          reports found
        </div>

        {/* Grid Layout */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <FaFilePdf className="text-4xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No completed reports found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                
                {/* Card Header */}
                <div className="p-6 border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                        {/* ✅ FIX: Use 'name' instead of 'patientName' */}
                        {report.name?.charAt(0) || "P"}
                      </div>
                      <div>
                        {/* ✅ FIX: Use 'name' instead of 'patientName' */}
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{report.name}</h3>
                        {/* ✅ FIX: Use 'email' instead of 'patientEmail' */}
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <FaEnvelope className="text-[10px]" /> {report.email}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100">
                      Completed
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 flex items-center gap-2"><FaCalendarAlt /> Date</span>
                      <span className="font-semibold text-slate-700">{new Date(report.completedAt || report.bookedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Tests Performed</p>
                      <ul className="space-y-1">
                        {report.tests?.slice(0, 2).map((t, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {t.name}
                          </li>
                        ))}
                        {report.tests?.length > 2 && (
                          <li className="text-xs text-slate-400 italic pl-3">+ {report.tests.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                  {report.reportPdf ? (
                    <a
                      href={report.reportPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <FaFilePdf /> View Final Report
                    </a>
                  ) : (
                    <button disabled className="w-full py-3 bg-slate-200 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                      No PDF Attached
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportHistory;