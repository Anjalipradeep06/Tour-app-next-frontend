"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { logout, clearMessage, clearError } from "@/redux/slices/authSlice";
import { getUserBookings } from "@/redux/thunks/bookingThunk";

import EditProfileModal from "@/app/components/EditProfileModal/EditProfileModal";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, message, error } = useSelector((state: any) => state.auth);

  const { totalBookings } = useSelector(
    (state: any) => state.booking || { totalBookings: 0 }
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(getUserBookings({ page: 1, limit: 5 }) as any);
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Avoid hydration mismatch: until mounted, render the same
  // "loading" shell on server and client regardless of auth state.
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50" />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="pt-[140px] text-center text-slate-500">
          <h2>User not found</h2>
        </div>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-slate-50 [-webkit-font-smoothing:antialiased]">
      {/* HERO */}
      <section
        className="relative h-[340px] bg-cover bg-center bg-no-repeat max-md:h-[300px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,23,42,0.7)] to-[rgba(15,23,42,0.5)]" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="w-[90%] max-w-[1200px] mx-auto mb-12 flex items-center gap-6 text-white relative z-[2] max-md:flex-col max-md:text-center max-md:mb-8">
            <div className="w-[112px] h-[112px] rounded-full bg-white/[0.14] backdrop-blur-[16px] flex items-center justify-center text-[2.7rem] font-bold border-[3px] border-white/25 shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-[1.03] max-md:w-[90px] max-md:h-[90px] max-md:text-2xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <span className="inline-block mb-[0.7rem] px-[0.85rem] py-2 bg-white/[0.14] border border-white/25 rounded-full text-[0.72rem] font-bold tracking-[0.12em] backdrop-blur-[10px]">
                VERIFIED TRAVELER
              </span>

              <h1 className="text-[2.6rem] mb-1 tracking-[-0.02em] max-md:text-2xl">{user.name}</h1>
              <p className="text-white/85 relative bottom-[11px]">{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="w-[90%] max-w-[1200px] mx-auto -mt-[55px] mb-20 relative z-10 max-md:w-[calc(100%-2rem)] max-md:-mt-[30px]">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-8 max-lg:grid-cols-1">
          <div className="bg-white rounded-[22px] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] text-center border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <h3 className="text-slate-900 text-[1.9rem] mb-1.5">{totalBookings}</h3>
            <span className="text-slate-500 text-[0.9rem]">Total Bookings</span>
          </div>

          <div className="bg-white rounded-[22px] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] text-center border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <h3 className="text-slate-900 text-[1.9rem] mb-1.5">{joinDate}</h3>
            <span className="text-slate-500 text-[0.9rem]">Member Since</span>
          </div>

          <div className="bg-white rounded-[22px] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] text-center border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <h3 className="text-slate-900 text-[1.9rem] mb-1.5">
              {user.role === "admin" ? "Admin" : "Traveler"}
            </h3>
            <span className="text-slate-500 text-[0.9rem]">Account Type</span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-[2fr_1fr] gap-8 max-lg:grid-cols-1">
          {/* ACCOUNT INFO */}
          <div className="bg-white rounded-[22px] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] border border-slate-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] max-md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-slate-900 text-[1.35rem] tracking-[-0.01em]">Account Information</h2>

              <button
                onClick={() => setShowEditModal(true)}
                className="text-slate-500 hover:text-[#006ce4] transition-colors duration-200"
                aria-label="Edit profile"
              >
                <FaPencilAlt />
              </button>
            </div>

            <div className="py-4 border-b border-gray-200">
              <span className="block mb-1.5 text-slate-500 text-[0.85rem]">Full Name</span>
              <p className="text-slate-900 font-semibold break-words">{user.name}</p>
            </div>

            <div className="py-4 border-b border-gray-200">
              <span className="block mb-1.5 text-slate-500 text-[0.85rem]">Email Address</span>
              <p className="text-slate-900 font-semibold break-words">{user.email}</p>
            </div>

            <div className="py-4 border-b border-gray-200">
              <span className="block mb-1.5 text-slate-500 text-[0.85rem]">Role</span>
              <p className="text-slate-900 font-semibold break-words">
                {user.role === "admin" ? "Administrator" : "Traveler"}
              </p>
            </div>

            <div className="py-4">
              <span className="block mb-1.5 text-slate-500 text-[0.85rem]">Member Since</span>
              <p className="text-slate-900 font-semibold break-words">{joinDate}</p>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-[22px] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.06)] border border-slate-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] max-md:p-6">
            <h2 className="text-slate-900 text-[1.35rem] tracking-[-0.01em] mb-6">Quick Actions</h2>

            <div className="flex flex-col gap-[0.9rem] mb-8">
              <Link
                href="/bookings"
                className="px-5 py-4 border border-slate-200 rounded-2xl text-slate-900 no-underline font-semibold bg-slate-50 transition-all duration-200 hover:border-[#006ce4] hover:text-[#006ce4] hover:bg-blue-50 hover:translate-x-1"
              >
                View My Bookings
              </Link>

              <Link
                href="/notifications"
                className="px-5 py-4 border border-slate-200 rounded-2xl text-slate-900 no-underline font-semibold bg-slate-50 transition-all duration-200 hover:border-[#006ce4] hover:text-[#006ce4] hover:bg-blue-50 hover:translate-x-1"
              >
                Notifications
              </Link>

              <Link
                href="/search"
                className="px-5 py-4 border border-slate-200 rounded-2xl text-slate-900 no-underline font-semibold bg-slate-50 transition-all duration-200 hover:border-[#006ce4] hover:text-[#006ce4] hover:bg-blue-50 hover:translate-x-1"
              >
                Explore Tours
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl border-none bg-gradient-to-br from-red-500 to-red-600 text-white font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(220,38,38,0.25)]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}