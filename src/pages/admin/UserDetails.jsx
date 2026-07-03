import React, { useEffect } from "react";
import { 
  FaUserMd, FaEnvelope, FaPhoneAlt, FaGraduationCap, FaBriefcase, FaClock, FaCalendarAlt, 
  FaMoneyBillWave, FaInfoCircle, FaCheckCircle,FaToggleOn,FaToggleOff,
  FaUserCircle, FaPhone, FaIdCard, FaMapMarkerAlt, FaUserTag
} from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router";

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state;

  const isDoctor = user?.role === "doctor";
  const isPatient = user?.role === "patient";

  console.log("UserDetails received user:", user);
  console.log("UserDetails received user:", user?.role);

  // ⚠️ fallback (if no data)
  if (!user) {
    return <p className="text-center mt-10">No user data found</p>;
  }

  if (isPatient) {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Header Banner */}
          <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
            <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-full shadow-lg">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-4 border-white">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50">
                    <FaUserCircle className="text-4xl" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-12 px-8 pb-8">
            
            {/* Name and Role Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-slate-500 mt-1 flex items-center gap-2">
                  <FaUserTag className="text-blue-500 text-sm" />
                  <span className="capitalize">{user.role || 'Patient'}</span>
                </p>
              </div>
             
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Info</h3>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <FaEnvelope className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Email Address</p>
                    <p className="text-slate-800 font-semibold text-sm truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <FaPhone className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                    <p className="text-slate-800 font-semibold text-sm">{user.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Details</h3>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <FaIdCard className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Patient ID</p>
                    <p className="text-slate-800 font-semibold text-sm font-mono">{user._id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Address</p>
                    <p className="text-slate-800 font-semibold text-sm">{user.address || "Not specified"}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

if (isDoctor) {
  // Helper to determine status color
  const isAvailable = user.availability?.toLowerCase() === 'yes' || user.availability?.toLowerCase() === 'true';
  
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-sky-600 via-blue-600 to-teal-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full shadow-lg">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
                    <FaUserMd className="text-3xl" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="pt-16 px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                  Dr. {user.name}
                  {user.verified && <FaCheckCircle className="text-blue-500 text-xl" />}
                </h1>
                <p className="text-lg text-sky-600 font-medium mt-1">{user.specialty || "General Practitioner"}</p>
              </div>
              
              {/* Live Availability Badge in Header */}
              <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm ${
                isAvailable 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}>
                {isAvailable ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                {isAvailable ? "Currently Available" : "Currently Unavailable"}
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Professional Details */}
              <div className="space-y-6">
                
                {/* Credentials Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-sky-500" /> Education & Experience
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Degrees</p>
                      <p className="text-slate-800 font-medium">{user.degrees?.join(", ") || "Not specified"}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500 mb-1">Experience</p>
                      <p className="text-slate-800 font-medium flex items-center gap-2">
                        <FaBriefcase className="text-slate-400 text-xs" />
                        {user.experience ? `${user.experience} Years` : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* About Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FaInfoCircle className="text-sky-500" /> About Doctor
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {user.bio || "No biography available for this doctor."}
                  </p>
                </div>
                {/* Fee Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Consultation Fee</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">৳{user.fee || "0"}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaMoneyBillWave className="text-xl" />
                  </div>
                </div>
              </div>
              

              {/* Right Column: Contact, Availability & Schedule */}
              <div className="space-y-6">
                
                {/* Contact Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaPhoneAlt className="text-teal-500" /> Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaEnvelope className="text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="text-slate-800 font-medium text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaPhoneAlt className="text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="text-slate-800 font-medium text-sm">{user.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 AVAILABILITY SECTION (Important) */}
                <div className={`rounded-2xl p-6 border-2 transition-all ${
                  isAvailable 
                    ? "bg-emerald-50 border-emerald-200 shadow-emerald-100 shadow-lg" 
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isAvailable ? "text-emerald-800" : "text-slate-500"
                    }`}>
                      <FaCalendarAlt className="text-lg" /> Current Availability
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isAvailable 
                        ? "bg-emerald-500 text-white animate-pulse" 
                        : "bg-slate-400 text-white"
                    }`}>
                      {isAvailable ? "OPEN" : "CLOSED"}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300/50">
                      <span className="text-sm font-medium text-slate-600">Status:</span>
                      <span className={`font-bold ${isAvailable ? "text-emerald-700" : "text-slate-500"}`}>
                        {user.availability || "Not Specified"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300/50">
                      <span className="text-sm font-medium text-slate-600">Working Days:</span>
                      <span className="font-bold text-slate-800 text-right max-w-[60%] truncate">
                        {user.workingDays || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Visiting Hours:</span>
                      <span className="font-bold text-slate-800 text-right max-w-[60%] truncate">
                        {user.visitingHours || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  return null;
};

export default UserDetails;