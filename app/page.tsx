"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import {
  FaGlobeAmericas,
  FaHeadset,
  FaShieldAlt,
  FaStar,
  FaSearch,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

import {
  getFeaturedDestinations,
  getPopularDestinations,
} from "@/redux/thunks/destinationThunk";

import DestinationCard from "@/app/components/DestinationCard/DestinationCard";

const continents = [
  "Asia",
  "Europe",
  "Africa",
  "North America",
  "South America",
  "Australia",
];

const trustItems = [
  { icon: <FaStar />, title: "4.8 Average Rating", description: "Thousands of verified traveler reviews." },
  { icon: <FaGlobeAmericas />, title: "500+ Experiences", description: "Curated tours across iconic destinations." },
  { icon: <FaShieldAlt />, title: "Secure Payments", description: "Safe booking with trusted payment methods." },
  { icon: <FaHeadset />, title: "24/7 Support", description: "Dedicated assistance whenever you need it." },
];

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [selectedContinent, setSelectedContinent] = useState("Asia");
  const [heroSearch, setHeroSearch] = useState("");

  const { featuredDestinations, popularDestinations, loading } = useSelector(
    (state: any) => state.destinations
  );

  useEffect(() => {
    dispatch(getFeaturedDestinations() as any);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPopularDestinations(selectedContinent) as any);
  }, [dispatch, selectedContinent]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = heroSearch.trim();
    if (trimmed) {
      router.push(`/search?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <main className="bg-slate-50 overflow-x-hidden">
      {/* HERO */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,22,48,0.45), rgba(8,22,48,0.65)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="min-h-screen flex items-center box-border pt-[136px] pb-[120px] max-md:pt-[116px] max-md:pb-20">
          <div className="w-[min(92%,900px)] mx-auto relative z-10 text-white opacity-100 transition-opacity duration-300 max-md:text-center">
            <span className="inline-flex px-5 py-3 rounded-full bg-white/15 backdrop-blur-md text-sm font-semibold mb-7">
              Trusted by 50,000+ travelers
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-2px] mb-6">
              Discover extraordinary experiences around the world
            </h1>

            <p className="max-w-[700px] text-lg leading-[1.8] text-white/90 mb-8 max-md:mx-auto">
              Book curated tours, adventures, cultural experiences, and hidden
              gems in the world's most iconic destinations.
            </p>

            <form
              className="flex items-stretch gap-4 max-w-[820px] w-full mb-8 max-md:flex-col"
              onSubmit={handleHeroSearch}
            >
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="flex-1 h-16 px-6 rounded-2xl text-base outline-none border-none shadow-[0_12px_32px_rgba(0,0,0,0.15)] text-gray-900"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 flex-shrink-0 min-w-[240px] px-7 h-16 rounded-2xl bg-[#febb02] text-gray-900 font-bold whitespace-nowrap box-border transition-transform duration-300 hover:-translate-y-0.5 max-md:w-full max-md:min-w-0"
              >
                <FaSearch className="w-[18px] h-[18px] flex-shrink-0" />
                <span>Search Experiences</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-4 mb-12 max-md:flex-col">
              <Link
                href="/search"
                className="inline-flex items-center justify-center min-h-14 px-7 py-4 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 bg-[#003b95] text-white hover:bg-[#0057b8] hover:-translate-y-0.5 max-md:w-full"
              >
                Explore Tours
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center min-h-14 px-7 py-4 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 bg-white/10 border border-white/25 text-white backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 max-md:w-full"
              >
                View Destinations
              </Link>
            </div>

            <div className="flex gap-12 max-md:flex-wrap max-md:justify-center max-md:gap-6">
              <div>
                <strong className="block text-3xl mb-1.5">50K+</strong>
                <span className="text-white/80">Travelers</span>
              </div>
              <div>
                <strong className="block text-3xl mb-1.5">500+</strong>
                <span className="text-white/80">Experiences</span>
              </div>
              <div>
                <strong className="block text-3xl mb-1.5">4.8★</strong>
                <span className="text-white/80">Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="w-[min(92%,1320px)] mx-auto -mt-[70px] relative z-[5] max-md:-mt-10">
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="bg-white p-7 rounded-3xl border border-gray-200 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 text-[#003b95] text-xl mb-4">
                {item.icon}
              </div>
              <h3 className="text-gray-900 mb-3 font-semibold">{item.title}</h3>
              <p className="text-slate-500 leading-[1.7]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="w-[min(92%,1320px)] mx-auto relative top-[63px] pt-28">
        <div className="flex justify-between items-end gap-8 mb-10 max-md:flex-col max-md:items-start">
          <div>
            <span className="inline-block text-[#003b95] text-sm font-bold uppercase tracking-wide mb-3">
              Featured
            </span>
            <h2 className="text-gray-900 text-4xl md:text-5xl mb-3">Featured Destinations</h2>
            <p className="text-slate-500 leading-[1.7]">
              Handpicked destinations designed for unforgettable journeys.
            </p>
          </div>
          <Link href="/search" className="text-[#003b95] no-underline font-bold">
            View All
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 py-12">Loading destinations...</p>
        ) : !featuredDestinations?.length ? (
          <p className="text-center text-slate-500 py-12">No destinations available.</p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={featuredDestinations.length > 3}
            spaceBetween={28}
            breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
            className="!px-8 !pt-4 !pb-12 max-md:!px-2"
          >
            {featuredDestinations.map((destination: any) => (
              <SwiperSlide key={destination._id} className="!flex !h-auto">
                <DestinationCard destination={destination} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* POPULAR */}
      <section className="w-[min(92%,1320px)] mx-auto relative top-[63px]">
        <div className="flex justify-between items-end gap-8 mb-10 max-md:flex-col max-md:items-start">
          <div>
            <span className="inline-block text-[#003b95] text-sm font-bold uppercase tracking-wide mb-3">
              Trending
            </span>
            <h2 className="text-gray-900 text-4xl md:text-5xl mb-3">Popular in {selectedContinent}</h2>
            <p className="text-slate-500 leading-[1.7]">
              Explore top-rated destinations across every continent.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={
                selectedContinent === continent
                  ? "bg-[#003b95] border border-[#003b95] text-white px-6 py-3.5 rounded-full font-semibold transition-all duration-300"
                  : "bg-white border border-gray-200 text-slate-600 px-6 py-3.5 rounded-full font-semibold transition-all duration-300"
              }
            >
              {continent}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-slate-500 py-12">Loading destinations...</p>
        ) : !popularDestinations?.length ? (
          <p className="text-center text-slate-500 py-12">No popular destinations available.</p>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop={popularDestinations.length > 3}
            spaceBetween={28}
            breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
            className="!px-8 !pt-4 !pb-12 max-md:!px-2"
          >
            {popularDestinations.map((destination: any) => (
              <SwiperSlide key={destination._id} className="!flex !h-auto">
                <DestinationCard destination={destination} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* MAP */}
      <section className="w-[min(92%,1320px)] mx-auto relative top-[63px]">
        <div className="flex flex-col items-center text-center pt-[4%]">
          <span className="inline-block text-[#003b95] text-sm font-bold uppercase tracking-wide mb-3">
            Explore
          </span>
          <h2 className="text-gray-900 text-4xl md:text-5xl mb-3">Explore the World</h2>
          <p className="text-slate-500 leading-[1.7]">Discover experiences across every continent.</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
          <iframe
            title="Global Travel Map"
            src="https://maps.google.com/maps?q=20,0&z=2&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[540px] max-md:h-[360px] border-0"
          />
        </div>
      </section>
    </main>
  );
}