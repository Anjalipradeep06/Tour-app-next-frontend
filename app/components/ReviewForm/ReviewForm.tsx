"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FaLock, FaCheckCircle } from "react-icons/fa";

import { addReview } from "@/redux/thunks/reviewThunk";
import { resetReviewState } from "@/redux/slices/reviewSlice";

import StarRating from "@/app/components/StarRating/StarRating";

type ReviewFormProps = {
  tourId: string;
};

export default function ReviewForm({ tourId }: ReviewFormProps) {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.auth);
  const { loading, error, success } = useSelector((state: any) => state.review);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) return;

    (dispatch(addReview({ tour: tourId, rating, comment }) as any) as Promise<any>).then(
      (res: any) => {
        if (res.meta.requestStatus === "fulfilled") {
          setRating(0);
          setComment("");
        }
      }
    );
  };

  const handleDismissError = () => {
    dispatch(resetReviewState());
  };

  // Avoid hydration mismatch: until mounted, render the same neutral
  // shell on server and client regardless of auth state.
  if (!mounted) {
    return <div className="min-h-[200px]" />;
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-6 items-center text-center py-8 px-4">
        <FaLock className="text-[2.5rem] text-[#003b95]" />

        <h3 className="text-[1.4rem] font-bold text-slate-900 mb-1">Share your experience</h3>

        <p className="text-slate-500 leading-[1.7]">
          Sign in to leave a verified review for this experience.
        </p>

        <Link
          href="/login"
          className="w-full h-[52px] flex items-center justify-center rounded-2xl no-underline bg-[#003b95] text-white font-bold transition-colors duration-200 hover:bg-[#0057b8]"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6 items-center text-center py-8 px-4">
        <FaCheckCircle className="text-5xl text-green-600" />

        <h3 className="text-[1.4rem] font-bold text-slate-900 mb-1">Review submitted</h3>

        <p className="text-slate-500 leading-[1.7]">
          Thanks for sharing your experience with other travelers.
        </p>

        <button
          type="button"
          onClick={() => dispatch(resetReviewState())}
          className="w-full h-[52px] rounded-2xl border-none font-bold cursor-pointer transition-colors duration-200 bg-blue-50 text-[#003b95] hover:bg-blue-100"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h3 className="text-[1.4rem] font-bold text-slate-900 mb-1">Write a review</h3>
        <p className="text-slate-500 leading-[1.7]">
          Your feedback helps fellow travelers choose the right experience.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-slate-700 text-[0.95rem] font-semibold">Your rating</label>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="review-comment" className="text-slate-700 text-[0.95rem] font-semibold">
          Your review
        </label>

        <textarea
          id="review-comment"
          rows={5}
          maxLength={1000}
          placeholder="What did you enjoy most? Share useful details about the guide, itinerary, and overall experience."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full resize-y min-h-[140px] px-[1.1rem] py-4 border border-[#dbe2ea] rounded-2xl bg-white text-[0.95rem] leading-[1.7] text-slate-900 transition-all duration-200 focus:outline-none focus:border-[#003b95] focus:shadow-[0_0_0_4px_rgba(0,59,149,0.12)]"
        />

        <span className="self-end text-[0.85rem] text-slate-400">{comment.length}/1000</span>
      </div>

      {error && (
        <div className="flex justify-between items-center gap-4 px-5 py-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl">
          <span>{error}</span>

          <button
            type="button"
            onClick={handleDismissError}
            className="bg-transparent border-none text-current cursor-pointer text-base"
          >
            ✕
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading?.action || rating === 0}
        className="w-full h-[52px] border-none rounded-2xl text-[0.95rem] font-bold cursor-pointer transition-all duration-200 bg-[#003b95] text-white hover:not-disabled:bg-[#0057b8] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading?.action ? "Posting review..." : "Post review"}
      </button>
    </form>
  );
}