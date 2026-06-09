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

 -
  useEffect(() => {
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
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-sky-50 via-blue-50 to-teal-50">
      <div className="w-full max-w-2xl rounded-3xl shadow-xl bg-white/70 backdrop-blur-xl border border-blue-100 p-6">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gradient-to-br from-blue-100 to-teal-100">
            {imageUrl ? (
              <img src={imageUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No Image
              </div>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-slate-700">
            {merged.name || merged.displayName || "User Profile"}
          </h2>
        </div>

       
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition shadow-sm
          ${
            editMode
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90"
          }`}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        
        <form onSubmit={handleSubmit(submit)} className="space-y-5">
        
          <div>
            <label className="text-sm text-slate-600 mb-1 block">
              Full Name
            </label>
            <input
              className="input w-full bg-white/80 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-teal-300 rounded-xl"
              {...register("fullName")}
              disabled={!editMode}
            />
          </div>

         
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Email</label>
            <input
              className="input w-full bg-white/60 border border-blue-100 rounded-xl text-slate-500"
              {...register("email")}
              disabled
            />
          </div>

     
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Phone</label>
            <input
              className="input w-full bg-white/80 border border-blue-100 focus:ring-2 focus:ring-teal-300 rounded-xl"
              {...register("phone")}
              disabled={!editMode}
            />
          </div>

         
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Address</label>
            <input
              className="input w-full bg-white/80 border border-blue-100 focus:ring-2 focus:ring-teal-300 rounded-xl"
              {...register("address")}
              disabled={!editMode}
            />
          </div>

        
          {editMode && (
            <div>
              <label className="text-sm text-slate-600 mb-1 block">
                Profile Image
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full rounded-xl"
                onChange={handleImage}
              />
              {uploading && (
                <p className="text-sm text-teal-500 mt-1">Uploading image...</p>
              )}
            </div>
          )}

          {/* SAVE */}
          {editMode && (
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-500 text-white font-medium shadow-md hover:scale-[1.01] transition">
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
