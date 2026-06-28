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

/* GET REVIEWS FOR A TOUR (public) */
export const getTourReviews = createAsyncThunk(
  "review/getByTour",
  async (tourId: string, thunkAPI) => {
    try {
      const { data } = await api.get(`/reviews/${tourId}`);
      return data.reviews;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

/* ADD REVIEW */
export const addReview = createAsyncThunk(
  "review/add",
  async (
    { tour, rating, comment }: { tour: string; rating: number; comment: string },
    thunkAPI
  ) => {
    try {
      const { data } = await api.post("/reviews", { tour, rating, comment }, getAuthConfig());
      return data.review;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

/* DELETE REVIEW */
export const deleteReview = createAsyncThunk(
  "review/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/reviews/${id}`, getAuthConfig());
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);