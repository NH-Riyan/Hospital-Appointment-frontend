import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import {
  FaHospital,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaUserMd,
  FaCheckCircle,
} from "react-icons/fa";
import { HiOutlineEye, HiEyeSlash } from "react-icons/hi2";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  // Watch password value for validation
  const passwordValue = watch("password");
  const role = watch("role");
  
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [dp, setDP] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const { name, phone, email, password, role } = data;

    try {
      const result = await createUser(email, password);
      if (updateUserProfile && name) {
        await updateUserProfile({ displayName: name, photoURL: dp });
      }

      const userData = { name, phone, email, photoURL: dp, role };
      const endpoint = role === "doctor" ? "/doctors" : "/users";
      await axiosSecure.post(endpoint, userData);

      navigate("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const imgURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`;
      const res = await axios.post(imgURL, formData);
      setDP(res?.data?.data?.display_url || "");
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-100/40 blur-3xl"></div>
        <div className="absolute bottom-[0%] left-[0%] w-[30%] h-[30%] rounded-full bg-sky-100/40 blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 min-h-[550px]">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-sky-600 to-teal-700 text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/10">
                <FaHospital className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide">MediCare</h2>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-4">
              Join Our <br />
              <span className="text-teal-200">Medical Family</span>
            </h1>
            <p className="text-sky-100 text-base leading-relaxed">
              Whether you're a patient seeking care or a doctor providing it,
              your journey starts here.
            </p>
          </div>

          <div className="relative z-10 mt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs font-medium text-sky-50">
              <FaCheckCircle className="text-teal-300" /> Verified Specialists
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-sky-50">
              <FaCheckCircle className="text-teal-300" /> Secure Data Handling
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 py-8 px-6 md:px-10 flex flex-col justify-center bg-white overflow-y-auto custom-scrollbar">
          <div className="max-w-2xl mx-auto w-full"> 
            <div className="text-center lg:text-left mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Create Account
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Fill in your details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-3 top-3 text-slate-400 group-focus-within:text-sky-500 transition-colors text-sm" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
                      placeholder="John Doe"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-[10px] ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Phone
                  </label>
                  <div className="relative group">
                    <FaPhone className="absolute left-3 top-3 text-slate-400 group-focus-within:text-sky-500 transition-colors text-sm" />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
                      placeholder="01XXXXXXXXX"
                      {...register("phone", {
                        required: "Phone is required",
                        pattern: {
                          value: /^01\d{9}$/,
                          message: "Invalid format (01...)",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] ml-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-3 top-3 text-slate-400 group-focus-within:text-sky-500 transition-colors text-sm" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
                      placeholder="name@example.com"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Profile Photo
                  </label>
                  <div className="relative h-[42px]"> 
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full h-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700 file:cursor-pointer file:transition-colors cursor-pointer border border-slate-200 rounded-lg bg-slate-50 flex items-center"
                    />
                    
                    {/* Loading State */}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                        <span className="text-[10px] text-sky-600 font-bold flex items-center gap-1">
                          <span className="loading loading-spinner loading-xs"></span> Uploading...
                        </span>
                      </div>
                    )}

                    {!uploading && dp && (
                       <div className="absolute right-3 top-2.5 text-[10px] text-emerald-600 font-bold pointer-events-none">
                         ✓ Ready
                       </div>
                    )}
                  </div>
                </div>

              </div>

                            {/* Passwords - INDEPENDENT VISIBILITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3 top-3 text-slate-400 text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Required",
                        minLength: { value: 6, message: "Min 6 chars" },
                      })}
                    />
                    {/* Independent Toggle for Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-sky-600"
                    >
                      {showPassword ? <HiEyeSlash className="text-sm"/> : <HiOutlineEye className="text-sm"/>}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[10px] ml-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3 top-3 text-slate-400 text-sm" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full pl-10 pr-10 py-3 rounded-lg border bg-slate-50 focus:bg-white outline-none transition-all text-sm ${
                        errors.confirmPassword 
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                          : "border-slate-200 focus:border-sky-500 focus:ring-sky-100"
                      }`}
                      placeholder="••••••••"
                      {...register("confirmPassword", {
                        required: "Required",
                        validate: (val) => {
                          if (watch("password") != val) return "Passwords do not match";
                        },
                      })}
                    />
                    {/* Independent Toggle for Confirm Password */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-sky-600"
                    >
                      {showConfirmPassword ? <HiEyeSlash className="text-sm"/> : <HiOutlineEye className="text-sm"/>}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-[10px] ml-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div className="pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2 block">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`relative flex flex-col items-center justify-center py-3 border-2 rounded-lg cursor-pointer transition-all ${
                      role === "doctor"
                        ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                        : "border-slate-200 hover:border-sky-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="doctor"
                      className="hidden"
                      {...register("role", { required: "Select type" })}
                    />
                    <FaUserMd
                      className={`text-xl mb-1 ${
                        role === "doctor" ? "text-sky-600" : "text-slate-400"
                      }`}
                    />
                    <span className="font-bold text-sm">Doctor</span>
                    {role === "doctor" && (
                      <FaCheckCircle className="absolute top-2 right-2 text-sky-600 text-xs" />
                    )}
                  </label>

                  <label
                    className={`relative flex flex-col items-center justify-center py-3 border-2 rounded-lg cursor-pointer transition-all ${
                      role === "patient"
                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm"
                        : "border-slate-200 hover:border-teal-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="patient"
                      className="hidden"
                      {...register("role", { required: "Select type" })}
                    />
                    <FaUser
                      className={`text-xl mb-1 ${
                        role === "patient" ? "text-teal-600" : "text-slate-400"
                      }`}
                    />
                    <span className="font-bold text-sm">Patient</span>
                    {role === "patient" && (
                      <FaCheckCircle className="absolute top-2 right-2 text-teal-600 text-xs" />
                    )}
                  </label>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-[10px] mt-1 ml-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 mt-6 text-sm"
              >
                {isSubmitting ? (
                  <span className="loading loading-infinity loading-sm"></span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-slate-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-sky-600 font-bold hover:text-teal-600 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;