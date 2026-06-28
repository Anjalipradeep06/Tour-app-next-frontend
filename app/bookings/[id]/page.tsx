"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

import { getBookingById, cancelBooking } from "@/redux/thunks/bookingThunk";
import { resetBookingState, clearBookingMessage, clearBookingError } from "@/redux/slices/bookingSlice";
import { usePolling } from "@/hooks/usePolling";
import PaymentButton from "@/app/components/PaymentButton/PaymentButton";

export default function BookingDetails() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch();

  const { selectedBooking, loading, error, success, message } = useSelector(
    (state: any) => state.booking
  );

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    setHasLoadedOnce(false);

    (dispatch(getBookingById(id) as any) as any).then(() => {
      setHasLoadedOnce(true);
    });

    return () => {
      dispatch(resetBookingState());
      setHasLoadedOnce(false);
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(clearBookingMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearBookingError());
    }
  }, [success, message, error, dispatch]);

  const booking = selectedBooking;

  const status = booking?.status || "pending";
  const paymentStatus = booking?.paymentStatus || "unpaid";

  const canCancel = status === "pending" || status === "confirmed";

  const isFinal = status === "cancelled" || (status === "completed" && paymentStatus === "paid");

  usePolling(() => dispatch(getBookingById(id) as any), 5000, !isFinal);

  const handleCancel = () => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");

    if (confirmed) {
      dispatch(cancelBooking(id) as any);
    }
  };

  const statusBadgeClass: Record<string, string> = {
    pending: "bg-[#fff4cc] text-[#8a6500]",
    confirmed: "bg-[#dff7e8] text-[#146c43]",
    cancelled: "bg-[#fde2e4] text-[#b42318]",
    completed: "bg-[#dff7e8] text-[#146c43]",
  };

  const paymentBadgeClass: Record<string, string> = {
    paid: "bg-[#dff7e8] text-[#146c43]",
    unpaid: "bg-[#e7f0ff] text-[#006ce4]",
  };

  const paymentTextClass: Record<string, string> = {
    paid: "text-[#16a34a]",
    unpaid: "text-[#2563eb]",
    failed: "text-[#dc2626]",
    refunded: "text-[#9333ea]",
  };

  if (loading.detail && !hasLoadedOnce) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] pt-[120px] px-5 pb-[60px]">
        <div className="max-w-[500px] mx-auto mt-[100px] p-10 bg-white rounded-[20px] text-center shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <div className="w-11 h-11 mx-auto mb-5 border-4 border-gray-200 border-t-[#006ce4] rounded-full animate-spin" />
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!loading.detail && !selectedBooking && !error) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] pt-[120px] px-5 pb-[60px]">
        <div className="max-w-[500px] mx-auto mt-[100px] p-10 bg-white rounded-[20px] text-center shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <p>Booking not found.</p>
          <Link
            href="/bookings"
            className="inline-block mt-4 w-full py-3.5 px-4 rounded-xl font-semibold text-center border border-[#006ce4] text-[#006ce4] bg-white hover:bg-[#f0f7ff] transition-all duration-200"
          >
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = booking?.bookingDate
    ? new Date(booking.bookingDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const statusIcon =
    status === "confirmed" ? <FaCheckCircle /> : status === "cancelled" ? <FaTimesCircle /> : <FaClock />;

  return (
    <div className="min-h-screen bg-[#f5f7fa] pt-[120px] px-5 pb-[60px] max-md:pt-[100px] max-md:px-4 max-md:pb-10">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/bookings" className="inline-block mb-6 no-underline text-[#006ce4] font-semibold">
          ← Back to My Trips
        </Link>

        <div className="bg-white rounded-[20px] p-8 mb-6 flex justify-between items-start gap-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] max-md:flex-col max-md:p-6">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">Booking Reference</p>
            <h1 className="text-3xl text-gray-900 mb-2 max-md:text-[1.6rem]">
              {booking?.tour?.title || "Tour Booking"}
            </h1>
            <p className="text-gray-500 break-all">#{booking?._id}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <span
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold capitalize ${statusBadgeClass[status] || ""}`}
            >
              {statusIcon}
              {status}
            </span>

            <span
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold capitalize ${paymentBadgeClass[paymentStatus] || ""}`}
            >
              <FaCreditCard />
              {paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[2fr_380px] gap-6 max-[992px]:grid-cols-1">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              <img
                src={
                  booking?.tour?.image ||
                  booking?.tour?.destination?.bannerImage ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                }
                alt={booking?.tour?.title || "Tour"}
                className="w-full h-80 object-cover max-md:h-[220px]"
              />

              <div className="p-8 max-md:p-6">
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-8 max-md:grid-cols-1">
                  <div className="flex gap-3.5">
                    <FaCalendarAlt className="text-[#006ce4] text-lg mt-1" />
                    <div>
                      <span className="block text-gray-500 text-sm mb-1">Travel Date</span>
                      <strong className="text-gray-900 text-base">{formattedDate}</strong>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <FaUsers className="text-[#006ce4] text-lg mt-1" />
                    <div>
                      <span className="block text-gray-500 text-sm mb-1">Guests</span>
                      <strong className="text-gray-900 text-base">{booking?.participants}</strong>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <FaMapMarkerAlt className="text-[#006ce4] text-lg mt-1" />
                    <div>
                      <span className="block text-gray-500 text-sm mb-1">Destination</span>
                      <strong className="text-gray-900 text-base">
                        {booking?.tour?.country || booking?.tour?.destination?.country || "International"}
                      </strong>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <FaCreditCard className="text-[#006ce4] text-lg mt-1" />
                    <div>
                      <span className="block text-gray-500 text-sm mb-1">Payment</span>
                      <strong className="text-gray-900 text-base">{paymentStatus}</strong>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/tour/${booking?.tour?._id}`}
                  className="inline-block w-full py-3.5 px-4 rounded-xl font-semibold text-center border border-[#006ce4] text-[#006ce4] bg-white hover:bg-[#f0f7ff] transition-all duration-200"
                >
                  View Tour Details
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>

              <div className="grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] gap-5">
                <div>
                  <span className="block text-gray-500 text-sm mb-1.5">Payment Status</span>
                  <strong className={`text-base ${paymentTextClass[paymentStatus] || ""}`}>
                    {paymentStatus}
                  </strong>
                </div>

                <div>
                  <span className="block text-gray-500 text-sm mb-1.5">Payment Method</span>
                  <strong className="text-gray-900 text-base">
                    {booking?.paymentMethod === "stripe" ? "Stripe" : "Cash On Arrival"}
                  </strong>
                </div>

                <div>
                  <span className="block text-gray-500 text-sm mb-1.5">Booking Created</span>
                  <strong className="text-gray-900 text-base">
                    {new Date(booking?.createdAt).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span className="block text-gray-500 text-sm mb-1.5">Last Updated</span>
                  <strong className="text-gray-900 text-base">
                    {new Date(booking?.updatedAt).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-7 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Timeline</h3>

              <div className="flex flex-col gap-[18px]">
                <div className="flex items-center gap-3 font-medium text-gray-700">
                  <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
                  Booking Created
                </div>

                {paymentStatus === "paid" && (
                  <div className="flex items-center gap-3 font-medium text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
                    Payment Completed
                  </div>
                )}

                {status === "confirmed" && (
                  <div className="flex items-center gap-3 font-medium text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
                    Booking Confirmed
                  </div>
                )}

                {status === "completed" && (
                  <div className="flex items-center gap-3 font-medium text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-[#16a34a]" />
                    Tour Completed
                  </div>
                )}

                {status === "cancelled" && (
                  <div className="flex items-center gap-3 font-medium text-gray-700">
                    <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
                    Booking Cancelled
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside className="bg-white rounded-[20px] p-8 h-fit sticky top-[100px] shadow-[0_8px_30px_rgba(15,23,42,0.08)] max-[992px]:static max-md:p-6">
            <p className="text-gray-500 mb-2.5">Total Amount</p>

            <h2 className="text-4xl text-gray-900 mb-2 max-md:text-[2rem]">
              ₹{Number(booking?.totalAmount || 0).toLocaleString("en-IN")}
            </h2>

            <p className="text-gray-500">Includes taxes and fees</p>

            <div className="h-px bg-gray-200 my-7" />

            <div className="flex flex-col gap-3.5">
              {paymentStatus !== "paid" && status !== "cancelled" && <PaymentButton booking={booking} />}

              {canCancel ? (
                <button
                  onClick={handleCancel}
                  disabled={loading.action}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-center border-none bg-[#d92d20] text-white hover:bg-[#b42318] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading.action ? "Cancelling..." : "Cancel Booking"}
                </button>
              ) : (
                <p className="text-center text-gray-500 leading-relaxed">
                  This booking can no longer be modified.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}