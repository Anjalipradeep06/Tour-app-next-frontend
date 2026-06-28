"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentCancel() {
  const router = useRouter();

  useEffect(() => {
    toast.info("Payment was cancelled. No charges were made.", {
      toastId: "payment-cancelled",
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-[560px] bg-white rounded-3xl p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] max-[640px]:p-8">
        <FaTimesCircle className="text-[4.5rem] mb-6 text-red-600 mx-auto" />

        <span className="inline-block px-4 py-2.5 rounded-full text-[0.8rem] font-bold tracking-[0.08em] uppercase mb-6 bg-red-100 text-red-800">
          Payment Cancelled
        </span>

        <h1 className="text-3xl text-gray-900 mb-4 max-[640px]:text-[1.6rem]">
          Your payment was not completed
        </h1>

        <p className="text-gray-500 leading-[1.7]">
          No charges were made to your account. You can return to your
          booking and try again whenever you&apos;re ready.
        </p>

        <div className="flex gap-4 justify-center mt-8 max-[640px]:flex-col">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2.5 px-[1.4rem] py-[0.95rem] rounded-2xl font-semibold transition-all duration-200 bg-[#006ce4] text-white border-none cursor-pointer hover:bg-[#0057b8] max-[640px]:w-full"
          >
            Try Again
          </button>

          <Link
            href="/bookings"
            className="inline-flex items-center justify-center gap-2.5 px-[1.4rem] py-[0.95rem] rounded-2xl no-underline font-semibold transition-all duration-200 bg-white text-gray-900 border border-gray-300 hover:border-[#006ce4] hover:text-[#006ce4] max-[640px]:w-full"
          >
            My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}