"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getNotifications, markAsRead, markAllAsRead } from "@/redux/thunks/notificationThunk";
import { resetNotificationState } from "@/redux/slices/notificationSlice";

const PAGE_LIMIT = 20;

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
    year: "numeric",
  });
};

export default function Notifications() {
  const dispatch = useDispatch();

  const { notifications, unreadCount, page, hasMore, loading, error } = useSelector(
    (state: any) => state.notification
  );

  useEffect(() => {
    dispatch(getNotifications({ page: 1, limit: PAGE_LIMIT }) as any);

    return () => {
      dispatch(resetNotificationState());
    };
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(getNotifications({ page: page + 1, limit: PAGE_LIMIT }) as any);
  };

  const handleItemClick = (notification: any) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id) as any);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead() as any);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 pt-10 pb-20 max-md:px-4 max-md:pt-6 max-md:pb-[60px]">
      <div className="max-w-[900px] mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-start gap-4 mb-8 max-md:flex-col max-md:items-stretch">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 max-md:text-[1.75rem]">
              Notifications
            </h1>
            <p className="text-gray-500 text-[0.95rem]">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                : "You're all caught up"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading.action}
              className="relative top-10 border-none bg-[#006ce4] text-white px-5 py-[0.9rem] rounded-xl text-[0.9rem] font-semibold cursor-pointer whitespace-nowrap transition-all duration-200 hover:not-disabled:bg-[#0057b8] disabled:opacity-70 disabled:cursor-not-allowed max-md:w-full max-md:top-0"
            >
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <p className="mb-6 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-[0.95rem]">
            {error}
          </p>
        )}

        {loading.list && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] bg-white border border-gray-200 rounded-3xl text-center p-8">
            <div className="w-12 h-12 mb-6 border-4 border-gray-200 border-t-[#006ce4] rounded-full animate-spin" />
            <p className="text-gray-900 text-[1.1rem] font-semibold mb-2">
              Loading notifications…
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] bg-white border border-gray-200 rounded-3xl text-center p-8">
            <p className="text-gray-900 text-[1.1rem] font-semibold mb-2">No notifications yet.</p>
            <span className="text-gray-500 max-w-[320px] leading-[1.6]">
              We&apos;ll let you know when something needs your attention.
            </span>
          </div>
        ) : (
          <>
            <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
              {notifications.map((n: any) => (
                <li
                  key={n._id}
                  onClick={() => handleItemClick(n)}
                  className={`flex items-start gap-4 px-6 py-5 bg-white border rounded-[18px] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] max-md:p-4 max-md:gap-3 max-md:flex-wrap ${
                    n.isRead
                      ? "border-gray-200"
                      : "border-gray-200 border-l-4 border-l-[#006ce4] bg-[#f8fbff]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-2.5 h-2.5 mt-2 rounded-full flex-shrink-0 ${
                      n.isRead ? "bg-transparent" : "bg-[#006ce4]"
                    }`}
                  />

                  <div className="flex-1 flex flex-col gap-1.5">
                    <span className="text-gray-900 font-bold text-base">{n.title}</span>
                    <span className="text-gray-500 leading-[1.6] text-[0.95rem]">{n.message}</span>
                  </div>

                  <span className="text-gray-400 text-[0.85rem] whitespace-nowrap ml-auto max-md:w-full max-md:ml-6 max-md:mt-1">
                    {timeAgo(n.createdAt)}
                  </span>
                </li>
              ))}
            </ul>

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading.list}
                className="block w-full max-w-[220px] mx-auto mt-8 px-6 py-[0.95rem] border border-gray-300 rounded-2xl bg-white text-gray-900 font-semibold cursor-pointer transition-all duration-200 hover:not-disabled:border-[#006ce4] hover:not-disabled:text-[#006ce4] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading.list ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}