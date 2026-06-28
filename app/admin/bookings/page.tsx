"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getAllBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
} from "@/redux/thunks/adminThunk";

const PAGE_SIZE = 8;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatCurrency = (amount: any) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const STATUS_BG: Record<string, string> = {
  pending: "#FBF1E0",
  confirmed: "#E4F3EA",
  completed: "#ECEDEF",
  cancelled: "#FBE6E3",
  paid: "#E4F3EA",
  unpaid: "#FBF1E0",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "#B8770A",
  confirmed: "#1B7A4D",
  completed: "#5F636A",
  cancelled: "#C03B2B",
  paid: "#1B7A4D",
  unpaid: "#B8770A",
};

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const CompleteModal = ({
  booking,
  onConfirm,
  onCancel,
  isLoading,
}: {
  booking: any;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-[1000] p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl w-full max-w-[420px] shadow-[0_20px_48px_rgba(0,0,0,0.18)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 m-0">Mark as Completed</h2>
          <button onClick={onCancel} className="bg-transparent border-none text-gray-400 cursor-pointer text-base hover:text-gray-900 px-1 rounded">✕</button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3.5">
          <p className="m-0 text-[0.9rem] text-gray-700">
            Mark this booking as <strong>completed</strong>?
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-[0.85rem] text-gray-700">
            {[
              { label: "Traveler", value: booking.user?.name || "—" },
              { label: "Tour", value: booking.tour?.title || "—" },
              { label: "Date", value: formatDate(booking.bookingDate) },
              { label: "Amount", value: formatCurrency(booking.totalAmount) },
            ].map((row) => (
              <span key={row.label} className="flex flex-col gap-0.5">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-gray-400">{row.label}</span>
                {row.value}
              </span>
            ))}
          </div>

          <p className="m-0 text-[0.8rem] text-gray-500">
            This action cannot be undone. The traveler will be notified.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-5 py-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="bg-transparent border border-gray-300 text-gray-700 px-4 py-[0.45rem] rounded-md text-[0.85rem] cursor-pointer hover:bg-gray-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-gray-900 border border-gray-900 text-white px-4 py-[0.45rem] rounded-md text-[0.85rem] font-medium cursor-pointer hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Marking…" : "Mark as Completed"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default function AdminBookings() {
  const dispatch = useDispatch();

  const { allBookings = [], pagination, loading, actionTargetId } = useSelector(
    (state: any) => state.admin
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [completeTarget, setCompleteTarget] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllBookings({ page: currentPage, limit: PAGE_SIZE }) as any);
  }, [dispatch, currentPage]);

  const handleApprove = (id: string) => {
    (dispatch(approveBooking(id) as any) as any).then((res: any) => {
      if (approveBooking.fulfilled.match(res)) {
        toast.success("Booking approved");
      } else {
        toast.error(res.payload || "Failed to approve booking");
      }
    });
  };

  const handleReject = (id: string) => {
    if (window.confirm("Reject this booking? The traveler will be notified.")) {
      (dispatch(rejectBooking(id) as any) as any).then((res: any) => {
        if (rejectBooking.fulfilled.match(res)) {
          toast.success("Booking rejected");
        } else {
          toast.error(res.payload || "Failed to reject booking");
        }
      });
    }
  };

  const handleCompleteConfirm = () => {
    if (!completeTarget) return;
    (dispatch(completeBooking(completeTarget._id) as any) as any).then((res: any) => {
      if (completeBooking.fulfilled.match(res)) {
        toast.success("Booking marked as completed");
        setCompleteTarget(null);
        dispatch(getAllBookings({ page: currentPage, limit: PAGE_SIZE }) as any);
      } else {
        toast.error(res.payload || "Failed to complete booking");
      }
    });
  };

  const isActioning = loading.action && actionTargetId === completeTarget?._id;

  return (
    <div className="max-w-[1200px] mx-auto font-[Inter,sans-serif] text-[#1C1F23]">

      {/* HEADER */}
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C9A669] mb-1.5">Admin</p>
        <h1 className="font-['Fraunces',serif] font-medium text-[clamp(26px,3.6vw,34px)] text-[#1C1F23] m-0">
          Manage Bookings
        </h1>
      </div>

      <div className="bg-white border border-[#E6E4DD] rounded-[14px] overflow-hidden">

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading.bookings && allBookings.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F76] text-sm">Loading bookings…</div>
          ) : allBookings.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F76] text-sm">No bookings found</div>
          ) : (
            <table className="w-full border-collapse text-[13.5px]">
              <thead>
                <tr>
                  {["Traveler", "Tour", "Date", "Guests", "Amount", "Status", "Payment", ""].map((h) => (
                    <th key={h} className="text-left text-[11.5px] font-semibold tracking-[0.04em] uppercase text-[#6B6F76] px-4 py-3 border-b border-[#E6E4DD] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b: any) => (
                  <tr key={b._id} className="hover:bg-[#FAF9F6] transition-colors last:[&>td]:border-b-0">
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span className="block font-semibold text-[#1C1F23]">{b.user?.name || "—"}</span>
                      <span className="block text-xs text-[#6B6F76] mt-px">{b.user?.email || ""}</span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      {b.tour?.title || "Tour unavailable"}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      {formatDate(b.bookingDate)}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      {b.participants}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span
                        className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: STATUS_BG[b.status] || "#ECEDEF", color: STATUS_COLOR[b.status] || "#5F636A" }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span
                        className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: STATUS_BG[b.paymentStatus || "unpaid"], color: STATUS_COLOR[b.paymentStatus || "unpaid"] }}
                      >
                        {b.paymentStatus || "unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(b._id)}
                              disabled={loading.action && actionTargetId === b._id}
                              className="text-[12.5px] font-semibold px-3 py-1.5 rounded-[7px] border-none bg-[#C9A669] text-[#1C1F23] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                            >
                              {loading.action && actionTargetId === b._id ? "…" : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(b._id)}
                              disabled={loading.action && actionTargetId === b._id}
                              className="text-[12.5px] font-semibold px-3 py-1.5 rounded-[7px] border-none bg-[#FBE6E3] text-[#C03B2B] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#F6D9D4] transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => setCompleteTarget(b)}
                            title="Mark as completed"
                            aria-label="Mark booking as completed"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-transparent text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 transition-colors"
                          >
                            <PencilIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {pagination?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-4 py-[18px] border-t border-[#E6E4DD]">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="bg-transparent border border-[#E6E4DD] text-[#1C1F23] text-[13px] font-semibold px-4 py-[7px] rounded-full cursor-pointer hover:border-[#C9A669] hover:bg-[#FBF1E0] disabled:opacity-45 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <span className="text-[13.5px] font-semibold text-[#1C1F23]">
              Page {pagination.currentPage} of {pagination.totalPages}{" "}
              <span className="font-normal text-[#6B6F76]">({pagination.totalBookings} total)</span>
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === pagination.totalPages}
              className="bg-transparent border border-[#E6E4DD] text-[#1C1F23] text-[13px] font-semibold px-4 py-[7px] rounded-full cursor-pointer hover:border-[#C9A669] hover:bg-[#FBF1E0] disabled:opacity-45 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <CompleteModal
        booking={completeTarget}
        onConfirm={handleCompleteConfirm}
        onCancel={() => setCompleteTarget(null)}
        isLoading={isActioning}
      />

    </div>
  );
}