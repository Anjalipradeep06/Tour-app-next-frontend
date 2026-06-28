"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout } from "@/redux/slices/authSlice";
import NotificationBell from "@/app/components/NotificationBell/NotificationBell";

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const BookingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </svg>
);

const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useSelector((state: any) => state.auth);

  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const showSolid = scrolled || isAdminRoute;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout() as any);
    toast.success("Logged out successfully", { toastId: "logout-success" });
    setDropdownOpen(false);
    closeMenu();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const linkClass = (href: string) => {
    const active = isActive(href);
    const base =
      "relative text-[0.95rem] font-semibold transition-colors duration-200 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:transition-[width] after:duration-300";
    if (showSolid) {
      return `${base} ${
        active
          ? "text-[#003b95] after:w-full after:bg-[#003b95]"
          : "text-gray-800 hover:text-[#003b95] after:w-0 hover:after:w-full after:bg-[#003b95]"
      }`;
    }
    return `${base} ${
      active
        ? "text-[#febb02] after:w-full after:bg-[#febb02]"
        : "text-white hover:text-[#febb02] after:w-0 hover:after:w-full after:bg-[#febb02]"
    }`;
  };

  // Treat "logged in" as only true once mounted AND a user actually exists.
  // This guarantees server render + first client render both show "logged out",
  // avoiding the hydration mismatch.
  const isLoggedIn = mounted && !!user;
  const isAdmin = mounted && user?.role === "admin";

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[76px] z-[1000] flex items-center transition-all duration-300 ${
        showSolid
          ? "bg-white/96 backdrop-blur-md shadow-[0_4px_20px_rgba(15,23,42,0.08)] border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div
        className={
          isAdminRoute
            ? "w-full px-6 flex items-center justify-between"
            : "w-[92%] max-w-[1320px] mx-auto px-0 flex items-center justify-between"
        }
      >
        <Link
          href="/"
          onClick={closeMenu}
          className={`font-extrabold text-[1.7rem] tracking-[-0.5px] transition-colors duration-200 ${
            showSolid ? "text-[#003b95] hover:text-[#0057b8]" : "text-white hover:text-[#e5edff]"
          }`}
        >
          MERIDIAN
        </Link>

        <button
          className={`hidden max-[900px]:block bg-transparent border-none text-[1.9rem] cursor-pointer ${
            showSolid ? "text-gray-800" : "text-white"
          }`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`flex items-center gap-7 max-[900px]:fixed max-[900px]:top-[78px] max-[900px]:left-0 max-[900px]:w-full max-[900px]:bg-white max-[900px]:border-t max-[900px]:border-gray-200 max-[900px]:shadow-[0_12px_24px_rgba(15,23,42,0.08)] max-[900px]:flex-col max-[900px]:items-start max-[900px]:p-6 max-[900px]:gap-[22px] ${
            menuOpen ? "max-[900px]:flex" : "max-[900px]:hidden"
          }`}
        >
          <Link href="/" onClick={closeMenu} className={linkClass("/")}>
            Home
          </Link>
          <Link href="/search" onClick={closeMenu} className={linkClass("/search")}>
            Tours
          </Link>

          {isLoggedIn && (
            <Link href="/bookings" onClick={closeMenu} className={linkClass("/bookings")}>
              Bookings
            </Link>
          )}

          {isAdmin && (
            <Link href="/admin" onClick={closeMenu} className={linkClass("/admin")}>
              Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link href="/login" onClick={closeMenu} className={linkClass("/login")}>
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className={`px-[22px] py-3 rounded-xl font-semibold transition-all duration-300 no-underline max-[900px]:w-full max-[900px]:text-center ${
                  showSolid
                    ? "bg-[#003b95] text-white hover:bg-[#0057b8] hover:-translate-y-px"
                    : "bg-[#febb02] text-gray-900 hover:bg-[#ffd454]"
                }`}
              >
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <NotificationBell />

              <div className="relative" ref={dropdownRef}>
                <button
                  className={`flex items-center gap-1 rounded-full pl-[0.4rem] pr-[0.6rem] py-[0.3rem] cursor-pointer transition-colors duration-200 text-gray-900 ${
                    showSolid
                      ? "border border-white/30 bg-transparent hover:bg-white/10"
                      : "border border-gray-900/15 bg-white/90 hover:bg-white"
                  }`}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-900">
                    <UserIcon />
                  </div>
                  <span className="text-[0.6rem] opacity-70">{dropdownOpen ? "▲" : "▼"}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[calc(100%+10px)] right-0 min-w-[210px] bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[1000] overflow-hidden">
                    <div className="px-4 pt-3.5 pb-3">
                      <p className="font-semibold text-sm text-gray-900 mb-0.5">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <div className="h-px bg-gray-100" />

                    <Link
                      href="/profile"
                      onClick={() => {
                        setDropdownOpen(false);
                        closeMenu();
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                        <UserIcon />
                      </span>
                      Profile
                    </Link>

                    <Link
                      href="/bookings"
                      onClick={() => {
                        setDropdownOpen(false);
                        closeMenu();
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                        <BookingsIcon />
                      </span>
                      My Bookings
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => {
                          setDropdownOpen(false);
                          closeMenu();
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                      >
                        <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                          <AdminIcon />
                        </span>
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="h-px bg-gray-100" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 text-left"
                    >
                      <span className="inline-flex items-center justify-center w-[18px] h-[18px] flex-shrink-0">
                        <LogoutIcon />
                      </span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}