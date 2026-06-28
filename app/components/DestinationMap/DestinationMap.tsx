import { FaMapMarkerAlt, FaExternalLinkAlt } from "react-icons/fa";

type DestinationMapProps = {
  latitude: number | string;
  longitude: number | string;
  destinationName?: string;
};

export default function DestinationMap({
  latitude,
  longitude,
  destinationName = "Destination",
}: DestinationMapProps) {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="mt-12">
      <div className="flex justify-between items-start gap-8 mb-6 max-md:flex-col">
        <div>
          <span className="inline-block mb-3 text-[0.8rem] font-bold tracking-[0.18em] text-[#006ce4]">
            LOCATION
          </span>

          <h3 className="flex items-center gap-3 mb-3 text-gray-900 text-[1.8rem] font-bold max-md:text-2xl">
            <FaMapMarkerAlt />
            Explore {destinationName}
          </h3>

          <p className="text-gray-500 leading-[1.7]">
            Discover the meeting point and nearby attractions.
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 px-6 py-[0.95rem] border border-[#dbe4f0] rounded-2xl bg-white text-gray-900 no-underline font-semibold transition-all duration-300 hover:bg-[#006ce4] hover:text-white hover:border-[#006ce4] hover:-translate-y-0.5 max-md:w-full max-md:justify-center"
        >
          Get Directions
          <FaExternalLinkAlt />
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
        <iframe
          title={`${destinationName} Map`}
          src={mapUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full h-[480px] border-none max-md:h-[350px]"
        />
      </div>
    </section>
  );
}