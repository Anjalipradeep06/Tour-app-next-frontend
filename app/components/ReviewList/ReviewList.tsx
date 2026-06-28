"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";

import { deleteReview } from "@/redux/thunks/reviewThunk";
import StarRating from "@/app/components/StarRating/StarRating";

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getInitials = (name = "Traveler") => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { _id: string; name?: string };
};

type ReviewListProps = {
  reviews?: Review[];
  loading?: boolean;
};

export default function ReviewList({ reviews = [], loading }: ReviewListProps) {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.auth);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this review?")) {
      dispatch(deleteReview(id) as any);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 px-8 text-slate-500">
        Loading reviews…
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="text-center py-16 px-8 text-slate-500">
        <h3 className="text-slate-900 mb-2">No reviews yet</h3>
        <p>Be the first traveler to share your experience.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-6 list-none m-0 p-0">
      {reviews.map((review) => {
        const name = review.user?.name || "Anonymous Traveler";

        // Gate on `mounted` so server + first client render agree
        // (both show no delete button), avoiding a hydration mismatch.
        const canDelete =
          mounted &&
          user &&
          (user._id === review.user?._id || user.role === "admin");

        return (
          <li
            key={review._id}
            className="p-7 border border-gray-200 rounded-[20px] bg-white transition-all duration-300 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
          >
            <div className="flex justify-between gap-4 max-md:flex-col">
              <div className="flex items-start gap-4">
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-blue-50 text-[#003b95] font-bold text-base flex-shrink-0">
                  {getInitials(name)}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-slate-900 text-base font-bold">{name}</span>

                    <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 rounded-full px-3 py-1.5 text-[0.8rem] font-semibold">
                      <FaCheckCircle />
                      Verified traveler
                    </span>
                  </div>

                  <span className="text-slate-500 text-[0.9rem]">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>

              <StarRating value={review.rating} size={16} />
            </div>

            {review.comment && (
              <p className="mt-4 text-slate-700 leading-[1.8]">{review.comment}</p>
            )}

            {canDelete && (
              <button
                onClick={() => handleDelete(review._id)}
                className="mt-5 inline-flex items-center gap-2 bg-transparent border-none text-red-600 text-[0.9rem] font-semibold cursor-pointer hover:text-red-700"
              >
                <FaTrashAlt />
                Delete review
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}