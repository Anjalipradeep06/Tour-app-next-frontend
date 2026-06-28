"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllUsers, softDeleteUser, restoreUser } from "@/redux/thunks/adminUserThunk";
import { resetAdminUserError } from "@/redux/slices/adminUserSlice";

const PAGE_SIZE = 8;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ManageUsers() {
  const dispatch = useDispatch();

  const { users = [], loading, actionLoading, actionTargetId, error, count } = useSelector(
    (state: any) => state.adminUsers
  );
  const { user: currentUser } = useSelector((state: any) => state.auth);

  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllUsers({ includeDeleted: includeDeleted || undefined }) as any);
  }, [dispatch, includeDeleted]);

  const filteredUsers = useMemo(() =>
    users
      .filter((u: any) => u.role !== "admin")
      .filter((u: any) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  useEffect(() => { setCurrentPage(1); }, [search, includeDeleted]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const activeUsers = users.filter((u: any) => !u.isDeleted).length;
  const inactiveUsers = users.filter((u: any) => u.isDeleted).length;
  const admins = users.filter((u: any) => u.role === "admin").length;

  const statCards = [
    { label: "Total Users", value: count },
    { label: "Active", value: activeUsers },
    { label: "Deactivated", value: inactiveUsers },
    { label: "Admins", value: admins },
  ];

  const deactivate = () => {
    dispatch(softDeleteUser(confirmTarget as string) as any);
    setConfirmTarget(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto font-[Inter,sans-serif] text-[#1C1F23]">

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 mb-6 max-[560px]:flex-col">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[#C9A669] mb-1">Meridian Admin</p>
          <h1 className="font-['Fraunces',serif] font-medium text-[clamp(26px,3.6vw,32px)] text-[#1C1F23] my-1 mb-1.5">
            User Management
          </h1>
          <span className="text-[13.5px] text-[#6B6F76]">Manage platform members & administrators.</span>
        </div>

        <label className="flex items-center gap-2 text-[13px] font-semibold text-[#1C1F23] bg-white border border-[#E6E4DD] rounded-[10px] px-3.5 py-2.5 cursor-pointer whitespace-nowrap mt-1">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
            className="w-[15px] h-[15px] cursor-pointer accent-[#C9A669]"
          />
          Show Deactivated
        </label>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between gap-3 bg-[#FBE6E3] text-[#C03B2B] text-sm px-4 py-3 rounded-[10px] mb-5">
          <span>{error}</span>
          <button onClick={() => dispatch(resetAdminUserError())} className="bg-transparent border-none text-[#C03B2B] cursor-pointer text-base">✕</button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-3.5 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-[#E6E4DD] border-t-[3px] border-t-[#C9A669] rounded-xl px-[18px] py-4">
            <h2 className="font-['Fraunces',serif] font-medium text-[26px] text-[#1C1F23] m-0 mb-1">{card.value}</h2>
            <p className="text-[11.5px] font-semibold tracking-[0.04em] uppercase text-[#6B6F76] m-0">{card.label}</p>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[380px] bg-white border border-[#E6E4DD] rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-[#1C1F23] outline-none transition-colors focus:border-[#C9A669] placeholder:text-[#6B6F76]"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#E6E4DD] rounded-[14px] overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-[#6B6F76] text-sm">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-[#6B6F76] text-sm">No users found.</div>
        ) : (
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {["User", "Role", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="text-left text-[11.5px] font-semibold tracking-[0.04em] uppercase text-[#6B6F76] px-4 py-3 border-b border-[#E6E4DD] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u: any) => {
                const busy = actionLoading && actionTargetId === u._id;
                return (
                  <tr key={u._id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[34px] h-[34px] rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm bg-gradient-to-br from-[#C9A669] to-[#B78E4F] text-[#1C1F23]">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <strong className="text-[13.5px] text-[#1C1F23] font-semibold">
                            {u.name}{u._id === currentUser?._id && " (You)"}
                          </strong>
                          <span className="text-xs text-[#6B6F76] mt-px">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        u.role === "admin"
                          ? "bg-[#FBF1E0] text-[#B8770A]"
                          : "bg-[#ECEDEF] text-[#5F636A]"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap text-[#6B6F76]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.isDeleted ? "bg-[#FBE6E3] text-[#C03B2B]" : "bg-[#E4F3EA] text-[#1B7A4D]"
                      }`}>
                        {u.isDeleted ? "Deactivated" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-[#E6E4DD] align-middle whitespace-nowrap">
                      {u._id !== currentUser?._id && (
                        u.isDeleted ? (
                          <button
                            disabled={busy}
                            onClick={() => dispatch(restoreUser(u._id) as any)}
                            className="text-[12.5px] font-semibold px-3 py-1.5 rounded-[7px] border-none bg-[#C9A669] text-[#1C1F23] cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            disabled={busy}
                            onClick={() => setConfirmTarget(u._id)}
                            className="text-[12.5px] font-semibold px-3 py-1.5 rounded-[7px] border-none bg-[#FBE6E3] text-[#C03B2B] cursor-pointer hover:bg-[#F6D9D4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          >
                            Deactivate
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-4 py-[18px] border-t border-[#E6E4DD]">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="bg-transparent border border-[#E6E4DD] text-[#1C1F23] text-[13px] font-semibold px-4 py-[7px] rounded-full cursor-pointer hover:border-[#C9A669] hover:bg-[#FBF1E0] disabled:opacity-45 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <span className="text-[13.5px] font-semibold text-[#1C1F23]">
              Page {currentPage} of {totalPages}{" "}
              <span className="font-normal text-[#6B6F76]">({filteredUsers.length} total)</span>
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="bg-transparent border border-[#E6E4DD] text-[#1C1F23] text-[13px] font-semibold px-4 py-[7px] rounded-full cursor-pointer hover:border-[#C9A669] hover:bg-[#FBF1E0] disabled:opacity-45 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-[rgba(11,14,17,0.55)] flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[14px] px-[26px] py-7 max-w-[380px] w-full text-center">
            <h2 className="font-['Fraunces',serif] font-medium text-[21px] text-[#1C1F23] m-0 mb-2.5">Deactivate User?</h2>
            <p className="text-[13.5px] text-[#6B6F76] m-0 mb-[22px] leading-relaxed">
              This user won't be able to log in until restored.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 py-2.5 rounded-[9px] border border-[#E6E4DD] bg-[#F7F8FA] text-[#1C1F23] font-semibold text-[13.5px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deactivate}
                className="flex-1 py-2.5 rounded-[9px] border border-[#C03B2B] bg-[#C03B2B] text-white font-semibold text-[13.5px] cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}