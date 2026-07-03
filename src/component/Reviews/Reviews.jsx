import React, { useEffect, useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Reviews = () => {
  const axiosSecure = useAxiosSecure();

  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosSecure.get("/reviews");

        // Sort latest first (assuming _id or createdAt exists)
        const sorted = res.data.reverse();

        setReviews(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [axiosSecure]);

  // Show only 3 or all
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            What Our Patients Say
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Real experiences from our patients using our platform.
          </p>
        </div>

        {/* Loading */}
        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-infinity loading-xl"></span>
          </div>
        ) : (
          <>
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-sky-100 shadow-md hover:shadow-2xl transition-all duration-300 p-8 hover:-translate-y-1"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(Math.floor(review.rating || 5))].map((_, i) => (
                      <FaStar key={i} className="text-amber-400" size={18} />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-slate-700 mb-6 italic line-clamp-4">
                    "{review.review}"
                  </p>

                  {/* User */}
                  <div className="flex items-center gap-3 pt-4 border-t border-sky-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-400 to-teal-400 flex items-center justify-center shadow-md">
                      <FaUserCircle className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {review.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {review.specialty || "Patient"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {reviews.length > 3 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 text-black bg-transparent  border border-sky-500 rounded-full shadow-md hover:bg-sky-500 hover:text-white "
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Reviews;
