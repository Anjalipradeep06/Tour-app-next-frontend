import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-[100px]">
      <div className="w-[min(92%,1320px)] mx-auto py-[72px] pb-12 grid grid-cols-[2fr_1fr_1fr_1.3fr] gap-12 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-9">
        {/* BRAND */}
        <div>
          <Link
            href="/"
            className="no-underline text-[#003b95] text-3xl font-extrabold tracking-[-0.5px]"
          >
            MERIDIAN
          </Link>

          <p className="mt-5 text-slate-500 leading-[1.8] max-w-[360px] text-[0.95rem] max-sm:max-w-full">
            Discover curated tours, immersive experiences, and unforgettable
            adventures across the world&apos;s most iconic destinations.
          </p>

          <div className="flex gap-3.5 mt-7">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center text-[#003b95] no-underline transition-all duration-300 hover:bg-[#003b95] hover:text-white hover:-translate-y-0.5"
            />
              <FaFacebookF />
            <a

            
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center text-[#003b95] no-underline transition-all duration-300 hover:bg-[#003b95] hover:text-white hover:-translate-y-0.5"
            />
              <FaInstagram />
            <a

            
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="w-[42px] h-[42px] rounded-full bg-slate-100 flex items-center justify-center text-[#003b95] no-underline transition-all duration-300 hover:bg-[#003b95] hover:text-white hover:-translate-y-0.5"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="text-gray-900 text-[1.05rem] font-bold mb-[22px]">Explore</h3>

          <Link href="/" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Home
          </Link>
          <Link href="/search" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Tours
          </Link>
          <Link href="/bookings" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            My Bookings
          </Link>
          <Link href="/profile" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Profile
          </Link>
        </div>

        {/* DESTINATIONS */}
        <div>
          <h3 className="text-gray-900 text-[1.05rem] font-bold mb-[22px]">Popular Destinations</h3>

          <Link href="/search?destination=dubai" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Dubai
          </Link>
          <Link href="/search?destination=switzerland" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Switzerland
          </Link>
          <Link href="/search?destination=japan" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Japan
          </Link>
          <Link href="/search?destination=maldives" className="block mb-3.5 text-slate-500 no-underline transition-colors duration-200 hover:text-[#003b95]">
            Maldives
          </Link>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-gray-900 text-[1.05rem] font-bold mb-[22px]">Contact</h3>

          <p className="flex items-center gap-3 text-slate-500 mb-4 leading-relaxed">
            <FaMapMarkerAlt className="text-[#003b95] flex-shrink-0" />
            New York, USA
          </p>

          <p className="flex items-center gap-3 text-slate-500 mb-4 leading-relaxed">
            <FaEnvelope className="text-[#003b95] flex-shrink-0" />
            support@meridian.com
          </p>

          <p className="flex items-center gap-3 text-slate-500 mb-4 leading-relaxed">
            <FaPhoneAlt className="text-[#003b95] flex-shrink-0" />
            +1 (800) 555-0148
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="w-[min(92%,1320px)] mx-auto border-t border-gray-200 py-6 flex justify-between items-center max-sm:flex-col max-sm:gap-4 max-sm:text-center">
        <p className="text-slate-400 text-[0.9rem]">
          © {new Date().getFullYear()} Meridian. All rights reserved.
        </p>

        <div className="flex gap-6 max-sm:flex-wrap max-sm:justify-center">
          <Link href="/privacy" className="no-underline text-slate-500 text-[0.9rem] transition-colors duration-200 hover:text-[#003b95]">
            Privacy Policy
          </Link>
          <Link href="/terms" className="no-underline text-slate-500 text-[0.9rem] transition-colors duration-200 hover:text-[#003b95]">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}