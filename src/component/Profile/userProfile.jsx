import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import axios from "axios";

const UserProfile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, updateUserProfile } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue } = useForm();

  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const merged = { ...(user || {}), ...(profileData || {}) };

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(`/user-profile?email=${user.email}`);
        setProfileData(res.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, axiosSecure]);

  -useEffect(() => {
    if (!loading) {
      const data = { ...(user || {}), ...(profileData || {}) };

      reset({
        fullName: data.name || data.displayName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        photoURL: data.photoURL || "",
      });

      setImageUrl(data.photoURL || "");
    }
  }, [loading, profileData, reset, user]);

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
        if (updateUserProfile && typeof updateUserProfile === "function") {
          await updateUserProfile({ photoURL: url });
        }
      } catch (firebaseErr) {
        console.error("Failed to update Firebase profile photo:", firebaseErr);
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
      address: data.address,
      role: "patient",
      photoURL: imageUrl,
    };

    try {
      await axiosSecure.put(`/user-profile?email=${user.email}`, payload);

      setProfileData(payload);

      reset({
        fullName: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        photoURL: payload.photoURL,
      });

      setImageUrl(payload.photoURL);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <div className=" relative flex items-center justify-center  p-5 overflow-hidden">
      {/* MAIN CARD */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/70 backdrop-blur-2xl shadow-2xl p-8">
        {/* TOP PROFILE SECTION */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* avatar */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full p-[3px] shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden ">
                {imageUrl ? (
                  <img src={imageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* glow */}
          </div>

          {/* name */}
          <h2 className="mt-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-blue-600 to-slate-800">
            {merged.name || merged.displayName || "User Profile"}
          </h2>

          <p className="text-slate-400 text-sm mt-5">
            Manage your account settings & personal details
          </p>
        </div>

        {/* EDIT BUTTON */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:scale-105 ${
              editMode
                ? "bg-red-500/90 text-white hover:bg-red-600"
                : "bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 text-white"
            }`}
          >
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* FORM CARD AREA */}
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div>
            <label className="text-sm text-slate-600 mb-1 block">
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-300 text-slate-400 focus:ring-2 focus:ring-indigo-400 outline-none"
              {...register("fullName")}
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600  mb-1 block">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-300 text-slate-400"
              {...register("email")}
              disabled
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 mb-1 block">Phone</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-300 text-slate-400 focus:ring-2 focus:ring-indigo-400"
              {...register("phone")}
              disabled={!editMode}
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 b mb-1 block">
              Address
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-slate-300 text-slate-400 focus:ring-2 focus:ring-indigo-400"
              {...register("address")}
              disabled={!editMode}
            />
          </div>

          {/* upload */}
          {editMode && (
            <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5">
              <label className="text-sm text-slate-600">Profile Image</label>

              <input
                type="file"
                className="mt-2 w-full text-sm border border-slate-300 rounded-xl text-slate-300 file:bg-gradient-to-r file:from-indigo-500 file:to-teal-400 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
                onChange={handleImage}
              />

              {uploading && (
                <p className="text-teal-300 text-sm mt-2">Uploading...</p>
              )}
            </div>
          )}

          {/* save */}
          {editMode && (
            <button className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 hover:opacity-90 transition">
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
