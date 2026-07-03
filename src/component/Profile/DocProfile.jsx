import React, { useContext, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
const specialties = [
  "Cardiology","Neurology","Dermatology","Orthopedics","Pediatrics","General Medicine","Gynecology & Obstetrics","Psychiatry",
  "Radiology","Oncology","Gastroenterology","Endocrinology", "Urology","Nephrology",
  "Pulmonology","Ophthalmology","ENT (Otolaryngology)","Anesthesiology","Plastic Surgery","Physiotherapy",
];

const degreesList = [
  "MBBS","BDS","MD","MS","FCPS","MRCP","FRCS","DO","PhD","DNB","Diploma","MCh",
  "DM"];

const DocProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext) || {};
  const axiosSecure = useAxiosSecure();
  const [specQuery, setSpecQuery] = useState("");
  const [specOpen, setSpecOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const [degQuery, setDegQuery] = useState("");
  const [degOpen, setDegOpen] = useState(false);
  const [selectedDegrees, setSelectedDegrees] = useState([]);

  const filteredSpecialties = specialties.filter((s) => s.toLowerCase().includes(specQuery.toLowerCase()));

  const filteredDegrees = degreesList.filter((d) =>
    d.toLowerCase().includes(degQuery.toLowerCase()),
  );

  const specRef = useRef();
  const degRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (specRef.current && !specRef.current.contains(e.target)) {
        setSpecOpen(false);
      }
      if (degRef.current && !degRef.current.contains(e.target)) {
        setDegOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Specialty select
  const chooseSpecialty = (s) => {
    setSelectedSpecialty(s);
    setValue("specialty", s);
    setSpecQuery("");
    setSpecOpen(false);
  };

  // Add degree
  const addDegree = (d) => {
    if (!selectedDegrees.includes(d)) {
      const updated = [...selectedDegrees, d];
      setSelectedDegrees(updated);
      setValue("degrees", updated);
    }
  };

  // Remove degree
  const removeDegree = (d) => {
    const updated = selectedDegrees.filter((item) => item !== d);
    setSelectedDegrees(updated);
    setValue("degrees", updated);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const merged = { ...(user || {}), ...(profileData || {}) };

  const normalizeAvailability = (value) => {
    if (typeof value === "boolean") return value ? "yes" : "no";
    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();
      return normalized === "yes" || normalized === "true" ? "yes" : "no";
    }
    return "no";
  };

  // ✅ Fetch profile using axiosSecure
  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(
          `/doctor-profile?email=${user.email}`,
        );
        setProfileData(res.data || {});
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, axiosSecure]);


  useEffect(() => {
    if (!loading) {
      
      reset({
        fullName: merged.displayName || merged.name || "",
        email: merged.email || "",
        phone: merged.phone || "",
        specialty: merged.specialty || "",
        degrees: merged.degrees || "",
        experience: merged.experience || "",
        fee: merged.fee || "",
        workingDays: merged.workingDays || "",
        visitingHours: merged.visitingHours || "",
        bio: merged.bio || "",
        availability: normalizeAvailability(merged.availability),
        photoURL: merged.photoURL || "",
      });

      setImageUrl(merged.photoURL || "");

      
      setSelectedSpecialty(merged.specialty || "");
   
      const degs = Array.isArray(merged.degrees)
        ? merged.degrees
        : merged.degrees
        ? [merged.degrees]
        : [];
      setSelectedDegrees(degs);
    }
  }, [loading, profileData, user, reset]);

  useEffect(() => {
    setValue("photoURL", imageUrl);
  }, [imageUrl, setValue]);

  
  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      const url = data?.data?.display_url || "";
      setImageUrl(url);
      try {
        if (updateUserProfile && typeof updateUserProfile === 'function') {
          await updateUserProfile({ photoURL: url });
        }
      } catch (firebaseErr) {
        console.error('Failed to update Firebase profile photo:', firebaseErr);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  
  const submit = async (data) => {
    const payload = {
      name: data.fullName,
      email: user.email,
      phone: data.phone,
      role: "doctor",
      photoURL: data.photoURL,
      specialty: data.specialty || selectedSpecialty || "",
      degrees: Array.isArray(data.degrees) ? data.degrees : data.degrees ? [data.degrees] : selectedDegrees,
      experience: data.experience,
      fee: data.fee,
      workingDays: data.workingDays,
      visitingHours: data.visitingHours,
      bio: data.bio,
      availability: data.availability || "no",
      status: "pending",
    };

    try {
      const res = await axiosSecure.put(
        `/doctor-profile?email=${user.email}`,
        payload,
      );

      const maybe = res?.data;
      const updated = maybe && (maybe.name || maybe.email || maybe.specialty || maybe.fee) ? maybe : payload;
      setProfileData(updated);
     
      reset({
        fullName: updated.name || updated.displayName || "",
        email: updated.email || user.email || "",
        phone: updated.phone || "",
        specialty: updated.specialty || selectedSpecialty || "",
        degrees: updated.degrees || selectedDegrees || [],
        experience: updated.experience || "",
        fee: updated.fee || "",
        workingDays: updated.workingDays || "",
        visitingHours: updated.visitingHours || "",
        bio: updated.bio || "",
        availability: normalizeAvailability(updated.availability),
        photoURL: updated.photoURL || "",
      });
      setImageUrl(updated.photoURL || "");
      setSelectedSpecialty(updated.specialty || selectedSpecialty || "");
      setSelectedDegrees(
        Array.isArray(updated.degrees) ? updated.degrees : updated.degrees ? [updated.degrees] : selectedDegrees,
      );
    } catch (err) {
      console.error("Update failed:", err);
    }

    setEditMode(false);
  };

  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}

  return (
  <div className="max-w-5xl mx-auto p-6">
    <div className="rounded-3xl border border-white/10 bg-white/70 backdrop-blur-2xl shadow-2xl p-8">

      
      <div className="flex flex-col items-center mb-8">
        <div className="w-45 h-45 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
          {imageUrl ? (
            <img src={imageUrl} alt="doctor" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>

        <h2 className="text-2xl font-semibold mt-4 text-slate-700">
          {user?.displayName || "Doctor"}
        </h2>
      </div>

      
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:scale-105 ${
            editMode
              ? "bg-red-500/90 text-white hover:bg-red-600"
              : "bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 text-white"
          }`}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

     
      <form onSubmit={handleSubmit(submit)} className="space-y-6">

       
        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("fullName")}
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 outline-none"
              {...register("email")}
              disabled
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-600">Phone</label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
            {...register("phone")}
            disabled={!editMode}
          />
        </div>

       
        <div className="grid md:grid-cols-2 gap-6">

          <div ref={specRef} className="relative">
            <label className="text-sm text-slate-600">Doctor Specialty</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="Search specialty..."
              value={selectedSpecialty || specQuery}
              onChange={(e) => {
                setSpecQuery(e.target.value);
                setSelectedSpecialty("");
                setSpecOpen(true);
              }}
              onFocus={() => setSpecOpen(true)}
              disabled={!editMode}
            />
            {specOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow max-h-48 overflow-auto z-50">
                {filteredSpecialties.length ? (
                  filteredSpecialties.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => chooseSpecialty(s)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100"
                      disabled={!editMode}
                    >
                      {s}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">No specialties found</div>
                )}
              </div>
            )}
          </div>

          {/* DEGREES */}
          <div ref={degRef} className="relative">
            <label className="text-sm text-slate-600">Degrees</label>

            <div className="flex flex-wrap gap-2 mb-2">
              {selectedDegrees.map((d) => (
                <span
                  key={d}
                  className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center gap-1"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => removeDegree(d)}
                    disabled={!editMode}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="Search degrees..."
              value={degQuery}
              onChange={(e) => {
                setDegQuery(e.target.value);
                setDegOpen(true);
              }}
              onFocus={() => setDegOpen(true)}
              disabled={!editMode}
            />
            {degOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow max-h-48 overflow-auto z-50">
                {filteredDegrees.length ? (
                  filteredDegrees.map((d) => (
                    <div key={d} className="flex items-center justify-between px-3 py-2 hover:bg-gray-100">
                      <span>{d}</span>
                      <button
                        type="button"
                        onClick={() => {
                          addDegree(d);
                          setDegQuery("");
                          setDegOpen(false);
                        }}
                        className="text-teal-600 text-sm"
                        disabled={!editMode || selectedDegrees.includes(d)}
                      >
                        {selectedDegrees.includes(d) ? "Added" : "Add"}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">No degrees found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="text-sm text-slate-600">Experience</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("experience")}
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Fee</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("fee")}
              disabled={!editMode}
            />
          </div>
        </div>

       
        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="text-sm text-slate-600">Working Days</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("workingDays")}
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Visiting Hours</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("visitingHours")}
              disabled={!editMode}
            />
          </div>
        </div>

     
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-slate-600">Availability</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("availability")}
              disabled={!editMode}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600">Bio</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none disabled:bg-slate-100 disabled:text-slate-500"
              {...register("bio")}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* IMAGE */}
        {editMode && (
          <div>
            <label className="text-sm text-slate-600">Profile Image</label>
            <input
              type="file"
              onChange={handleImage}
              className="mt-2 w-full text-sm border border-slate-300 rounded-xl text-slate-600 file:bg-gradient-to-r file:from-indigo-500 file:to-teal-400 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
            />
          </div>
        )}

        {/* SAVE */}
        {editMode && (
          <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:opacity-90 transition">
            Save Profile
          </button>
        )}
      </form>
    </div>
  </div>
);
};

export default DocProfile;
