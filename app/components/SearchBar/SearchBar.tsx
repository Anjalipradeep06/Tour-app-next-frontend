"use client";

import { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaGlobeEurope, FaHiking } from "react-icons/fa";

import { countries } from "@/utils/countries";

type Filters = {
  search: string;
  country: string;
  continent: string;
  activity: string;
};

const emptyFilters: Filters = {
  search: "",
  country: "",
  continent: "",
  activity: "",
};

type SearchBarProps = {
  onSearch: (filters: Record<string, string>) => void;
  initialValues?: Partial<Filters>;
};

// initialValues lets a parent (e.g. SearchTours reading a `?search=`
// URL param coming from Home's hero search) pre-fill the form on
// first load, so the inputs visually match results already being
// shown instead of looking empty. This is read ONCE on mount only —
// SearchBar fully owns `filters` after that. It does not re-sync if
// initialValues changes later, so picking a filter on this page never
// clobbers text the user has already typed here.
export default function SearchBar({ onSearch, initialValues }: SearchBarProps) {
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    onSearch(cleanedFilters);
  };

  return (
    <section className="w-full relative z-20 -mt-14 flex justify-center px-6 max-md:-mt-10 max-md:px-4">
      <form
        className="w-full max-w-[1320px] grid [grid-template-columns:2fr_1.2fr_1.2fr_1.2fr_auto] gap-4 p-4 bg-white/96 backdrop-blur-[18px] border border-gray-200/80 rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.12)] max-[1200px]:grid-cols-2 max-md:grid-cols-1 max-md:p-4 max-md:rounded-[20px]"
        onSubmit={handleSearch}
      >
        <div className="flex items-center gap-3.5 min-h-[72px] px-5 border border-gray-200 rounded-2xl bg-white transition-all duration-300 hover:border-slate-300 focus-within:border-[#006ce4] focus-within:shadow-[0_0_0_4px_rgba(0,108,228,0.12)] max-md:min-h-16">
          <FaSearch className="flex-shrink-0 text-[#006ce4] text-base" />
          <input
            type="text"
            name="search"
            placeholder="Search tours..."
            value={filters.search}
            onChange={handleChange}
            className="w-full border-none outline-none bg-transparent text-gray-900 text-[0.95rem] font-medium placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3.5 min-h-[72px] px-5 border border-gray-200 rounded-2xl bg-white transition-all duration-300 hover:border-slate-300 focus-within:border-[#006ce4] focus-within:shadow-[0_0_0_4px_rgba(0,108,228,0.12)] max-md:min-h-16">
          <FaMapMarkerAlt className="flex-shrink-0 text-[#006ce4] text-base" />
          <select
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="w-full border-none outline-none bg-transparent text-gray-900 text-[0.95rem] font-medium"
          >
            <option value="">Any Country</option>
            {countries.map((country: string) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3.5 min-h-[72px] px-5 border border-gray-200 rounded-2xl bg-white transition-all duration-300 hover:border-slate-300 focus-within:border-[#006ce4] focus-within:shadow-[0_0_0_4px_rgba(0,108,228,0.12)] max-md:min-h-16">
          <FaGlobeEurope className="flex-shrink-0 text-[#006ce4] text-base" />
          <select
            name="continent"
            value={filters.continent}
            onChange={handleChange}
            className="w-full border-none outline-none bg-transparent text-gray-900 text-[0.95rem] font-medium"
          >
            <option value="">Any Continent</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Africa">Africa</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <div className="flex items-center gap-3.5 min-h-[72px] px-5 border border-gray-200 rounded-2xl bg-white transition-all duration-300 hover:border-slate-300 focus-within:border-[#006ce4] focus-within:shadow-[0_0_0_4px_rgba(0,108,228,0.12)] max-md:min-h-16">
          <FaHiking className="flex-shrink-0 text-[#006ce4] text-base" />
          <input
            type="text"
            name="activity"
            placeholder="Hiking, Safari..."
            value={filters.activity}
            onChange={handleChange}
            className="w-full border-none outline-none bg-transparent text-gray-900 text-[0.95rem] font-medium placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="min-w-[140px] border-none rounded-2xl bg-[#006ce4] text-white text-base font-bold cursor-pointer transition-all duration-300 hover:bg-[#0058bc] hover:-translate-y-0.5 active:translate-y-0 max-[1200px]:min-h-[72px] max-md:min-h-16 max-md:w-full"
        >
          Search
        </button>
      </form>
    </section>
  );
}