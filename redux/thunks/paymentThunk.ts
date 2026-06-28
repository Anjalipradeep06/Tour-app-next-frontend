import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/lib/api";

const getAuthConfig = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const startPayment = createAsyncThunk(
  "payment/startPayment",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const { data } = await API.post(
        `/payments/create-session/${bookingId}`,
        {},
        getAuthConfig()
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to start payment");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/payments/verify/${bookingId}`, {}, getAuthConfig());
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to verify payment");
    }
  }
);