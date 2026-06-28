import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from "../thunks/tourThunk";

const initialState = {
  tours: [] as any[],
  selectedTour: null as any,

  loading: false,
  error: null as string | null,

  actionLoading: false,
  actionError: null as string | null,
  actionSuccess: false,
  actionMessage: null as string | null,

  total: 0,
  page: 1,
  pages: 1,
  count: 0,
};

const tourSlice = createSlice({
  name: "tours",
  initialState,

  reducers: {
    clearSelectedTour: (state) => {
      state.selectedTour = null;
    },

    clearTourError: (state) => {
      state.error = null;
      state.actionError = null;
    },

    resetTourActionState: (state) => {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = false;
      state.actionMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* GET ALL TOURS */
      .addCase(getAllTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTours.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.tours = action.payload.tours || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.count = action.payload.count || 0;
      })
      .addCase(getAllTours.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET TOUR DETAILS */
      .addCase(getTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTourById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.selectedTour = action.payload;
      })
      .addCase(getTourById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE TOUR */
      .addCase(createTour.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
        state.actionMessage = null;
      })
      .addCase(createTour.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.tours.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTour.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      /* UPDATE TOUR */
      .addCase(updateTour.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
        state.actionMessage = null;
      })
      .addCase(updateTour.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.actionMessage = "Tour updated successfully";

        const updatedTour = action.payload;

        state.tours = state.tours.map((tour: any) =>
          tour._id === updatedTour._id ? updatedTour : tour
        );

        if (state.selectedTour?._id === updatedTour._id) {
          state.selectedTour = updatedTour;
        }
      })
      .addCase(updateTour.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      /* DELETE TOUR */
      .addCase(deleteTour.fulfilled, (state, action: PayloadAction<any>) => {
        state.tours = state.tours.filter((tour: any) => tour._id !== action.payload);
        state.total = Math.max(0, state.total - 1);

        if (state.selectedTour?._id === action.payload) {
          state.selectedTour = null;
        }
      });
  },
});

export const { clearSelectedTour, clearTourError, resetTourActionState } = tourSlice.actions;

export default tourSlice.reducer;