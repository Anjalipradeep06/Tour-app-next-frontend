"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/redux/thunks/notificationThunk";

const POLL_INTERVAL_MS = 30000;
const DROPDOWN_PREVIEW_LIMIT = 5;

const timeAgo = (dateString: string) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export default function NotificationBell() {
  const dispatch = useDispatch();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const { notifications, unreadCount, loading } = useSelector((state: any) => state.notification);

  useEffect(() => {
    dispatch(getUnreadCount() as any);

    const interval = setInterval(() => {
      dispatch(getUnreadCount() as any);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      dispatch(getNotifications({ page: 1, limit: DROPDOWN_PREVIEW_LIMIT }) as any);
    }
  }, [open, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleBellClick = () => {
    setOpen((prev) => !prev);
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id) as any);
    }
    setOpen(false);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAllAsRead() as any);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push("/notifications");
  };

  const previewList = notifications.slice(0, DROPDOWN_PREVIEW_LIMIT);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        className="relative w-11 h-11 flex items-center justify-center rounded-full border border-transparent bg-transparent text-gray-800 transition-all duration-200 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#006ce4] focus-visible:outline-offset-2"
        onClick={handleBellClick}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full border-2 border-white bg-[#d4111e] text-white text-[0.72rem] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+12px)] right-0 w-[380px] max-h-[520px] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-[0_20px_48px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.08)] overflow-hidden z-[1001] max-md:fixed max-md:top-[72px] max-md:right-3 max-md:left-3 max-md:w-auto max-md:max-h-[calc(100vh-100px)]"
        >
          <div className="flex items-center justify-between px-5 py-[18px] border-b border-gray-200">
            <span className="text-base font-bold text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <button
                className="border-none bg-transparent text-[#006ce4] text-sm font-semibold cursor-pointer hover:text-[#003b95] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleMarkAllAsRead}
                disabled={loading.action}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[360px]">
            {loading.list && previewList.length === 0 ? (
              <div className="px-5 py-12 text-center text-slate-500 text-[0.95rem]">Loading…</div>
            ) : previewList.length === 0 ? (
              <div className="px-5 py-12 text-center text-slate-500 text-[0.95rem]">You're all caught up.</div>
            ) : (
              previewList.map((n: any) => (
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full flex items-start gap-3 px-5 py-4 border-none text-left cursor-pointer transition-colors duration-200 border-t border-t-slate-100 first:border-t-0 ${
                    n.isRead ? "bg-white hover:bg-slate-50" : "bg-[#f0f7ff] hover:bg-[#e8f2ff]"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-[7px] flex-shrink-0 ${
                      n.isRead ? "bg-transparent" : "bg-[#006ce4]"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-gray-900 text-[0.95rem] font-bold">{n.title}</span>
                    <span className="text-slate-500 text-sm leading-[1.5] line-clamp-2">{n.message}</span>
                    <span className="text-slate-400 text-xs">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              ))
            )}
          </div>

          <button
            onClick={handleViewAll}
            className="h-14 border-none border-t border-gray-200 bg-white text-[#003b95] font-bold text-[0.95rem] cursor-pointer hover:bg-slate-50 transition-colors duration-200"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}