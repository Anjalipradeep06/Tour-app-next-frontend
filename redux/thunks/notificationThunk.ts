import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

const getAuthConfig = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getNotifications = createAsyncThunk(
  "notification/getAll",
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/notifications?page=${page}&limit=${limit}`,
        getAuthConfig()
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "notification/getUnreadCount",
  async (_: void, thunkAPI) => {
    try {
      const { data } = await api.get("/notifications/unread-count", getAuthConfig());
      return data.unreadCount;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`, {}, getAuthConfig());
      return data.notification;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_: void, thunkAPI) => {
    try {
      const { data } = await api.patch("/notifications/read-all", {}, getAuthConfig());
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);