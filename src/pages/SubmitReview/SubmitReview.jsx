import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../component/Hooks/useAxiosSecure";
import { AuthContext } from "../../Context/AuthContext";
import { FaStar, FaTrash, FaEdit, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const SubmitReview = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 🔹 Load reviews
  const {
    data: reviews = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/reviews", {
        params: { email: user?.email },
      });
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // 🔹 Sort latest first
  const sortedReviews = useMemo(() => {
    return [...reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reviews]);

  // 🔹 Show success message temporarily
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      showError("Please write a review before submitting");
      return;
    }

    const payload = {
      email: user.email,
      name: user.displayName || "Anonymous",
      review: reviewText.trim(),
      rating,
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);

    try {
      await axiosSecure.post("/reviews", payload);
      setReviewText("");
      setRating(5);
      refetch();
      showSuccess("Review submitted successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#f8fbff",
      customClass: {
        popup: "rounded-2xl shadow-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl",
      },
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);

    try {
      await axiosSecure.delete(`/reviews/${id}`);
      refetch();
      showSuccess("Review deleted successfully!");
    } catch (err) {
      console.error(err);
      showError("Failed to delete review. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="loading loading-infinity loading-xl"></span>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-white to-teal-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Reviews</h1>
          <p className="text-gray-600">Share your experience and manage your reviews</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        

        {/* 🔹 Form */}
        <div className="bg-white rounded-2xl max-w-4xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaEdit /> Write a Review
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your Rating</label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className={`transform transition-all duration-200 hover:scale-110 ${
                      rating >= val ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    <FaStar className="text-3xl" />
                  </button>
                ))}
                <span className="ml-3 text-lg font-semibold text-gray-700">
                  {rating}/5
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience... What did you like? What could be improved?"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all resize-none"
                rows={5}
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{reviewText.length}/500 characters</span>
                <span>{!reviewText.trim() && "Required"}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={submitting || !reviewText.trim()}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-infinity loading-xl"></span>
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>

        {/* 🔹 Reviews List */}
        <div className="bg-white rounded-2xl max-w-4xl mx-auto  shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              My Reviews
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {sortedReviews.length}
              </span>
            </h2>
          </div>

          {sortedReviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-300 mb-4">
                <FaStar className="text-2xl inline-block opacity-30" />
              </div>
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedReviews.map((r) => (
                <div
                  key={r._id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{r.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(r.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        {/* Rating Stars Display */}
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-lg ${
                                i < r.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {r.rating}.0
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {r.review}
                      </p>
                    </div>

                    {/* Delete Button - Bottom Right */}
                    <div className="flex sm:flex-col items-end justify-end sm:justify-start">
                      <button
                        onClick={() => handleDelete(r._id.toString())}
                        disabled={deletingId === r._id.toString()}
                        className="group/btn flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete review"
                      >
                        {deletingId === r._id.toString() ? (
                          <>
                           <span className="loading loading-infinity loading-xl"></span>
                            <span className="text-sm">Deleting...</span>
                          </>
                        ) : (
                          <>
                            <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                            <span className="text-sm font-medium hidden sm:inline">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SubmitReview;