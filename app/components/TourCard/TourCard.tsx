import Link from "next/link";
import { FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";

type Tour = {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  price: number;
  averageRating?: number;
  activities?: string[];
  destination?: {
    bannerImage?: string;
    country?: string;
    continent?: string;
  };
};

type TourCardProps = {
  tour: Tour;
};

export default function TourCard({ tour }: TourCardProps) {
  const image =
    tour.destination?.bannerImage ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80";

  return (
    <article className="bg-white border border-[#e7ecf3] rounded-[18px] overflow-hidden flex flex-col h-full transition-all duration-300 shadow-[0_4px_18px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
      {/* IMAGE */}
      <div className="relative h-[240px] flex-shrink-0 max-md:h-[220px]">
        <img src={image} alt={tour.title} className="w-full h-full object-cover" />

        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-[#003b95] text-white rounded-[10px] text-sm font-bold">
          <FaStar className="text-[#febb02]" />
          <span>{tour.averageRating?.toFixed(1) || "4.8"}</span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-[22px] flex flex-col flex-1">
        {/* LOCATION */}
        <div className="flex items-center gap-2 min-h-6 mb-3 text-gray-500 text-[0.95rem]">
          <FaMapMarkerAlt className="text-[#006ce4] flex-shrink-0" />
          <span>
            {tour.destination?.country || "International"}{" "}
            {tour.destination?.continent && `• ${tour.destination.continent}`}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="mb-3 pt-3 text-gray-900 text-[1.3rem] font-bold leading-[1.4] line-clamp-2 min-h-[calc(1.4em*2)]">
          {tour.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mb-[18px] text-gray-500 text-[0.95rem] leading-[1.7] line-clamp-3 min-h-[calc(1.7em*3)]">
          {tour.description && tour.description.length > 110
            ? `${tour.description.slice(0, 110)}...`
            : tour.description}
        </p>

        {/* META */}
        <div className="flex flex-wrap gap-3.5 min-h-6 mb-6 text-gray-600 text-[0.92rem]">
          <span className="flex items-center gap-1.5">
            <FaClock className="text-[#006ce4] flex-shrink-0" />
            {tour.duration} days
          </span>

          <span className="flex items-center gap-1.5">
            {tour.activities?.slice(0, 2).join(" • ")}
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-auto flex justify-between items-end gap-5 max-md:flex-col max-md:items-stretch">
          <div className="flex flex-col">
            <span className="text-gray-500 text-[0.8rem] mb-1">From</span>
            <h4 className="text-gray-900 text-[1.8rem] font-extrabold">
              ₹{Number(tour.price).toLocaleString()}
            </h4>
            <small className="text-gray-500 mt-1">per person</small>
          </div>

          <Link
            href={`/tour/${tour._id}`}
            className="inline-flex items-center justify-center min-h-[46px] px-[18px] py-3 bg-[#0071c2] text-white rounded-[10px] no-underline font-bold whitespace-nowrap transition-all duration-200 hover:bg-[#005999] hover:-translate-y-px max-md:w-full"
          >
            View deal
          </Link>
        </div>
      </div>
    </article>
  );
}