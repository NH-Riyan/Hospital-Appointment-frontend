import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import { FaHospital, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import { HiOutlineEye, HiEyeSlash } from "react-icons/hi2";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);

    // Admin Hardcoded Check
    if (email === "admin@gmail.com" && password === "admin12") {
      localStorage.setItem("app_role", "admin");
      localStorage.setItem("app_email", email);
      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const result = await signIn(email, password);
      localStorage.removeItem("app_role");
      
      // Small delay for UX smoothness
      setTimeout(() => {
        navigate(location.state ? location.state : "/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-sky-100/50 blur-3xl"></div>
        <div className="absolute top-[20%] right-[0%] w-[30%] h-[30%] rounded-full bg-teal-100/50 blur-3xl"></div>
        <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-sky-600 to-teal-700 text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FaHospital className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold tracking-wide">MediCare</h2>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Your Health, <br/> <span className="text-emerald-300">Our Priority</span>
            </h1>
            <p className="text-sky-100 text-lg leading-relaxed max-w-md">
             Connect with top-tier specialists, manage your diagnostic history, and book appointments in seconds — all in one secure ecosystem.
            </p>
          </div>

          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <FaUserShield className="text-xl" />
              </div>
              <div>
                <p className="font-bold text-sm">Secure & Private</p>
                <p className="text-xs text-sky-100">Your data is always protected .</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
              <p className="text-slate-500 mt-2">Please enter your details to access your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3.5 text-slate-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'} bg-slate-50 focus:bg-white outline-none transition-all`}
                    placeholder="name@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-3.5 text-slate-400">
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-100'} bg-slate-50 focus:bg-white outline-none transition-all`}
                    placeholder="••••••••"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-sky-600 transition-colors"
                  >
                    {showPassword ?  <HiEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-200 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="loading loading-infinity loading-md"></span>
                ) : (
                  "Sign In to Account"
                )}
              </button>
            </form>

            

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="text-sky-600 font-bold hover:text-teal-600 transition-colors"
              >
                Create free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;