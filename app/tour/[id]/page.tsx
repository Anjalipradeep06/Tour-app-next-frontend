"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";

import DestinationMap from "@/app/components/DestinationMap/DestinationMap";
import Reviews from "@/app/components/Reviews/Reviews";

import { getTourById } from "@/redux/thunks/tourThunk";

export default function TourDetails() {
  const params = useParams();
  const id = params.id as string;

  const dispatch = useDispatch();

  const { selectedTour, loading, error } = useSelector((state: any) => state.tours);

  useEffect(() => {
    dispatch(getTourById(id) as any);
  }, [dispatch, id]);

  // Hash-based scroll: window.location.hash is browser-only and isn't
  // tracked by Next's router, so we read it directly here instead of
  // via a router hook.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash === "#reviews" && selectedTour) {
      const el = document.getElementById("reviews");

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [selectedTour]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[1.1rem] text-gray-500">
        Loading experience...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[1.1rem] text-gray-500">
        {error}
      </div>
    );
  }

  if (!selectedTour) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[1.1rem] text-gray-500">
        Tour not found.
      </div>
    );
  }

  const tour = selectedTour;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-800">
      {/* HERO */}
      <section className="relative h-[72vh] min-h-[560px] overflow-hidden max-md:h-[60vh] max-md:min-h-[460px]">
        <img
          src={
            tour.destination?.bannerImage ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          }
          alt={tour.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,18,32,0.9)] via-[rgba(11,18,32,0.45)] to-[rgba(11,18,32,0.2)]" />

        <div className="absolute inset-0 z-[2] flex items-end">
          <div className="w-[90%] max-w-[1320px] mx-auto pb-20 text-white max-md:pb-12">
            <p className="inline-flex px-4 py-2 rounded-full bg-white/[0.14] backdrop-blur-md text-[0.8rem] font-semibold tracking-[1.5px] mb-5">
              ITINERARY #{tour?._id ? tour._id.slice(-6).toUpperCase() : "------"}
            </p>

            <h1 className="max-w-[800px] text-[clamp(2.5rem,5vw,4.8rem)] leading-[1.1] mb-4 font-extrabold max-[480px]:text-[2.2rem]">
              {tour.title}
            </h1>

            <p className="flex items-center gap-3 text-[1.05rem] text-white/90">
              <FaMapMarkerAlt className="text-white" />
              {tour.destination?.country || "Unknown Country"}
              {tour.destination?.continent && `, ${tour.destination.continent}`}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="w-[90%] max-w-[1320px] mx-auto -mt-[70px] grid grid-cols-[minmax(0,2fr)_380px] gap-8 relative z-10 max-[1100px]:grid-cols-1 max-[1100px]:-mt-10 max-md:w-[94%]">
        {/* LEFT COLUMN */}
        <div className="min-w-0">
          <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-6 max-md:p-6">
            <h2 className="text-[1.6rem] mb-5 text-gray-900">Overview</h2>
            <p className="text-gray-500 leading-[1.8]">{tour.description}</p>
          </section>

          {tour.highlights?.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-6 max-md:p-6">
              <h2 className="text-[1.6rem] mb-5 text-gray-900">Highlights</h2>
              <ul className="pl-5 list-disc">
                {tour.highlights.map((item: string, index: number) => (
                  <li key={index} className="text-gray-500 leading-[1.8] mb-3.5 last:mb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tour.activities?.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-6 max-md:p-6">
              <h2 className="text-[1.6rem] mb-5 text-gray-900">Activities</h2>
              <div className="flex flex-wrap gap-3">
                {tour.activities.map((activity: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-3 bg-[#eef5ff] text-[#006ce4] rounded-full font-semibold text-[0.9rem]"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {tour.itinerary?.length > 0 && (
            <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-6 max-md:p-6">
              <h2 className="text-[1.6rem] mb-5 text-gray-900">Itinerary</h2>

              {tour.itinerary.map((day: any) => (
                <div
                  key={day.day}
                  className="relative p-6 mb-4 bg-[#fafafa] border border-gray-200 rounded-[18px] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[5px] before:rounded-l-[18px] before:bg-[#006ce4]"
                >
                  <h3 className="text-[#006ce4] text-[0.95rem] mb-2">Day {day.day}</h3>
                  <h4 className="mb-3 text-gray-900">{day.title}</h4>
                  <p className="text-gray-500 leading-[1.8]">{day.description}</p>
                </div>
              ))}
            </section>
          )}

          {(tour.inclusions?.length > 0 || tour.exclusions?.length > 0) && (
            <section className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {tour.inclusions?.length > 0 && (
                <div className="bg-[#fafafa] border border-gray-200 rounded-[18px] p-6">
                  <h2 className="text-[1.6rem] mb-5 text-gray-900">Included</h2>
                  {tour.inclusions.map((item: string, index: number) => (
                    <p key={index} className="flex items-start gap-3 mb-4">
                      <FaCheckCircle className="mt-1 text-green-600" />
                      <span className="text-gray-500 leading-[1.8]">{item}</span>
                    </p>
                  ))}
                </div>
              )}

              {tour.exclusions?.length > 0 && (
                <div className="bg-[#fafafa] border border-gray-200 rounded-[18px] p-6">
                  <h2 className="text-[1.6rem] mb-5 text-gray-900">Excluded</h2>
                  {tour.exclusions.map((item: string, index: number) => (
                    <p key={index} className="flex items-start gap-3 mb-4">
                      <FaTimesCircle className="mt-1 text-red-600" />
                      <span className="text-gray-500 leading-[1.8]">{item}</span>
                    </p>
                  ))}
                </div>
              )}
            </section>
          )}

          <section id="reviews">
            <Reviews
              tourId={tour._id}
              averageRating={tour.averageRating}
              totalReviews={tour.totalReviews}
            />
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="sticky top-[100px] h-fit max-[1100px]:static">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-[0_20px_40px_rgba(15,23,42,0.08)] max-md:p-6">
            <h2 className="text-[2.75rem] text-gray-900 mb-1.5 max-[480px]:text-[2.25rem]">
              ₹{Number(tour.price).toLocaleString()}
            </h2>
            <p className="text-gray-500 mb-6">per traveler</p>

            <div className="grid gap-4 mb-8">
              <span className="flex items-center gap-3.5 text-gray-800 font-medium">
                <FaClock className="text-[#006ce4]" />
                {tour.duration} Days
              </span>

              <span className="flex items-center gap-3.5 text-gray-800 font-medium">
                <FaUsers className="text-[#006ce4]" />
                {tour.availableSlots} seats available
              </span>

              <span className="flex items-center gap-3.5 text-gray-800 font-medium">
                <FaStar className="text-[#006ce4]" />
                {tour.averageRating || 0} rating
              </span>

              <span className="flex items-center gap-3.5 text-gray-800 font-medium">
                <FaShieldAlt className="text-[#006ce4]" />
                Secure booking
              </span>

              <span className="flex items-center gap-3.5 text-gray-800 font-medium">
                <FaBolt className="text-[#006ce4]" />
                Instant confirmation
              </span>
            </div>

            <Link
              href={`/book-tour/${tour._id}`}
              className="flex items-center justify-center w-full py-4 rounded-2xl bg-[#006ce4] text-white no-underline font-bold transition-all duration-200 hover:bg-[#0057b8] hover:-translate-y-0.5"
            >
              Reserve Now
            </Link>
          </div>

          {tour.meetingPoint?.address && (
            <div className="mt-6 bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="mb-4 text-gray-900">Meeting Point</h3>
              <p className="text-gray-500 leading-[1.7] mb-4">{tour.meetingPoint.address}</p>

              {tour.meetingPoint.latitude && tour.meetingPoint.longitude && (
                <DestinationMap
                  latitude={tour.meetingPoint.latitude}
                  longitude={tour.meetingPoint.longitude}
                />
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}