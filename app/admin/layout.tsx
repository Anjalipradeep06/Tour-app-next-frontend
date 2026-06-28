"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  FaChartPie,
  FaSuitcase,
  FaGlobeAsia,
  FaUsers,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

import { logout } from "@/redux/slices/authSlice";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <FaChartPie />, exact: true },
  { href: "/admin/bookings", label: "Manage Bookings", icon: <FaSuitcase /> },
  { href: "/admin/tours", label: "Tours", icon: <FaGlobeAsia /> },
  { href: "/admin/destinations", label: "Destinations", icon: <FaGlobeAsia /> },
  { href: "/admin/users", label: "Users", icon: <FaUsers /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const accountRef = useRef<HTMLDivElement>(null);

  const { user } = useSelector((state: any) => state.auth);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAccountOpen(false);
    dispatch(logout() as any);
    router.push("/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="flex min-h-screen bg-[#0B0E11] font-[Inter,sans-serif] pt-[76px]">

      {/* TOPBAR */}
      <header className="fixed top-0 left-0 right-0 h-[76px] z-50 flex items-center justify-between gap-4 px-7 bg-gradient-to-b from-[#101317] to-[#171C21] border-b border-[#252B33]">
        <span className="font-extrabold text-[1.1rem] tracking-widest text-[#C9A669] uppercase">
          MERIDIAN ADMIN
        </span>

        <div className="flex items-center gap-2.5 flex-shrink-0" ref={accountRef}>
          <div className="relative">
            <button
              onClick={() => setAccountOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[#15191E] border border-[#252B33] rounded-[10px] px-3 py-[6px] cursor-pointer text-[13.5px] font-semibold text-[#F4F1EA] hover:bg-[#1B2027] transition-colors"
            >
              <FaUserCircle className="text-[22px] text-[#C9A669]" />
              <span>{user?.name || "Admin"}</span>
              <FaChevronDown className="text-[10px] text-[#8E959B]" />
            </button>

            {accountOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[160px] bg-[#15191E] border border-[#252B33] rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.35)] overflow-hidden z-[60]">
                <button
                  onClick={() => { setAccountOpen(false); router.push("/admin/profile"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 bg-transparent border-none text-[#F4F1EA] text-[13.5px] font-medium text-left cursor-pointer hover:bg-[#C9A669] hover:text-[#111] transition-colors"
                >
                  <FaUserCircle /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 bg-transparent border-none text-[#F4F1EA] text-[13.5px] font-medium text-left cursor-pointer hover:bg-[#C9A669] hover:text-[#111] transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="w-[270px] max-[900px]:w-20 bg-gradient-to-b from-[#101317] to-[#171C21] border-r border-[#252B33] flex flex-col px-[22px] py-[30px] max-[900px]:px-3 fixed top-[76px] left-0 h-[calc(100vh-76px)] overflow-y-auto z-40">
        <div className="mb-[45px] max-[900px]:hidden">
          <p className="text-[#C9A669] text-xs tracking-[4px] uppercase mb-1.5">MERIDIAN</p>
          <h2 className="font-['Fraunces',serif] text-[34px] text-white">Travel Admin</h2>
        </div>

        <nav className="flex flex-col gap-2.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-[15px] px-[18px] py-[15px] rounded-[14px] no-underline text-[15px] font-semibold transition-all duration-200 max-[900px]:justify-center max-[900px]:px-3 ${
                isActive(item.href, item.exact)
                  ? "bg-gradient-to-r from-[#C9A669] to-[#B78E4F] text-[#111] font-bold shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
                  : "text-[#8E959B] hover:bg-[#1F252C] hover:text-white hover:translate-x-1"
              }`}
            >
              <span className="text-[18px] w-[22px] flex justify-center flex-shrink-0">{item.icon}</span>
              <span className="max-[900px]:hidden">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-3 px-[18px] py-[14px] bg-[#1A1F25] border border-[#252B33] text-[#ddd] rounded-xl cursor-pointer text-sm transition-all hover:bg-[#C9A669] hover:text-[#111] max-[900px]:justify-center max-[900px]:text-[0px]"
          >
            <FaUserCircle className="text-[18px]" />
            <span className="max-[900px]:hidden">Profile</span>
          </button>
          <button
            className="flex items-center gap-3 px-[18px] py-[14px] bg-[#1A1F25] border border-[#252B33] text-[#ddd] rounded-xl cursor-pointer text-sm transition-all hover:bg-[#C9A669] hover:text-[#111] max-[900px]:justify-center max-[900px]:text-[0px]"
          >
            <FaCog className="text-[18px]" />
            <span className="max-[900px]:hidden">Settings</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[270px] max-[900px]:ml-20 p-[35px] max-[900px]:p-5 bg-[#F7F8FA] min-h-[calc(100vh-76px)] overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}