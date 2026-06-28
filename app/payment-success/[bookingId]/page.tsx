"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { FaCheckCircle, FaReceipt } from "react-icons/fa";

import { verifyPayment } from "@/redux/thunks/paymentThunk";
import { clearPaymentError, clearPaymentMessage, resetPayment } from "@/redux/slices/paymentSlice";

export default function PaymentSuccess() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const dispatch = useDispatch();
  const router = useRouter();

  const { success, loading, error, message } = useSelector((state: any) => state.payment);

  useEffect(() => {
    dispatch(resetPayment());
    dispatch(verifyPayment(bookingId) as any);
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (message) {
      toast.success(message, { toastId: "payment-success" });
      dispatch(clearPaymentMessage());
    }

    if (error) {
      toast.error(error, { toastId: "payment-error" });
      dispatch(clearPaymentError());
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push(`/bookings/${bookingId}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, bookingId, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-[560px] bg-white rounded-3xl p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] max-[640px]:p-8">
        {loading && (
          <>
            <div className="w-[60px] h-[60px] mx-auto mb-6 border-4 border-gray-200 border-t-[#006ce4] rounded-full animate-spin" />

            <h2 className="text-[1.5rem] text-gray-900 mb-4">Verifying payment...</h2>

            <p className="text-gray-500 leading-[1.7]">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {!loading && success && (
          <>
            <FaCheckCircle className="text-[4.5rem] mb-6 text-green-600 mx-auto" />

            <span className="inline-block px-4 py-2.5 rounded-full text-[0.8rem] font-bold tracking-[0.08em] uppercase mb-6 bg-green-100 text-green-800">
              Payment Confirmed
            </span>

            <h1 className="text-3xl text-gray-900 mb-4 max-[640px]:text-[1.6rem]">
              Your booking is confirmed!
            </h1>

            <p className="text-gray-500 leading-[1.7]">
              Your payment was processed successfully. You will be redirected
              to your booking details shortly.
            </p>

            <div className="my-8 p-4 bg-slate-50 border border-gray-200 rounded-2xl">
              <span className="block text-gray-500 mb-2">Booking Reference</span>
              <strong className="text-gray-900 text-[1.25rem] tracking-[0.08em]">
                #{bookingId.slice(-6).toUpperCase()}
              </strong>
            </div>

            <div className="flex gap-4 justify-center mt-8 max-[640px]:flex-col">
              <Link
                href={`/bookings/${bookingId}`}
                className="inline-flex items-center justify-center gap-2.5 px-[1.4rem] py-[0.95rem] rounded-2xl no-underline font-semibold transition-all duration-200 bg-[#006ce4] text-white hover:bg-[#0057b8] max-[640px]:w-full"
              >
                <FaReceipt />
                View Booking
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2.5 px-[1.4rem] py-[0.95rem] rounded-2xl no-underline font-semibold transition-all duration-200 bg-white text-gray-900 border border-gray-300 hover:border-[#006ce4] hover:text-[#006ce4] max-[640px]:w-full"
              >
                Explore More Tours
              </Link>
            </div>
          </>
        )}

        {!loading && error && (
          <>
            <div className="text-[4.5rem] mb-6 text-red-600">✕</div>

            <span className="inline-block px-4 py-2.5 rounded-full text-[0.8rem] font-bold tracking-[0.08em] uppercase mb-6 bg-red-100 text-red-800">
              Verification Failed
            </span>

            <h1 className="text-3xl text-gray-900 mb-4 max-[640px]:text-[1.6rem]">
              Unable to verify payment
            </h1>

            <p className="text-gray-500 leading-[1.7]">{error}</p>

            <div className="flex gap-4 justify-center mt-8 max-[640px]:flex-col">
              <Link
                href="/bookings"
                className="inline-flex items-center justify-center gap-2.5 px-[1.4rem] py-[0.95rem] rounded-2xl no-underline font-semibold transition-all duration-200 bg-[#006ce4] text-white hover:bg-[#0057b8] max-[640px]:w-full"
              >
                Go to My Bookings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}