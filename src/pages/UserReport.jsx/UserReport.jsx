import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import Swal from "sweetalert2"; // Import Swal for feedback
import {
  FaFilePdf,
  FaClock,
  FaCheckCircle,
  FaFlask,
  FaCalendarAlt,
  FaCopy,
} from "react-icons/fa";

const UserReport = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'completed'

  // Fetch bookings for THIS specific user
  const { data: myBookings = [], isLoading } = useQuery({
    queryKey: ["myTestBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/test-bookings/my?email=${user.email}`,
      );
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // Filter based on active tab
  const pendingReports = myBookings.filter((b) => b.status !== "completed");
  const completedReports = myBookings.filter((b) => b.status === "completed");

  const currentList =
    activeTab === "pending" ? pendingReports : completedReports;

  // Function to copy PDF link
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "The report link has been copied to your clipboard.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }).catch((err) => {
      console.error("Failed to copy: ", err);
      Swal.fire({
        icon: "error",
        title: "Copy Failed",
        text: "Could not copy the link automatically.",
        toast: true,
        position: "top-end",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-infinity loading-xl text-sky-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-white to-teal-600 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FaFlask className="text-sky-600" />
            My Diagnostic Reports
          </h1>
          <p className="text-slate-500 mt-2">
            Track the status of your lab tests and view results.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-t-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === "pending"
                ? "bg-white text-amber-600 border-t border-x border-slate-200 shadow-sm -mb-[1px]"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
            }`}
          >
            <FaClock className="text-xs" />
            Pending ({pendingReports.length})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 rounded-t-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === "completed"
                ? "bg-white text-emerald-600 border-t border-x border-slate-200 shadow-sm -mb-[1px]"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
            }`}
          >
            <FaCheckCircle className="text-xs" />
            Completed ({completedReports.length})
          </button>
        </div>

        {/* Content Area */}
        {currentList.length === 0 ? (
          <div className="text-center py-20 bg-white/90 rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "pending" ? (
                <FaClock className="text-2xl text-slate-300" />
              ) : (
                <FaCheckCircle className="text-2xl text-slate-300" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              No {activeTab} reports found
            </h3>
            <p className="text-slate-500 mt-1">
              {activeTab === "pending"
                ? "You have no pending test requests."
                : "You haven't received any results yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentList.map((report) => (
              <div
                key={report._id}
                className="bg-white/90 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {new Date(report.bookedAt).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Booking ID: {report._id.slice(-6)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                        report.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                    Tests Requested
                  </p>
                  <ul className="space-y-2 mb-4">
                    {report.tests.map((t, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 flex items-center gap-2 bg-slate-50 p-2 rounded-lg"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        {t.name}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                    <FaCalendarAlt /> Booked on{" "}
                    {new Date(report.bookedAt).toLocaleTimeString()}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                  {report.status === "completed" && report.reportPdf ? (
                    <div className="flex gap-3">
                      {/* View Button */}
                      <a
                        href={report.reportPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-white border border-emerald-200 text-emerald-700 font-bold rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <FaFilePdf /> View Report
                      </a>
                      
                      {/* ✅ NEW: Copy Link Button */}
                      <button
                        onClick={() => handleCopyLink(report.reportPdf)}
                        className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-sky-100 hover:text-sky-600 transition-colors border border-slate-200 flex items-center justify-center"
                        title="Copy Link"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                      <FaClock /> Processing...
                    </div>
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

export default UserReport;