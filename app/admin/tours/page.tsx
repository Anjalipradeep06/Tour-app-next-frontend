"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getAllTours, deleteTour } from "@/redux/thunks/tourThunk";
import TourFormModal from "@/app/components/admin/TourFormModal";

const LIMIT = 9;

const formatCurrency = (amount: any) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ManageTours() {
  const dispatch = useDispatch();

  const { tours = [], loading, actionLoading, total = 0, pages = 1 } = useSelector(
    (state: any) => state.tours
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchTours = (targetPage = 1, searchTerm = search) => {
    dispatch(getAllTours({ search: searchTerm.trim() || undefined, page: targetPage, limit: LIMIT }) as any);
  };

  useEffect(() => { fetchTours(1); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTours(1, search);
  };

  const goToPage = (targetPage: number) => {
    if (targetPage < 1 || targetPage > pages || targetPage === page) return;
    setPage(targetPage);
    fetchTours(targetPage, search);
  };

  const openCreate = () => { setEditingTour(null); setModalOpen(true); };
  const openEdit = (tour: any) => { setEditingTour(tour); setModalOpen(true); };

  const closeModal = (didSave = false) => {
    setEditingTour(null);
    setModalOpen(false);
    if (didSave) fetchTours(page, search);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const res = await (dispatch(deleteTour(deleteTargetId) as any) as any);
    if (deleteTour.fulfilled.match(res)) {
      toast.success("Tour deleted successfully");
      const remainingOnPage = tours.length - 1;
      if (remainingOnPage === 0 && page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        fetchTours(newPage, search);
      } else {
        fetchTours(page, search);
      }
    } else {
      toast.error(res.payload || "Delete failed");
    }
    setDeleteTargetId(null);
  };

  const featuredCount = tours.filter((t: any) => t.isFeatured).length;
  const availableCount = tours.filter((t: any) => t.availableSlots > 0).length;
  const inventoryValue = tours.reduce((sum: number, t: any) => sum + Number(t.price || 0), 0);

  const statCards = [
    { label: "Total Tours", value: total },
    { label: "Featured (this page)", value: featuredCount },
    { label: "Available (this page)", value: availableCount },
    { label: "Inventory Value (this page)", value: formatCurrency(inventoryValue) },
  ];

  return (
    <div className="max-w-[1200px] mx-auto font-[Inter,sans-serif] text-[#1C1F23]">

      {/* HEADER */}
      <section className="flex items-end justify-between gap-5 mb-6 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <span className="inline-block text-[11.5px] font-semibold tracking-[0.08em] uppercase text-[#C9A669] mb-2">
            Premium Tour Management
          </span>
          <h1 className="font-['Fraunces',serif] font-medium text-[clamp(26px,3.6vw,34px)] text-[#1C1F23] m-0 mb-2">
            Manage Tours
          </h1>
          <p className="text-sm text-[#6B6F76] max-w-[480px] m-0 leading-relaxed">
            Create, edit and organize luxury travel experiences for your customers from one beautiful dashboard.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-[#C9A669] to-[#B78E4F] text-[#1C1F23] border-none font-bold text-sm px-[22px] py-[13px] rounded-[10px] cursor-pointer whitespace-nowrap shadow-[0_10px_20px_rgba(201,166,105,0.25)] hover:opacity-90 transition-opacity"
        >
          + Create Tour
        </button>
      </section>

      {/* SEARCH */}
      <form className="flex gap-2.5 mb-6" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search tours, destinations or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white border border-[#E6E4DD] rounded-[10px] px-4 py-3 text-[13.5px] text-[#1C1F23] outline-none transition-colors focus:border-[#C9A669] placeholder:text-[#6B6F76]"
        />
        <button
          type="submit"
          className="bg-[#1C1F23] text-white border-none font-semibold text-[13.5px] px-[22px] py-3 rounded-[10px] cursor-pointer hover:bg-[#2A2E35] transition-colors"
        >
          Search
        </button>
      </form>

      {/* STATS */}
      <section className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-3.5 mb-7">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#E6E4DD] border-t-[3px] border-t-[#C9A669] rounded-xl p-[18px] flex items-center justify-between gap-3"
          >
            <div>
              <span className="block text-[11.5px] font-semibold tracking-[0.04em] uppercase text-[#6B6F76] mb-1.5">
                {card.label}
              </span>
              <h2 className="font-['Fraunces',serif] font-medium text-2xl text-[#1C1F23] m-0">
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </section>

      {/* TOUR GRID */}
      {loading && tours.length === 0 ? (
        <div className="text-center py-[70px] text-[#6B6F76] text-sm">Loading Tours...</div>
      ) : tours.length === 0 ? (
        <div className="text-center py-[70px] text-[#6B6F76] text-sm">
          <h2 className="font-['Fraunces',serif] font-medium text-[#1C1F23] text-xl mb-2">No Tours Found</h2>
          <p>Try changing your search or create a new tour.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-1 gap-5 mb-6">
          {tours.map((tour: any) => (
            <div
              key={tour._id}
              className="bg-white border border-[#E6E4DD] rounded-[14px] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_14px_30px_rgba(28,31,35,0.1)] hover:-translate-y-0.5"
            >
              {/* IMAGE */}
              <div className="relative h-[170px]">
                <img
                  src={tour.images?.[0] || tour.image || tour.thumbnail || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"}
                  alt={tour.title}
                  className="w-full h-full object-cover block"
                />
                {tour.isFeatured && (
                  <span className="absolute top-3 left-3 bg-[rgba(28,31,35,0.85)] text-[#F4F1EA] text-[11.5px] font-semibold px-2.5 py-[5px] rounded-full">
                    ⭐ Featured
                  </span>
                )}
                <div className="absolute bottom-3 right-3 bg-gradient-to-r from-[#C9A669] to-[#B78E4F] text-[#1C1F23] text-[13px] font-bold px-3 py-1.5 rounded-full">
                  {formatCurrency(tour.price)}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-['Fraunces',serif] font-medium text-[18px] text-[#1C1F23] m-0 mb-1">
                  {tour.title}
                </h3>
                <p className="text-[13px] text-[#6B6F76] m-0 mb-3.5">
                  📍 {tour.destination?.name ? `${tour.destination.name}, ${tour.destination.country}` : "Destination"}
                </p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4 pb-4 border-b border-[#E6E4DD]">
                  {[
                    { label: "Duration", value: `${tour.duration} Days` },
                    { label: "Slots", value: tour.availableSlots },
                    { label: "Rating", value: tour.averageRating > 0 ? `⭐ ${tour.averageRating.toFixed(1)}` : "No Reviews" },
                    { label: "Country", value: tour.destination?.country || "-" },
                  ].map((info) => (
                    <div key={info.label} className="flex flex-col gap-0.5">
                      <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase text-[#6B6F76]">{info.label}</span>
                      <strong className="text-[13.5px] text-[#1C1F23] font-semibold">{info.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => openEdit(tour)}
                    disabled={actionLoading}
                    className="flex-1 text-[13px] font-semibold py-[9px] rounded-lg border-none bg-[#1C1F23] text-white cursor-pointer hover:bg-[#2A2E35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(tour._id)}
                    disabled={actionLoading}
                    className="flex-1 text-[13px] font-semibold py-[9px] rounded-lg border-none bg-[#FBE6E3] text-[#C03B2B] cursor-pointer hover:bg-[#F6D9D4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-[18px] my-2 mb-7 max-[640px]:flex-col max-[640px]:gap-3">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || loading}
            className="bg-white border border-[#E6E4DD] text-[#1C1F23] text-[13.5px] font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer hover:border-[#C9A669] hover:text-[#C9A669] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-[13px] text-[#6B6F76]">
            Page <strong className="text-[#1C1F23]">{page}</strong> of <strong className="text-[#1C1F23]">{pages}</strong>
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= pages || loading}
            className="bg-white border border-[#E6E4DD] text-[#1C1F23] text-[13.5px] font-semibold px-5 py-2.5 rounded-[10px] cursor-pointer hover:border-[#C9A669] hover:text-[#C9A669] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* FOOTER */}
      <div className="text-center text-[13px] text-[#6B6F76] py-2">
        Showing <strong className="text-[#1C1F23]">{tours.length}</strong> of <strong className="text-[#1C1F23]">{total}</strong> tours total
      </div>

      {/* TOUR FORM MODAL */}
      {modalOpen && <TourFormModal tour={editingTour} onClose={closeModal} />}

      {/* DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-[rgba(11,14,17,0.55)] flex items-center justify-center z-[100] p-4" role="dialog">
          <div className="bg-white rounded-[14px] px-[26px] py-[30px] max-w-[380px] w-full text-center">
            <h2 className="font-['Fraunces',serif] font-medium text-[21px] text-[#1C1F23] m-0 mb-2.5">Delete this tour?</h2>
            <p className="text-[13.5px] text-[#6B6F76] leading-relaxed m-0 mb-[22px]">
              This action cannot be undone. Existing bookings will remain.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteTargetId(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-[9px] bg-[#F7F8FA] border border-[#E6E4DD] text-[#1C1F23] font-semibold text-[13.5px] cursor-pointer disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-[9px] bg-[#C03B2B] border border-[#C03B2B] text-white font-semibold text-[13.5px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Deleting..." : "Delete Tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}