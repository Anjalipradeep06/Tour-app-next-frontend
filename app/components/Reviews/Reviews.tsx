"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getTourReviews } from "@/redux/thunks/reviewThunk";
import { clearReviews, resetReviewState } from "@/redux/slices/reviewSlice";

import StarRating from "@/app/components/StarRating/StarRating";
import ReviewList from "@/app/components/ReviewList/ReviewList";
import ReviewForm from "@/app/components/ReviewForm/ReviewForm";

type ReviewsProps = {
  tourId: string;
  averageRating?: number;
  totalReviews?: number;
};

export default function Reviews({
  tourId,
  averageRating = 0,
  totalReviews = 0,
}: ReviewsProps) {
  const dispatch = useDispatch();

  const { reviews, loading } = useSelector((state: any) => state.review);

  useEffect(() => {
    if (tourId) {
      dispatch(getTourReviews(tourId) as any);
    }

    return () => {
      dispatch(clearReviews());
      dispatch(resetReviewState());
    };
  }, [dispatch, tourId]);

  return (
    <section className="mt-20 pt-16 border-t border-gray-200 max-md:mt-12 max-md:pt-12">
      <div className="flex justify-between items-end gap-8 mb-12 max-md:flex-col max-md:items-start">
        <div>
          <span className="inline-block text-[0.8rem] font-bold uppercase tracking-[1.5px] text-[#003b95]">
            Traveler Feedback
          </span>
          <h2 className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-slate-900">
            Guest Reviews
          </h2>
        </div>

        <div className="flex items-center gap-5 px-6 py-5 bg-white border border-gray-200 rounded-[20px] shadow-[0_8px_24px_rgba(15,23,42,0.05)] max-md:w-full">
          <span className="text-5xl font-extrabold leading-none text-[#003b95] max-md:text-[2.5rem]">
            {Number(averageRating).toFixed(1)}
          </span>

          <div className="flex flex-col gap-2">
            <StarRating value={averageRating} size={18} />

            <span className="text-slate-500 text-[0.95rem]">
              {totalReviews} {totalReviews === 1 ? "verified review" : "verified reviews"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-8 items-start max-lg:grid-cols-1">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_12px_32px_rgba(15,23,42,0.05)] max-md:p-6">
          <ReviewList reviews={reviews} loading={loading?.list} />
        </div>

        <aside className="bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sticky top-[110px] max-lg:static max-md:p-6">
          <ReviewForm tourId={tourId} />
        </aside>
      </div>
    </section>
  );
}