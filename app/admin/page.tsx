"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";

import { getDashboardStats, getAllBookings, approveBooking, rejectBooking } from "@/redux/thunks/adminThunk";
import { resetAdminError } from "@/redux/slices/adminSlice";
import { usePolling } from "@/hooks/usePolling";

const RECENT_BOOKINGS_LIMIT = 4;

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#B8770A",
  confirmed: "#1B7A4D",
  completed: "#8E959B",
  cancelled: "#C03B2B",
};

const STATUS_BG: Record<string, string> = {
  pending: "#FBF1E0",
  confirmed: "#E4F3EA",
  completed: "#ECEDEF",
  cancelled: "#FBE6E3",
  paid: "#E4F3EA",
  unpaid: "#FBF1E0",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatCurrency = (amount: any) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E6E4DD] rounded-lg px-3 py-2 shadow-lg text-[12.5px]">
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-2.5 text-[#1C1F23]">
          <span>{entry.name}</span>
          <strong className="text-[#C9A669]">{entry.value}</strong>
        </div>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { stats, allBookings = [], loading, actionTargetId, error } = useSelector(
    (state: any) => state.admin
  );

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(getDashboardStats() as any);
    dispatch(getAllBookings() as any);
  }, [dispatch]);

  usePolling(() => {
    dispatch(getDashboardStats() as any);
    dispatch(getAllBookings() as any);
  }, 10000);

  const handleApprove = (id: string) => {
    (dispatch(approveBooking(id) as any) as any).then((result: any) => {
      if (approveBooking.fulfilled.match(result)) {
        toast.success("Booking approved successfully!");
      } else {
        toast.error(result.payload || "Failed to approve booking");
      }
    });
  };

  const handleReject = (id: string) => {
    if (window.confirm("Reject this booking? The traveler will be notified.")) {
      (dispatch(rejectBooking(id) as any) as any).then((result: any) => {
        if (rejectBooking.fulfilled.match(result)) {
          toast.success("Booking rejected.");
        } else {
          toast.error(result.payload || "Failed to reject booking");
        }
      });
    }
  };

  const filteredBookings = Array.isArray(allBookings)
    ? activeTab === "all" ? allBookings : allBookings.filter((b: any) => b.status === activeTab)
    : [];

  const visibleBookings = filteredBookings.slice(0, RECENT_BOOKINGS_LIMIT);

  const statCards = [
    { label: "Total users", value: stats?.users ?? "—" },
    { label: "Total tours", value: stats?.tours ?? "—" },
    { label: "Total bookings", value: stats?.bookings ?? "—" },
    { label: "Pending", value: stats?.pendingBookings ?? "—", accent: "pending" },
    { label: "Confirmed", value: stats?.confirmedBookings ?? "—", accent: "confirmed" },
    { label: "Completed", value: stats?.completedBookings ?? "—", accent: "completed" },
    { label: "Cancelled", value: stats?.cancelledBookings ?? "—", accent: "cancelled" },
    { label: "Total revenue", value: stats ? formatCurrency(stats.totalRevenue) : "—", accent: "revenue" },
  ];

  const accentTop: Record<string, string> = {
    pending: "#B8770A",
    confirmed: "#1B7A4D",
    completed: "#5F636A",
    cancelled: "#C03B2B",
    revenue: "#C9A669",
  };

  const statusChartData = stats
    ? [
        { key: "pending", name: "Pending", value: stats.pendingBookings || 0 },
        { key: "confirmed", name: "Confirmed", value: stats.confirmedBookings || 0 },
        { key: "completed", name: "Completed", value: stats.completedBookings || 0 },
        { key: "cancelled", name: "Cancelled", value: stats.cancelledBookings || 0 },
      ].filter((d) => d.value > 0)
    : [];

  const entityChartData = stats
    ? [
        { name: "Users", value: stats.users || 0 },
        { name: "Tours", value: stats.tours || 0 },
        { name: "Bookings", value: stats.bookings || 0 },
      ]
    : [];

  return (
    <div className="max-w-[1200px] mx-auto font-[Inter,sans-serif] text-[#1C1F23]">

      {/* HEADER */}
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C9A669] mb-1.5">Admin</p>
        <h1 className="font-['Fraunces',serif] font-medium text-[clamp(26px,3.6vw,34px)] text-[#1C1F23] m-0">
          Dashboard
        </h1>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="flex items-center justify-between gap-3 bg-[#FBE6E3] text-[#C03B2B] text-sm px-4 py-3 rounded-[10px] mb-5">
          <span>{error}</span>
          <button onClick={() => dispatch(resetAdminError())} className="bg-transparent border-none text-[#C03B2B] cursor-pointer text-base">✕</button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 max-[960px]:grid-cols-2 gap-3.5 mb-7">
        {loading.stats && !stats
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="min-h-[76px] rounded-xl bg-white border border-[#E6E4DD] animate-pulse" />
            ))
          : statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white border border-[#E6E4DD] rounded-xl p-[18px] flex flex-col gap-1.5"
                style={{
                  borderTop: `3px solid ${card.accent ? accentTop[card.accent] : "#C9A669"}`,
                  ...(card.accent === "revenue"
                    ? { background: "linear-gradient(135deg,#1B1F24,#2A2218)" }
                    : {}),
                }}
              >
                <span
                  className="text-[11.5px] font-semibold tracking-[0.04em] uppercase"
                  style={{ color: card.accent === "revenue" ? "#C9A669" : "#6B6F76" }}
                >
                  {card.label}
                </span>
                <span
                  className="font-['Fraunces',serif] font-medium text-[26px]"
                  style={{ color: card.accent === "revenue" ? "#F4F1EA" : "#1C1F23" }}
                >
                  {card.value}
                </span>
              </div>
            ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-3.5 mb-7">
        <div className="bg-white border border-[#E6E4DD] rounded-[14px] p-5 pb-3">
          <h2 className="text-sm font-semibold text-[#1C1F23] mb-2">Booking status breakdown</h2>
          {!loading.stats && statusChartData.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F76] text-[13.5px]">No bookings yet.</div>
          ) : (
            <div className="flex items-center gap-2">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusChartData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={84} paddingAngle={2}>
                    {statusChartData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5 flex-shrink-0 min-w-[120px]">
                {statusChartData.map((entry) => (
                  <li key={entry.key} className="flex items-center gap-2 text-[13px] text-[#1C1F23]">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[entry.key] }} />
                    {entry.name}
                    <strong className="ml-auto font-bold">{entry.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E6E4DD] rounded-[14px] p-5 pb-3">
          <h2 className="text-sm font-semibold text-[#1C1F23] mb-2">Platform scale</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={entityChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8E959B" }} axisLine={{ stroke: "#E6E4DD" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#8E959B" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(201,166,105,0.08)" }} />
              <Bar dataKey="value" fill="#C9A669" radius={[6, 6, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white border border-[#E6E4DD] rounded-[14px] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-[18px] pt-[18px]">
          <h2 className="text-sm font-semibold text-[#1C1F23] m-0">Recent Bookings</h2>
          <button
            onClick={() => router.push("/admin/bookings")}
            className="inline-flex items-center gap-1 bg-transparent border border-[#E6E4DD] text-[#C9A669] text-[12.5px] font-semibold px-3.5 py-[7px] rounded-full cursor-pointer hover:border-[#C9A669] hover:bg-[#FBF1E0] transition-all"
          >
            View More →
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-1 px-3.5 pt-2.5 border-b border-[#E6E4DD] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 bg-transparent border-none text-[13.5px] font-semibold px-3.5 py-2.5 cursor-pointer whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "text-[#1C1F23] border-[#C9A669]"
                  : "text-[#6B6F76] border-transparent hover:text-[#1C1F23]"
              }`}
            >
              {tab.label}
              {tab.key === "pending" && stats?.pendingBookings > 0 && (
                <span className="bg-[#FBF1E0] text-[#B8770A] text-[11px] font-bold px-1.5 py-px rounded-full">
                  {stats.pendingBookings}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading.bookings && allBookings.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F76] text-sm">Loading bookings…</div>
          ) : visibleBookings.length === 0 ? (
            <div className="py-12 text-center text-[#6B6F76] text-sm">
              No {activeTab !== "all" ? activeTab : ""} bookings found.
            </div>
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
                {visibleBookings.map((b: any) => (
                  <tr key={b._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span className="block font-semibold text-[#1C1F23]">{b.user?.name || "—"}</span>
                      <span className="block text-xs text-[#6B6F76] mt-px">{b.user?.email || ""}</span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">{b.tour?.title || "Tour unavailable"}</td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">{formatDate(b.bookingDate)}</td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">{b.participants}</td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span
                        className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: STATUS_BG[b.status] || "#ECEDEF", color: STATUS_COLORS[b.status] || "#5F636A" }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span
                        className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: STATUS_BG[b.paymentStatus || "unpaid"], color: b.paymentStatus === "paid" ? "#1B7A4D" : "#B8770A" }}
                      >
                        {b.paymentStatus || "unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      {b.status === "pending" && (
                        <div className="flex gap-1.5">
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
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}