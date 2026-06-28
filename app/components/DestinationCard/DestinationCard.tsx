import Link from "next/link";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

type Destination = {
  _id: string;
  name: string;
  bannerImage: string;
  continent?: string;
  toursCount?: number;
};

type DestinationCardProps = {
  destination: Destination;
};

export default function DestinationCard({ destination }: DestinationCardProps) {
  if (!destination) return null;

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]">
      {/* IMAGE */}
      <div className="relative overflow-hidden h-[280px] max-md:h-[240px]">
        <img
          src={destination.bannerImage}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

        <span className="absolute top-[18px] left-[18px] px-3.5 py-2 bg-white/95 text-[#003b95] rounded-full text-sm font-bold backdrop-blur-md">
          Featured
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-6 max-md:p-5">
        <div className="flex justify-between items-center gap-4 mb-4 text-slate-500 text-sm flex-wrap">
          <span className="flex items-center gap-1.5">
            <FaMapMarkerAlt />
            {destination.continent || "Worldwide"}
          </span>
          <span>{destination.toursCount || 0}+ experiences</span>
        </div>

        <h3 className="text-gray-900 text-2xl max-md:text-[1.3rem] font-bold mb-3 leading-tight">
          {destination.name}
        </h3>

        <p className="text-slate-500 leading-[1.7] mb-7 flex-1">
          Discover curated tours, authentic local experiences, and unforgettable
          adventures.
        </p>

        <Link
          href={`/destinations/${destination._id}`}
          className="inline-flex items-center gap-3 text-[#003b95] no-underline font-bold transition-all duration-300 hover:gap-4"
        >
          Explore destination
          <FaArrowRight />
        </Link>
      </div>
    </article>
  );
}