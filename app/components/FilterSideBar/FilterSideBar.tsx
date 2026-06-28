"use client";

import { useState } from "react";
import {
  FaGlobeAsia,
  FaHiking,
  FaClock,
  FaDollarSign,
  FaSortAmountDown,
  FaRedo,
} from "react-icons/fa";

import { countries } from "@/utils/countries";

type Filters = {
  country: string;
  continent: string;
  activity: string;
  duration: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

const initialFilters: Filters = {
  country: "",
  continent: "",
  activity: "",
  duration: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
};

type FilterSidebarProps = {
  onFilter: (filters: Record<string, string>) => void;
};

export default function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilters = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    onFilter(cleanedFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilter({});
  };

  return (
    <aside className="sticky top-[100px] bg-white border border-gray-200 rounded-3xl p-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)] max-lg:static max-lg:mb-8 max-sm:p-5 max-sm:rounded-[20px] h-fit">
      <div className="flex justify-between items-start mb-8 max-sm:flex-col max-sm:gap-4">
        <div>
          <span className="block mb-2 text-[0.75rem] font-bold tracking-[0.18em] text-[#006ce4]">
            REFINE RESULTS
          </span>
          <h2 className="text-gray-900 text-[1.8rem]">Filters</h2>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-2 bg-transparent border-none text-gray-500 font-semibold cursor-pointer transition-colors duration-200 hover:text-[#006ce4]"
        >
          <FaRedo />
          Reset
        </button>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2.5 mb-3 text-gray-700 text-[0.95rem] font-semibold">
          <FaGlobeAsia /> Country
        </label>
        <select
          name="country"
          value={filters.country}
          onChange={handleChange}
          className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
        >
          <option value="">All Countries</option>
          {countries.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2.5 mb-3 text-gray-700 text-[0.95rem] font-semibold">
          <FaGlobeAsia /> Continent
        </label>
        <select
          name="continent"
          value={filters.continent}
          onChange={handleChange}
          className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
        >
          <option value="">All Continents</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Africa">Africa</option>
          <option value="Australia">Australia</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2.5 mb-3 text-gray-700 text-[0.95rem] font-semibold">
          <FaHiking /> Activity
        </label>
        <input
          type="text"
          name="activity"
          value={filters.activity}
          onChange={handleChange}
          className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2.5 mb-3 text-gray-700 text-[0.95rem] font-semibold">
          <FaClock /> Duration
        </label>
        <input
          type="number"
          name="duration"
          value={filters.duration}
          onChange={handleChange}
          className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2.5 mb-3 text-gray-700 text-[0.95rem] font-semibold">
          <FaDollarSign /> Price Range
        </label>
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2.5 mb-3 text-gray-700 text-[0.95rem] font-semibold">
          <FaSortAmountDown /> Sort By
        </label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="w-full px-4 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 text-[0.95rem] transition-all duration-200 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
        >
          <option value="">Newest First</option>
          <option value="price_asc">Low → High</option>
          <option value="price_desc">High → Low</option>
          <option value="rating_desc">Highest Rated</option>
        </select>
      </div>

      <button
        type="button"
        onClick={applyFilters}
        className="w-full py-4 border-none rounded-2xl bg-[#006ce4] text-white text-base font-bold cursor-pointer transition-all duration-300 hover:bg-[#0058bc] hover:-translate-y-0.5"
      >
        Apply Filters
      </button>
    </aside>
  );
}