import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTourReviews, addReview, deleteReview } from "../thunks/reviewThunk";

const initialState = {
  reviews: [] as any[],

  loading: {
    list: false,
    action: false,
  },

  error: null as string | null,
  success: false,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,

  reducers: {
    resetReviewState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = {
        list: false,
        action: false,
      };
    },
    clearReviews: (state) => {
      state.reviews = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /* GET BY TOUR */
      .addCase(getTourReviews.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(getTourReviews.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.list = false;
        state.reviews = action.payload;
      })
      .addCase(getTourReviews.rejected, (state, action: PayloadAction<any>) => {
        state.loading.list = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addReview.pending, (state) => {
        state.loading.action = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.success = true;
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(addReview.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteReview.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.reviews = state.reviews.filter((r: any) => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;