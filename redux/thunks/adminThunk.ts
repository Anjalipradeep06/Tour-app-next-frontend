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

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_: void, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/dashboard", getAuthConfig());
      return data.stats;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const getAllBookings = createAsyncThunk(
  "admin/getAllBookings",
  async ({ page = 1, limit = 8 }: { page?: number; limit?: number } = {}, thunkAPI) => {
    try {
      const { data } = await api.get(`/admin/bookings?page=${page}&limit=${limit}`, getAuthConfig());
      return {
        bookings: data.bookings || [],
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || 1,
        totalBookings: data.pagination?.totalItems || 0,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

export const getPendingBookings = createAsyncThunk(
  "admin/getPendingBookings",
  async (_: void, thunkAPI) => {
    try {
      const { data } = await api.get("/admin/bookings/pending", getAuthConfig());
      return data.bookings || [];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending bookings"
      );
    }
  }
);

export const approveBooking = createAsyncThunk(
  "admin/approveBooking",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.patch(`/admin/bookings/${id}/approve`, {}, getAuthConfig());
      return data.booking;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to approve booking");
    }
  }
);

export const rejectBooking = createAsyncThunk(
  "admin/rejectBooking",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.patch(`/admin/bookings/${id}/reject`, {}, getAuthConfig());
      return data.booking;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to reject booking");
    }
  }
);

export const completeBooking = createAsyncThunk(
  "admin/completeBooking",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.patch(`/bookings/${id}/complete`, {}, getAuthConfig());
      return data.booking;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to complete booking");
    }
  }
);