import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: Record<string, any>, thunkAPI) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: Record<string, any>, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: Record<string, any>, thunkAPI) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);