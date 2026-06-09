import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";

const DocList = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  // 🔥 FETCH DOCTORS
  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/doctors");
      return res.data || [];
    },
  });

  // 🔥 APPROVE → status: approved
  const approveMutation = useMutation({
  mutationFn: ({ email }) =>
    axiosSecure.put(`/doctor-profile?email=${email}`, {
      status: "approved",
    }),

  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["doctors"] }),
});

  // 🔥 CANCEL → status: cancelled
  const cancelMutation = useMutation({
    mutationFn: ({ email }) =>
      axiosSecure.put(`/doctor-profile?email=${email}`, { status: "cancelled" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctors"] }),
  });

  // 🔥 GROUPS (STATUS BASED)
  const allDoctors = doctors;

  const approvedDoctors = doctors.filter(
    (d) => d.status === "approved"
  );

  const pendingDoctors = doctors.filter(
    (d) => d.status === "pending" || !d.status
  );

  const cancelledDoctors = doctors.filter(
    (d) => d.status === "cancelled"
  );

  let displayed = allDoctors;

  if (filter === "approved") displayed = approvedDoctors;
  if (filter === "pending") displayed = pendingDoctors;
  if (filter === "cancelled") displayed = cancelledDoctors;

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (isError) return <p className="p-6 text-red-500">Error loading doctors</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* 🔥 FILTER BAR */}
      <div className="flex gap-3 mb-6 flex-wrap">

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-white border"
          }`}
        >
          All ({allDoctors.length})
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-full ${
            filter === "approved"
              ? "bg-green-500 text-white"
              : "bg-white border"
          }`}
        >
          Approved ({approvedDoctors.length})
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-full ${
            filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-white border"
          }`}
        >
          Pending ({pendingDoctors.length})
        </button>

        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-full ${
            filter === "cancelled"
              ? "bg-red-500 text-white"
              : "bg-white border"
          }`}
        >
          Cancelled ({cancelledDoctors.length})
        </button>

      </div>

      {/* 🔥 DOCTOR CARDS */}
      <div className="grid md:grid-cols-3 gap-5">

        {displayed.map((doc) => (
          <div
            key={doc._id}
            className="p-5 rounded-2xl border shadow-sm bg-white hover:shadow-md transition"
          >

            {/* NAME */}
            <h2 className="font-bold text-lg">{doc.name}</h2>
            <p className="text-sm text-gray-500">{doc.email}</p>

            {/* STATUS BADGE */}
            <p className={`mt-2 text-sm font-semibold ${
              doc.status === "approved"
                ? "text-green-600"
                : doc.status === "cancelled"
                ? "text-red-500"
                : "text-yellow-600"
            }`}>
              {doc.status || "pending"}
            </p>

            {/* 🔥 ACTION BUTTONS */}
            <div className="flex gap-2 mt-4">

              {/* APPROVE BUTTON */}
              {doc.status !== "approved" && doc.status !== "cancelled" && (
                <button
                  onClick={() => approveMutation.mutate({ email: doc.email })}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
              )}

              {/* CANCEL BUTTON */}
              {doc.status !== "cancelled" && (
                <button
                  onClick={() => cancelMutation.mutate({ email: doc.email })}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}

              {/* OPTIONAL: Re-approve from cancelled */}
              {doc.status === "cancelled" && (
                <button
                  onClick={() => approveMutation.mutate({ email: doc.email })}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Re-approve
                </button>
              )}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default DocList;