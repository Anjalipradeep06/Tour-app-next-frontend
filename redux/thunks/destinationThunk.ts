import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const getAllDestinations = createAsyncThunk(
  "destinations/getAllDestinations",
  async (params: any = {}, thunkAPI) => {
    try {
      const response = await api.get("/destinations/all", { params });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch destinations"
      );
    }
  }
);

export const getFeaturedDestinations = createAsyncThunk(
  "destinations/getFeaturedDestinations",
  async (_: void, thunkAPI) => {
    try {
      const response = await api.get("/destinations/featured");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch destinations"
      );
    }
  }
);

export const getDestinationsByContinent = createAsyncThunk(
  "destinations/getDestinationsByContinent",
  async (continent: string, thunkAPI) => {
    try {
      const response = await api.get(`/destinations/${continent}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch destinations"
      );
    }
  }
);

export const getPopularDestinations = createAsyncThunk(
  "destinations/getPopularDestinations",
  async (continent: string, thunkAPI) => {
    try {
      const response = await api.get(`/destinations/${continent}/popular`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch popular destinations"
      );
    }
  }
);

export const getDestinationById = createAsyncThunk(
  "destinations/getDestinationById",
  async (id: string, thunkAPI) => {
    try {
      const response = await api.get(`/destinations/details/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch destination"
      );
    }
  }
);

export const createDestination = createAsyncThunk(
  "destinations/createDestination",
  async (destinationData: Record<string, any>, thunkAPI) => {
    try {
      const formData = new FormData();

      Object.entries(destinationData).forEach(([key, value]) => {
        if (key === "bannerImage" && value instanceof File) {
          formData.append("bannerImage", value);
        } else if (key === "galleryImages" && Array.isArray(value)) {
          value.forEach((file) => formData.append("galleryImages", file));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await api.post("/destinations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create destination"
      );
    }
  }
);

export const updateDestination = createAsyncThunk(
  "destinations/updateDestination",
  async (
    { id, destinationData }: { id: string; destinationData: Record<string, any> },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();

      Object.entries(destinationData).forEach(([key, value]) => {
        if (key === "bannerImage" && value instanceof File) {
          formData.append("bannerImage", value);
        } else if (key === "galleryImages" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("galleryImages", file);
            }
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await api.put(`/destinations/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update destination"
      );
    }
  }
);