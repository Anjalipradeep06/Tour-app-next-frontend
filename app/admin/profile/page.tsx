"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaUserShield, FaEnvelope, FaCalendarAlt, FaUserCog, FaArrowLeft } from "react-icons/fa";

export default function AdminProfile() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: render a neutral shell until mounted,
  // since `user` comes from a localStorage-seeded Redux slice.
  if (!mounted) {
    return <div className="max-w-[1200px] mx-auto min-h-[400px]" />;
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <button
          onClick={() => router.push("/admin")}
          className="relative top-[7px] inline-flex items-center gap-2.5 border-none cursor-pointer bg-gray-900 text-white px-[18px] py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-[#c9a669] hover:text-gray-900 hover:-translate-y-0.5"
        >
          <FaArrowLeft />
          Dashboard
        </button>
      </div>

      <div className="flex items-center gap-6 bg-white p-8 rounded-[20px] mb-6 shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-[900px]:flex-col max-[900px]:text-center">
        <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center text-[38px] bg-gradient-to-br from-[#c9a669] to-[#b78e4f] text-gray-900 flex-shrink-0">
          <FaUserShield />
        </div>

        <div>
          <h1 className="text-2xl mb-1.5 text-gray-900">{user?.name}</h1>
          <p className="text-gray-500">Administrator Account</p>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6 max-[900px]:grid-cols-1">
        {/* ACCOUNT INFO */}
        <div className="bg-white rounded-[20px] p-7 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <h2 className="mb-6 text-gray-900 text-[1.2rem]">Account Information</h2>

          <div className="flex gap-4 items-center py-4 border-b border-slate-100">
            <FaUserShield className="text-lg text-[#c9a669] flex-shrink-0" />
            <div>
              <span className="block text-gray-500 text-[0.85rem] mb-1">Name</span>
              <strong className="text-gray-900">{user?.name}</strong>
            </div>
          </div>

          <div className="flex gap-4 items-center py-4 border-b border-slate-100">
            <FaEnvelope className="text-lg text-[#c9a669] flex-shrink-0" />
            <div>
              <span className="block text-gray-500 text-[0.85rem] mb-1">Email</span>
              <strong className="text-gray-900">{user?.email}</strong>
            </div>
          </div>

          <div className="flex gap-4 items-center py-4 border-b border-slate-100">
            <FaUserCog className="text-lg text-[#c9a669] flex-shrink-0" />
            <div>
              <span className="block text-gray-500 text-[0.85rem] mb-1">Role</span>
              <strong className="text-gray-900">{user?.role?.toUpperCase()}</strong>
            </div>
          </div>

          <div className="flex gap-4 items-center py-4">
            <FaCalendarAlt className="text-lg text-[#c9a669] flex-shrink-0" />
            <div>
              <span className="block text-gray-500 text-[0.85rem] mb-1">Account Status</span>
              <strong className="text-gray-900">Active</strong>
            </div>
          </div>
        </div>

        {/* ACCOUNT SUMMARY */}
        <div className="bg-white rounded-[20px] p-7 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
          <h2 className="mb-6 text-gray-900 text-[1.2rem]">Account Summary</h2>

          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-gray-500 text-[0.9rem]">Role</span>
            <strong className="text-gray-900">Administrator</strong>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-gray-500 text-[0.9rem]">Permissions</span>
            <strong className="text-gray-900">Full Access</strong>
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="text-gray-500 text-[0.9rem]">Status</span>
            <strong className="text-green-600">Active</strong>
          </div>
        </div>
      </div>
    </div>
  );
}