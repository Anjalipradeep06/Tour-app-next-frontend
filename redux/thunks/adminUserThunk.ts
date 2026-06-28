import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const getAllUsers = createAsyncThunk(
  "adminUsers/getAllUsers",
  async (params: any = {}, thunkAPI) => {
    try {
      const response = await api.get("/admin/users", { params });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const softDeleteUser = createAsyncThunk(
  "adminUsers/softDeleteUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await api.patch(`/admin/users/${id}/delete`);
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to deactivate user");
    }
  }
);

export const restoreUser = createAsyncThunk(
  "adminUsers/restoreUser",
  async (id: string, thunkAPI) => {
    try {
      const response = await api.patch(`/admin/users/${id}/restore`);
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to restore user");
    }
  }
);