"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { getUserBookings } from "@/redux/thunks/bookingThunk";
import { usePolling } from "@/hooks/usePolling";

export default function MyBookings() {
  const dispatch = useDispatch();

  const { bookings = [], loading, error } = useSelector((state: any) => state.booking);

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch(getUserBookings({ page, limit }) as any);
  }, [dispatch, page]);

  usePolling(() => dispatch(getUserBookings({ page, limit }) as any), 8000);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section
        className="relative h-[300px] bg-cover bg-center bg-no-repeat max-md:h-[240px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,22,48,0.55), rgba(8,22,48,0.7)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="h-full flex flex-col justify-center w-[min(92%,1320px)] mx-auto pt-[76px] text-white">
          <p className="text-[#febb02] text-[0.85rem] font-bold tracking-[3px] uppercase mb-3">
            Your Journey
          </p>
          <h1 className="text-[clamp(2.4rem,5vw,3.5rem)] font-extrabold tracking-[-1px]">
            My Trips
          </h1>
        </div>
      </section>

      <div className="px-6 pt-12 pb-20 max-md:px-4 max-md:pt-8 max-md:pb-[60px]">
        {loading.list && (
          <div className="max-w-[1280px] mx-auto py-[60px] px-6 bg-white rounded-3xl text-center text-slate-500 border border-gray-200">
            Loading your trips...
          </div>
        )}

        {error && (
          <div className="max-w-[1280px] mx-auto py-[60px] px-6 bg-white rounded-3xl text-center text-red-600 border border-gray-200">
            {error}
          </div>
        )}

        {!loading.list && bookings.length === 0 && (
          <div className="max-w-[1280px] mx-auto py-[60px] px-6 bg-white rounded-3xl text-center text-slate-500 border border-gray-200">
            No bookings found. Start exploring amazing tours ✈️
          </div>
        )}

        {/* BOOKINGS */}
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
          {bookings.map((b: any) => (
            <div
              key={b._id}
              className="bg-white rounded-[28px] overflow-hidden grid grid-cols-[340px_1fr] border border-gray-200 transition-all duration-300 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)] max-lg:grid-cols-1"
            >
              <div className="relative min-h-[260px] max-lg:h-[260px]">
                <img
                  src={
                    b.tour?.image ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  }
                  alt="tour"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-7 px-8 flex flex-col justify-between max-md:p-[22px]">
                <div className="flex justify-between gap-5 items-start max-md:flex-col">
                  <h2 className="text-[1.6rem] font-bold text-gray-900 leading-[1.3]">
                    {b.tour?.title || "Tour unavailable"}
                  </h2>

                  <span
                    className={`px-[14px] py-2 rounded-full text-[0.75rem] font-bold uppercase tracking-[1px] whitespace-nowrap ${
                      statusStyles[b.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <p className="mt-3.5 text-gray-500 text-base">
                  🌍 {b.tour?.location || "International Destination"}
                </p>

                <div className="flex flex-wrap gap-6 my-6 pt-6 border-t border-gray-200 max-md:flex-col max-md:gap-3">
                  <span className="text-gray-600 text-[0.95rem] font-medium">
                    👥 {b.participants} guests
                  </span>
                  <span className="text-gray-600 text-[0.95rem] font-medium">
                    📅 {new Date(b.bookingDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-5 max-md:flex-col max-md:items-start">
                  <p className="text-[2rem] font-extrabold text-gray-900">
                    ₹{b.totalAmount}
                  </p>

                  <div className="flex items-center gap-3 max-md:w-full max-md:flex-col">
                    {b.status === "completed" && b.tour?._id && (
                      <Link
                        href={`/tour/${b.tour._id}#reviews`}
                        className="px-[18px] py-3 rounded-xl border border-gray-300 text-gray-700 no-underline text-[0.9rem] font-semibold transition-all duration-200 hover:bg-gray-100 max-md:w-full max-md:text-center"
                      >
                        Write a review
                      </Link>
                    )}

                    <Link
                      href={`/bookings/${b._id}`}
                      className="px-[18px] py-3 rounded-xl bg-blue-600 text-white no-underline text-[0.9rem] font-semibold transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 max-md:w-full max-md:text-center"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600"
          >
            Prev
          </button>

          <span className="text-gray-600 font-medium">Page {page}</span>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:border-blue-600 hover:text-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}