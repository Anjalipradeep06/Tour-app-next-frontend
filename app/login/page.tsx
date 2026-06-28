"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { loginUser } from "@/redux/thunks/authThunk";
import { clearError, clearMessage } from "@/redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, loading, error, success, message } = useSelector((state: any) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }) as any);
  };

  useEffect(() => {
    if (success && message) {
      toast.success(message, {
        toastId: "login-success",
      });

      dispatch(clearMessage());
    }
  }, [success, message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        toastId: "login-error",
      });

      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen grid grid-cols-[1.1fr_0.9fr] bg-[#f5f7fa] max-lg:grid-cols-1">
      {/* LEFT IMAGE PANEL */}
      <div
        className="hidden lg:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')",
        }}
      />

      {/* LOGIN CARD */}
      <div className="bg-white flex flex-col justify-center p-16 max-w-[520px] w-full mx-auto my-auto max-lg:max-w-full max-lg:min-h-screen max-lg:p-8 max-[576px]:p-6">
        <p className="text-[#006ce4] text-[0.75rem] font-bold tracking-[0.16em] uppercase mb-4">
          EST. ITINERARY 001
        </p>

        <h1 className="text-gray-900 text-[2.5rem] font-extrabold mb-3 max-[576px]:text-3xl">
          Welcome Back
        </h1>

        <p className="text-gray-500 leading-[1.6] mb-8">
          Continue your journey with Meridian.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 text-[0.95rem] font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
              autoComplete="email"
              required
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 text-[0.95rem] font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 border-none rounded-xl bg-[#006ce4] text-white text-base font-bold cursor-pointer transition-all duration-200 hover:not-disabled:bg-[#0057b8] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex justify-center gap-2 text-gray-500 max-[576px]:flex-col max-[576px]:text-center">
          <span>Don&apos;t have an account?</span>
          <Link href="/register" className="text-[#006ce4] no-underline font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}