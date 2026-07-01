"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { registerUser } from "@/redux/thunks/authThunk";
import { clearError, clearMessage } from "@/redux/slices/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, success, message } = useSelector((state: any) => state.auth);

  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");

      toast.error("Passwords do not match.", {
        toastId: "password-mismatch",
      });

      return;
    }

    setPasswordError("");

    dispatch(
      registerUser({
        name,
        email,
        password,
        role: "user",
      }) as any
    );
  };

  // Success/Error Toasts
  useEffect(() => {
    if (success && message) {
      toast.success(message, {
        toastId: "register-success",
      });
    }

    if (error) {
      toast.error(error, {
        toastId: "register-error",
      });

      dispatch(clearError());
    }
  }, [success, message, error, dispatch]);

  // Redirect to login after successful registration.
  // Registration does not log the user in automatically, so we watch
  // `success` (not `user`, which registerUser never sets) and send them
  // to /login rather than the homepage.
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
        router.push("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, router, dispatch]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 pt-[120px] pb-16 bg-cover bg-center bg-no-repeat max-sm:px-4 max-sm:pt-[100px] max-sm:pb-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(15,23,42,0.75)] to-[rgba(15,23,42,0.55)]" />

      <div className="relative z-[1] w-full max-w-[520px] p-12 bg-white/96 border border-white/40 rounded-[28px] backdrop-blur-[18px] shadow-[0_30px_80px_rgba(15,23,42,0.25)] max-sm:p-8 max-sm:rounded-3xl">
        <div className="mb-8">
          <span className="inline-block mb-4 px-[0.9rem] py-2.5 bg-blue-50 text-[#006ce4] rounded-full text-[0.75rem] font-bold tracking-[0.12em]">
            START YOUR JOURNEY
          </span>

          <h1 className="mb-3 text-gray-900 text-[2.25rem] leading-[1.2] max-sm:text-[1.9rem]">
            Create your account
          </h1>

          <p className="text-gray-500 leading-[1.7]">
            Discover curated experiences, unforgettable destinations, and
            seamless bookings worldwide.
          </p>
        </div>

        {passwordError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[0.95rem]">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-gray-700 text-[0.95rem] font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-[1.1rem] py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 text-[0.95rem] font-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-[1.1rem] py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 text-[0.95rem] font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full px-[1.1rem] py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 text-[0.95rem] font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full px-[1.1rem] py-4 border border-gray-300 rounded-2xl bg-white text-gray-900 text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-[#006ce4] focus:shadow-[0_0_0_4px_rgba(0,108,228,0.12)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-4 border-none rounded-2xl bg-[#006ce4] text-white text-base font-bold cursor-pointer transition-all duration-200 hover:not-disabled:bg-[#0057b8] hover:not-disabled:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500">
          Already have an account?
          <Link href="/login" className="ml-1.5 text-[#006ce4] no-underline font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}