"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

import SearchBar from "@/app/components/SearchBar/SearchBar";
import FilterSidebar from "@/app/components/FilterSideBar/FilterSideBar";
import TourCard from "@/app/components/TourCard/TourCard";

import { getAllTours } from "@/redux/thunks/tourThunk";
import { clearTourError } from "@/redux/slices/tourSlice";

const SYNCABLE_KEYS = ["search", "country", "continent", "activity"];

export default function SearchTours() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { tours, loading, error, total, pages } = useSelector((state: any) => state.tours);

  const [page, setPage] = useState(1);

  const [queryParams, setQueryParams] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    SYNCABLE_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) initial[key] = value;
    });
    return initial;
  });

  const limit = 12;

  /* FETCH (search/filter/page driven) */
  useEffect(() => {
    dispatch(getAllTours({ ...queryParams, page, limit }) as any);
  }, [dispatch, page, queryParams]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearTourError());
    }
  }, [error, dispatch]);

  /* Keeps the URL's query string in sync with active filters */
  const syncUrl = (nextParams: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());

    SYNCABLE_KEYS.forEach((key) => next.delete(key));

    Object.entries(nextParams).forEach(([key, value]) => {
      if (SYNCABLE_KEYS.includes(key) && value) {
        next.set(key, value);
      }
    });

    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  /* SEARCH (from SearchBar) */
  const handleSearch = (searchValues: Record<string, string>) => {
  setPage(1);

  const merged = {
    ...queryParams,
    ...searchValues,
  };

  setQueryParams(merged);
  syncUrl(merged);
};

  /* FILTER (from FilterSidebar) */
 const handleFilter = (filterValues: Record<string, string>) => {
  setPage(1);

  const merged = {
    ...queryParams,
    ...filterValues,
  };

  setQueryParams(merged);
  syncUrl(merged);
};

  /* RESET — hard navigation on purpose, same as original */
  const handleReset = () => {
    window.location.href = `${window.location.origin}/search`;
  };

  /* PAGINATION */
  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, pages));
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section
        className="relative h-[460px] bg-cover bg-center bg-no-repeat max-md:h-[400px] max-sm:h-[360px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[rgba(15,23,42,0.65)] to-[rgba(15,23,42,0.45)]">
          <div className="w-[90%] max-w-[900px] text-center text-white">
            <span className="inline-block mb-4 px-4 py-2.5 rounded-full bg-white/[0.14] backdrop-blur-md text-[0.8rem] font-bold tracking-[0.18em]">
              DISCOVER EXPERIENCES WORLDWIDE
            </span>

            <h1 className="mb-4 text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.1] max-sm:text-[2.4rem]">
              Find tours crafted for every kind of traveler
            </h1>

            <p className="max-w-[700px] mx-auto text-white/90 text-[1.1rem] leading-[1.8]">
              Explore handpicked adventures, cultural experiences, guided tours,
              and unforgettable activities across the globe.
            </p>
          </div>
        </div>
      </section>

      <SearchBar onSearch={handleSearch} initialValues={queryParams} />

      <div className="w-[90%] max-w-[1400px] mx-auto mt-16 mb-20 grid grid-cols-[320px_1fr] gap-8 max-lg:grid-cols-[280px_1fr] max-md:grid-cols-1 max-md:w-[calc(100%-2rem)] max-md:mt-8">
        <FilterSidebar onFilter={handleFilter} />

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="mb-2 text-gray-900 text-3xl max-md:text-[1.6rem]">
                {loading ? "Finding experiences..." : `${total || tours.length} packages found`}
              </h2>
              <p className="text-gray-500">Curated tours from trusted operators worldwide.</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex-shrink-0 px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-[0.9rem] font-semibold cursor-pointer transition-all duration-150 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
            >
              Reset
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[350px] bg-white border border-gray-200 rounded-3xl text-center text-gray-500 text-[1.1rem] font-semibold">
              <p>Loading tours...</p>
            </div>
          ) : tours.length > 0 ? (
            <>
              {/* TOURS GRID */}
              <div className="grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1">
                {tours.map((tour: any) => (
                  <TourCard key={tour._id} tour={tour} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600"
                >
                  Prev
                </button>

                <span className="text-gray-600 font-medium">
                  Page {page} of {pages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={page === pages}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[350px] bg-white border border-gray-200 rounded-3xl text-center px-6">
              <h3 className="mb-3 text-gray-900 text-[1.8rem]">No experiences found</h3>
              <p className="max-w-[420px] text-gray-500 leading-[1.7]">
                Try adjusting your search or filters to discover more destinations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}