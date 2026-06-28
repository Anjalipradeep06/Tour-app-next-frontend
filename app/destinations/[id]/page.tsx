"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaStar,
  FaCamera,
  FaSuitcaseRolling,
} from "react-icons/fa";

import { getDestinationById } from "@/redux/thunks/destinationThunk";
import { clearSelectedDestination } from "@/redux/slices/destinationSlice";

import TourCard from "@/app/components/TourCard/TourCard";

export default function DestinationDetails() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch();

  const { selectedDestination, destinationTours, loading, error } = useSelector(
    (state: any) => state.destinations
  );

  useEffect(() => {
    dispatch(getDestinationById(id) as any);

    return () => {
      dispatch(clearSelectedDestination());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[1.2rem] text-slate-500">
        <p>Loading destination...</p>
      </div>
    );
  }

  if (!selectedDestination) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[1.2rem] text-slate-500">
        Destination not found.
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fa] min-h-screen text-gray-800">
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[620px] overflow-hidden max-md:h-[65vh] max-md:min-h-[500px]">
        <img
          src={selectedDestination.bannerImage}
          alt={selectedDestination.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.92)] via-[rgba(15,23,42,0.55)] to-[rgba(15,23,42,0.2)]" />

        <div className="absolute inset-0 flex items-end z-[2]">
          <div className="w-[90%] max-w-[1280px] mx-auto mb-[70px] text-white max-md:mb-10">
            <div className="inline-flex items-center gap-2.5 px-[18px] py-2.5 bg-white/[0.16] backdrop-blur-md border border-white/20 rounded-full text-[0.95rem] font-semibold mb-5">
              <FaGlobe />
              <span>{selectedDestination.continent}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-[-0.03em]">
              {selectedDestination.name}
            </h1>

            <div className="flex flex-wrap gap-4 max-md:gap-3">
              <span className="flex items-center gap-2 px-[18px] py-2.5 bg-white/[0.14] backdrop-blur-md rounded-full font-semibold max-md:text-[0.9rem]">
                <FaMapMarkerAlt className="text-amber-400" />
                {selectedDestination.country}
              </span>

              <span className="flex items-center gap-2 px-[18px] py-2.5 bg-white/[0.14] backdrop-blur-md rounded-full font-semibold max-md:text-[0.9rem]">
                <FaStar className="text-amber-400" />
                {selectedDestination.rating || 4.8}
              </span>

              <span className="flex items-center gap-2 px-[18px] py-2.5 bg-white/[0.14] backdrop-blur-md rounded-full font-semibold max-md:text-[0.9rem]">
                {destinationTours.length} tours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="w-[90%] max-w-[1280px] mx-auto -mt-[55px] relative z-20">
        <div className="grid grid-cols-4 gap-[22px] max-lg:grid-cols-2 max-md:grid-cols-1">
          <div className="bg-white rounded-3xl p-7 flex items-center gap-[18px] shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_55px_rgba(15,23,42,0.12)]">
            <FaGlobe className="text-3xl text-[#006ce4]" />
            <div>
              <span className="block text-gray-500 text-sm mb-1">Continent</span>
              <h4 className="text-[1.1rem] text-gray-900 font-bold">{selectedDestination.continent}</h4>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 flex items-center gap-[18px] shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_55px_rgba(15,23,42,0.12)]">
            <FaMapMarkerAlt className="text-3xl text-[#006ce4]" />
            <div>
              <span className="block text-gray-500 text-sm mb-1">Country</span>
              <h4 className="text-[1.1rem] text-gray-900 font-bold">{selectedDestination.country}</h4>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 flex items-center gap-[18px] shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_55px_rgba(15,23,42,0.12)]">
            <FaCamera className="text-3xl text-[#006ce4]" />
            <div>
              <span className="block text-gray-500 text-sm mb-1">Activities</span>
              <h4 className="text-[1.1rem] text-gray-900 font-bold">
                {selectedDestination.activities?.length || 0}
              </h4>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 flex items-center gap-[18px] shadow-[0_20px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_55px_rgba(15,23,42,0.12)]">
            <FaSuitcaseRolling className="text-3xl text-[#006ce4]" />
            <div>
              <span className="block text-gray-500 text-sm mb-1">Available Tours</span>
              <h4 className="text-[1.1rem] text-gray-900 font-bold">{destinationTours.length}</h4>
            </div>
          </div>
        </div>
      </section>

      <div className="w-[90%] max-w-[1280px] mx-auto mt-[70px] mb-[100px] max-md:w-[calc(100%-32px)] max-md:mt-10">
        {/* ABOUT */}
        <section className="bg-white rounded-[28px] p-[42px] mb-8 shadow-[0_10px_35px_rgba(15,23,42,0.06)] max-md:p-7 max-md:rounded-[22px]">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            About {selectedDestination.name}
          </h2>
          <p className="text-gray-600 leading-[1.9] text-[1.05rem]">
            {selectedDestination.description}
          </p>
        </section>

        {/* ACTIVITIES */}
        {selectedDestination.activities?.length > 0 && (
          <section className="bg-white rounded-[28px] p-[42px] mb-8 shadow-[0_10px_35px_rgba(15,23,42,0.06)] max-md:p-7 max-md:rounded-[22px]">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Popular Activities</h2>

            <div className="flex flex-wrap gap-3.5">
              {selectedDestination.activities.map((activity: string, index: number) => (
                <span
                  key={index}
                  className="px-5 py-3 rounded-full bg-[#e7f0ff] text-[#006ce4] font-bold text-[0.95rem]"
                >
                  {activity}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {selectedDestination.galleryImages?.length > 0 && (
          <section className="bg-white rounded-[28px] p-[42px] mb-8 shadow-[0_10px_35px_rgba(15,23,42,0.06)] max-md:p-7 max-md:rounded-[22px]">
            <div className="flex items-center justify-between gap-5 mb-7 max-md:flex-col max-md:items-start">
              <h2 className="text-3xl font-extrabold text-gray-900">Photo Gallery</h2>
              <span className="text-gray-500 font-semibold">
                {selectedDestination.galleryImages.length} photos
              </span>
            </div>

            <div className="grid grid-cols-12 gap-[18px] max-lg:grid-cols-2 max-md:grid-cols-1">
              {selectedDestination.galleryImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${selectedDestination.name}-${index}`}
                  loading="lazy"
                  className={`w-full object-cover rounded-[20px] transition-transform duration-300 hover:scale-[1.03] max-lg:!h-[260px] max-md:!h-[220px] ${
                    index === 0
                      ? "col-span-6 row-span-2 h-[540px] max-lg:col-span-1 max-lg:row-span-1"
                      : "col-span-3 h-[260px] max-lg:col-span-1"
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {/* TOURS */}
        <section className="bg-white rounded-[28px] p-[42px] mb-8 shadow-[0_10px_35px_rgba(15,23,42,0.06)] max-md:p-7 max-md:rounded-[22px]">
          <div className="flex items-center justify-between gap-5 mb-7 max-md:flex-col max-md:items-start">
            <h2 className="text-3xl font-extrabold text-gray-900">Top Tours</h2>
            <span className="text-gray-500 font-semibold">{destinationTours.length} experiences</span>
          </div>

          {destinationTours.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-[20px] py-[60px] px-[30px] text-center text-gray-500 text-[1.05rem]">
              No tours available yet.
            </div>
          ) : (
            <div className="grid gap-7 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1">
              {destinationTours.map((tour: any) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}