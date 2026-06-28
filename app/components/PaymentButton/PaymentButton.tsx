"use client";

import { useDispatch, useSelector } from "react-redux";
import { FaLock, FaCreditCard, FaSpinner, FaHourglassHalf } from "react-icons/fa";

import { startPayment } from "@/redux/thunks/paymentThunk";

type Booking = {
  _id: string;
  status: string;
  paymentStatus: string;
};

type PaymentButtonProps = {
  booking: Booking | null;
};

export default function PaymentButton({ booking }: PaymentButtonProps) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state: any) => state.payment);

  // GUARD: booking not loaded yet
  if (!booking) {
    return null;
  }

  const handlePayment = async () => {
    try {
      const response = await (dispatch(startPayment(booking._id) as any) as any).unwrap();
      window.location.href = response.url;
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  // WAITING FOR ADMIN APPROVAL
  if (booking.status === "pending") {
    return (
      <div className="flex flex-col gap-3.5">
        <button
          disabled
          className="w-full h-14 flex items-center justify-center gap-3 border-none rounded-2xl bg-gray-400 text-white text-base font-bold cursor-not-allowed opacity-70"
        >
          <FaHourglassHalf />
          Waiting for Admin Approval
        </button>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-[0.85rem]">
          <FaLock className="text-green-600" />
          <span>You&apos;ll be able to pay once your booking is approved</span>
        </div>
      </div>
    );
  }

  // ALREADY PAID
  if (booking.paymentStatus === "paid") {
    return null;
  }

  // APPROVED — SHOW PAY BUTTON
  return (
    <div className="flex flex-col gap-3.5">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full h-14 flex items-center justify-center gap-3 border-none rounded-2xl bg-[#003b95] text-white text-base font-bold cursor-pointer transition-all duration-300 hover:not-disabled:bg-[#0057b8] hover:not-disabled:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Redirecting...
          </>
        ) : (
          <>
            <FaCreditCard />
            Pay Securely
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-slate-500 text-[0.85rem]">
        <FaLock className="text-green-600" />
        <span>Secure checkout powered by Stripe</span>
      </div>
    </div>
  );
}