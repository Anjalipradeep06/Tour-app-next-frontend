"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllDestinations } from "@/redux/thunks/destinationThunk";
import DestinationFormModal from "@/app/components/admin/DestinationFormModal";

const CONTINENTS = ["", "Africa", "Asia", "Europe", "North America", "South America", "Australia", "Antarctica"];

export default function ManageDestinations() {
  const dispatch = useDispatch();

  const { allDestinations = [], loading, total = 0 } = useSelector(
    (state: any) => state.destinations
  );

  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllDestinations({ search, continent: continent || undefined }) as any);
  }, [dispatch, search, continent]);

  return (
    <div className="max-w-[1200px] mx-auto font-[Inter,sans-serif] text-[#1C1F23]">

      {/* HEADER */}
      <div className="flex items-end justify-between gap-4 mb-6 max-[560px]:flex-col max-[560px]:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C9A669] mb-1">Meridian Admin</p>
          <h1 className="font-['Fraunces',serif] font-medium text-[clamp(26px,3.6vw,32px)] text-[#1C1F23] my-1 mb-1.5">
            Destinations
          </h1>
          <span className="text-[13.5px] text-[#6B6F76]">Manage every destination displayed to travelers.</span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#C9A669] to-[#B78E4F] text-[#1C1F23] border-none font-bold text-sm px-[22px] py-[13px] rounded-[10px] cursor-pointer whitespace-nowrap shadow-[0_10px_20px_rgba(201,166,105,0.25)] hover:opacity-90 transition-opacity"
        >
          + New Destination
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2.5 mb-4 max-[800px]:flex-wrap">
        <input
          type="text"
          placeholder="Search destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-[380px] max-[800px]:max-w-none max-[800px]:flex-[1_1_100%] bg-white border border-[#E6E4DD] rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-[#1C1F23] outline-none transition-colors focus:border-[#C9A669]"
        />
        <select
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
          className="bg-white border border-[#E6E4DD] rounded-[10px] px-3.5 py-[11px] text-[13.5px] text-[#1C1F23] outline-none cursor-pointer min-w-[170px] focus:border-[#C9A669]"
        >
          {CONTINENTS.map((c) => (
            <option key={c} value={c}>{c || "All Continents"}</option>
          ))}
        </select>
      </div>

      {/* TOTAL */}
      {!loading && (
        <div className="text-[13px] font-semibold text-[#6B6F76] mb-4">
          {total} Destination{total !== 1 && "s"}
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="text-center py-[70px] text-[#6B6F76] text-sm">Loading destinations...</div>
      ) : allDestinations.length === 0 ? (
        <div className="text-center py-[70px] text-[#6B6F76] text-sm">No destinations found.</div>
      ) : (
        <div className="grid grid-cols-4 max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2 max-[560px]:grid-cols-1 gap-[18px]">
          {allDestinations.map((destination: any) => (
            <div
              key={destination._id}
              className="bg-white border border-[#E6E4DD] rounded-[14px] overflow-hidden transition-all duration-200 hover:shadow-[0_14px_30px_rgba(28,31,35,0.1)] hover:-translate-y-0.5"
            >
              <div className="relative h-[140px]">
                <img
                  src={destination.bannerImage}
                  alt={destination.name}
                  className="w-full h-full object-cover block"
                />
                {destination.isFeatured && (
                  <span className="absolute top-2.5 left-2.5 bg-[rgba(28,31,35,0.85)] text-[#F4F1EA] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    ★ Featured
                  </span>
                )}
              </div>

              <div className="px-4 pt-3.5 pb-4">
                <h3 className="font-['Fraunces',serif] font-medium text-[16.5px] text-[#1C1F23] m-0 mb-1">
                  {destination.name}
                </h3>
                <p className="text-[13px] text-[#6B6F76] m-0 mb-2">{destination.country}</p>
                <span className="inline-block text-[11px] font-semibold tracking-[0.03em] uppercase text-[#C9A669] bg-[#FBF1E0] px-2.5 py-[3px] rounded-full">
                  {destination.continent}
                </span>

                <div className="mt-3.5">
                  <button
                    onClick={() => setEditingDestination(destination)}
                    className="w-full py-[10px] px-3.5 rounded-[10px] border-none bg-[#1C1F23] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 hover:-translate-y-px transition-all"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE */}
      {showModal && (
        <DestinationFormModal onClose={() => setShowModal(false)} />
      )}

      {/* EDIT */}
      {editingDestination && (
        <DestinationFormModal
          destination={editingDestination}
          onClose={() => setEditingDestination(null)}
        />
      )}
    </div>
  );
}