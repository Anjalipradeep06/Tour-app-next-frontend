"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { updateProfile } from "@/redux/thunks/authThunk";

type EditProfileModalProps = {
  user: { name?: string } | null;
  onClose: () => void;
};

export default function EditProfileModal({ user, onClose }: EditProfileModalProps) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state: any) => state.auth);

  const [name, setName] = useState(user?.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(updateProfile({ name }) as any);

    if (updateProfile.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(15,23,42,0.65)] flex items-center justify-center z-[9999] p-4">
      <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 text-2xl font-bold">Edit Profile</h2>

          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent text-xl cursor-pointer text-gray-700 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Full Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="px-4 py-[0.95rem] border border-gray-300 rounded-xl text-base outline-none transition-colors duration-200 focus:border-[#006ce4]"
            />
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 bg-white px-[1.4rem] py-[0.9rem] rounded-xl cursor-pointer text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="border-none bg-[#006ce4] text-white px-[1.4rem] py-[0.9rem] rounded-xl font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#0057b8] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}