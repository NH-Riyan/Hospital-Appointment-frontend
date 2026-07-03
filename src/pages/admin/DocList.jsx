import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import Swal from "sweetalert2"; // Assuming you use Swal for alerts
import { 
  FaCircleCheck, 
  FaClock, 
  FaBan, 
  FaStethoscope,
  FaLock
} from "react-icons/fa6";

const DocList = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  
  // ✅ State for Password Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'approve' | 'reject', email: string }
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/doctors");
      return res.data || [];
    },
  });

  // Mutations (No onSuccess here, we handle it manually after auth)
  const approveMutation = useMutation({
    mutationFn: ({ email }) =>
      axiosSecure.put(`/doctor-profile?email=${email}`, { status: "approved" }),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ email }) =>
      axiosSecure.put(`/doctor-profile?email=${email}`, { status: "cancelled" }),
  });

  const allDoctors = doctors;
  const approvedDoctors = doctors.filter((d) => d.status === "approved");
  const pendingDoctors = doctors.filter((d) => d.status === "pending" || !d.status);
  const cancelledDoctors = doctors.filter((d) => d.status === "cancelled");

  let displayed = allDoctors;
  if (filter === "approved") displayed = approvedDoctors;
  if (filter === "pending") displayed = pendingDoctors;
  if (filter === "cancelled") displayed = cancelledDoctors;

  // ✅ Handle Click to Open Modal
  const handleActionClick = (type, email) => {
    setPendingAction({ type, email });
    setAdminPassword("");
    setAuthError("");
    setIsModalOpen(true);
  };

  // ✅ Verify Password and Execute Action
  const verifyAndExecute = async () => {
    // Hardcoded Admin Credentials as requested
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASS = "admin12";

    if (adminPassword !== ADMIN_PASS) {
      setAuthError("Incorrect password. Please try again.");
      return;
    }

    try {
      if (pendingAction.type === "approve") {
        await approveMutation.mutateAsync({ email: pendingAction.email });
        Swal.fire("Success", "Doctor approved successfully!", "success");
      } else {
        await cancelMutation.mutateAsync({ email: pendingAction.email });
        Swal.fire("Success", "Doctor rejected successfully!", "success");
      }
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update doctor status.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">Error loading doctors</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 p-6 md:p-10 relative">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FaStethoscope className="text-3xl text-sky-600" />
            <h1 className="text-4xl font-bold text-slate-900">Doctor Management</h1>
          </div>
          <p className="text-slate-600">Manage and approve doctor profiles</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === "all"
                ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg"
                : "bg-white border border-sky-200 text-sky-600 hover:bg-sky-50"
            }`}
          >
            All ({allDoctors.length})
          </button>

          <button
            onClick={() => setFilter("approved")}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              filter === "approved"
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg"
                : "bg-white border border-green-200 text-green-600 hover:bg-green-50"
            }`}
          >
            <FaCircleCheck /> Approved ({approvedDoctors.length})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              filter === "pending"
                ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg"
                : "bg-white border border-amber-200 text-amber-600 hover:bg-amber-50"
            }`}
          >
            <FaClock /> Pending ({pendingDoctors.length})
          </button>

          <button
            onClick={() => setFilter("cancelled")}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              filter === "cancelled"
                ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            <FaBan /> Cancelled ({cancelledDoctors.length})
          </button>
        </div>

        {/* Cards */}
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No doctors in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl border border-sky-100 shadow-lg hover:shadow-xl transition p-6"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Dr. {doc.name}
                </h2>

                <p className="text-sm text-slate-600 mb-1">{doc.email}</p>

                <p className="text-sm text-sky-600 font-semibold mb-4">
                  {doc.specialty || "General"}
                </p>

                {/* Status */}
                <div className="mb-4">
                  {doc.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <FaCircleCheck /> Approved
                    </span>
                  ) : doc.status === "cancelled" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      <FaBan /> Cancelled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      <FaClock /> Pending
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {doc.status !== "approved" && doc.status !== "cancelled" && (
                    <button
                      onClick={() => handleActionClick("approve", doc.email)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition"
                    >
                      Approve
                    </button>
                  )}

                  {doc.status !== "cancelled" && (
                    <button
                      onClick={() => handleActionClick("reject", doc.email)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition"
                    >
                      Reject
                    </button>
                  )}

                  {doc.status === "cancelled" && (
                    <button
                      onClick={() => handleActionClick("approve", doc.email)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ PASSWORD VERIFICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4 text-slate-800">
              <div className="p-3 bg-sky-100 rounded-full text-sky-600">
                <FaLock className="text-xl" />
              </div>
              <h3 className="text-xl font-bold">Admin Verification</h3>
            </div>
            
            <p className="text-slate-600 mb-6 text-sm">
              Please enter the admin password to 
              <span className="font-bold mx-1">
                {pendingAction?.type === "approve" ? "approve" : "reject"}
              </span> 
              this doctor.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAuthError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && verifyAndExecute()}
                  placeholder="Enter admin password..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                  autoFocus
                />
                {authError && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{authError}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyAndExecute}
                  disabled={!adminPassword}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocList;