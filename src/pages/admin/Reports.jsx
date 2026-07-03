import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { useNavigate } from "react-router";
import { 
  FaFlask, 
  FaUser, 
  FaCalendarAlt, 
  FaFileMedicalAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaCheck,
  FaClock,
  FaSearch
} from "react-icons/fa";

// Defined Test List
const AVAILABLE_TESTS = [
  { _id: '1', name: 'Complete Blood Count (CBC)', price: 500 },
  { _id: '2', name: 'Lipid Profile', price: 800 },
  { _id: '3', name: 'Liver Function Test (LFT)', price: 750 },
  { _id: '4', name: 'Kidney Function Test (KFT)', price: 700 },
  { _id: '5', name: 'Thyroid Profile (T3, T4, TSH)', price: 1200 },
  { _id: '6', name: 'Blood Sugar (Fasting)', price: 300 },
  { _id: '7', name: 'HbA1c (Diabetes)', price: 600 },
  { _id: '8', name: 'Urine Routine & Microscopy', price: 400 },
  { _id: '9', name: 'Vitamin D Total', price: 1500 },
  { _id: '10', name: 'Vitamin B12', price: 1200 },
  { _id: '11', name: 'CRP (C-Reactive Protein)', price: 550 },
  { _id: '12', name: 'ECG', price: 400 },
  { _id: '13', name: 'Ultrasound (Abdomen)', price: 1800 },
  { _id: '14', name: 'X-Ray Chest PA View', price: 600 },
];

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch All Test Bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["allTestBookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/test-bookings");
      return res.data || [];
    },
  });

  // 2. Fetch All Users
  const { data: users = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data || [];
    },
  });

  // Create a map for quick user lookup
  const userMap = useMemo(() => {
    const map = {};
    users.forEach(u => { map[u.email] = u; });
    return map;
  }, [users]);

  // Prepare options for the custom dropdown
  const testOptions = useMemo(() => {
    return ["All", ...AVAILABLE_TESTS.map(t => t.name).sort()];
  }, []);

  // Filter and Sort Logic
  const filteredBookings = useMemo(() => {
    return bookings
      .filter(booking => {
        // ✅ EXCLUDE COMPLETED REPORTS
        if (booking.status === 'completed') return false;

        // Filter by Test Name
        if (selectedTest === "All") return true;
        return booking.tests?.some(t => t.name === selectedTest);
      })
      .sort((a, b) => new Date(a.bookedAt) - new Date(b.bookedAt));
  }, [bookings, selectedTest]);

  if (bookingsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <span className="loading loading-infinity loading-xl text-sky-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg shadow-sky-200 text-white">
                <FaFileMedicalAlt className="text-2xl" />
              </div>
              Pending Reports
            </h1>
            <p className="text-slate-500 mt-2 ml-1 font-medium">Manage patient test bookings and submit laboratory results.</p>
          </div>

          {/* Custom Cool Dropdown */}
          <div className="relative min-w-[300px]" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Filter by Test</label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-sky-400 px-4 py-3.5 rounded-xl shadow-sm transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 rounded-lg ${selectedTest !== 'All' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'}`}>
                  <FaFlask className="text-sm" />
                </div>
                <span className={`font-semibold truncate ${selectedTest === 'All' ? 'text-slate-500' : 'text-slate-800'}`}>
                  {selectedTest}
                </span>
              </div>
              {isDropdownOpen ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400 group-hover:text-sky-500" />}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-80 overflow-y-auto animate-fade-in-up custom-scrollbar">
                {testOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelectedTest(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      selectedTest === option 
                        ? "bg-sky-50 text-sky-700" 
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="font-medium text-sm">{option}</span>
                    {selectedTest === option && <FaCheck className="text-sky-600 text-xs" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaFlask /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-800">{bookings.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FaClock /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Pending</p>
              <p className="text-2xl font-bold text-slate-800">
                {bookings.filter(b => b.status !== 'completed').length}
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FaCheck /></div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Completed</p>
              <p className="text-2xl font-bold text-slate-800">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-4xl text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No pending reports found</h3>
            <p className="text-slate-500 mt-2">All tests have been processed or no new bookings exist.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => {
              const userInfo = userMap[booking.email] || booking;
              const isCompleted = booking.status === 'completed';
              
              return (
                <div key={booking._id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-sky-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                  
                  {/* Card Header */}
                  <div className="p-6 pb-4 border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-sky-600 font-bold text-xl">
                          {userInfo.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg leading-tight">{userInfo.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <FaUser className="text-[10px]" /> {booking.email}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${
                        isCompleted 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                        {isCompleted ? "Done" : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><FaCalendarAlt /> Date</span>
                        <span className="font-semibold text-slate-700 text-sm">{new Date(booking.bookedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Selected Tests</p>
                        <div className="space-y-2">
                          {booking.tests?.slice(0, 2).map((t, i) => (
                            <div key={i} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-sky-400"></span>
                              {t.name}
                            </div>
                          ))}
                          {booking.tests?.length > 2 && (
                            <p className="text-xs text-slate-400 italic pl-3">+ {booking.tests.length - 2} more tests</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                    <button
                      onClick={() => navigate(`/admin/report-submit/${booking._id}`)}
                      disabled={isCompleted}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCompleted
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-white border border-sky-200 text-sky-600 hover:bg-sky-600 hover:text-white hover:shadow-lg hover:shadow-sky-200/50"
                      }`}
                    >
                      {isCompleted ? "Report Submitted" : "Submit Result"}
                      {!isCompleted && <FaChevronDown className="text-xs -rotate-90" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;