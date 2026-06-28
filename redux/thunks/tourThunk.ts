import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* GET ALL TOURS (PAGINATED) */
export const getAllTours = createAsyncThunk(
  "tours/getAllTours",
  async (params: any = {}, thunkAPI) => {
    try {
      const { data } = await api.get("/tours", { params });

      return {
        tours: data.tours || [],
        total: data.pagination?.total || 0,
        page: data.pagination?.page || 1,
        pages: data.pagination?.totalPages || 1,
        count: data.tours?.length || 0,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tours"
      );
    }
  }
);

/* GET SINGLE TOUR */
export const getTourById = createAsyncThunk(
  "tours/getTourById",
  async (id: string, thunkAPI) => {
    try {
      const { data } = await api.get(`/tours/${id}`);
      return data.tour || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tour"
      );
    }
  }
);

/* CREATE TOUR */
export const createTour = createAsyncThunk(
  "tours/createTour",
  async (tourData: Record<string, any>, thunkAPI) => {
    try {
      const { data } = await api.post("/tours", tourData);
      return data.tour || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create tour"
      );
    }
  }
);

/* UPDATE TOUR */
export const updateTour = createAsyncThunk(
  "tours/updateTour",
  async ({ id, tourData }: { id: string; tourData: Record<string, any> }, thunkAPI) => {
    try {
      const { data } = await api.put(`/tours/${id}`, tourData);
      return data.tour || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update tour"
      );
    }
  }
);

/* DELETE TOUR */
export const deleteTour = createAsyncThunk(
  "tours/deleteTour",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/tours/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete tour"
      );
    }
  }
);