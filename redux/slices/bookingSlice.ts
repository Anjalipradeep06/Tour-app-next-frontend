import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  checkAvailability,
} from "../thunks/bookingThunk";

const initialState = {
  bookings: [] as any[],
  selectedBooking: null as any,

  availability: null as any,

  currentPage: 1,
  totalPages: 1,
  totalBookings: 0,

  loading: {
    list: false,
    detail: false,
    action: false,
  },

  error: null as string | null,
  success: false,
  message: null as string | null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    resetBookingState: (state) => {
      state.selectedBooking = null;
      state.availability = null;

      state.loading = {
        list: false,
        detail: false,
        action: false,
      };

      state.error = null;
      state.success = false;
      state.message = null;
    },

    clearBookingMessage: (state) => {
      state.message = null;
      state.success = false;
    },

    clearBookingError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE BOOKING */
      .addCase(createBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.success = true;

        const newBooking = action.payload.booking;

        state.selectedBooking = newBooking;
        state.message = action.payload.message;

        state.bookings.unshift(newBooking);
        state.totalBookings += 1;
      })
      .addCase(createBooking.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      /* GET BOOKINGS */
      .addCase(getUserBookings.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.list = false;
        state.bookings = action.payload.bookings;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalBookings = action.payload.totalBookings;
      })
      .addCase(getUserBookings.rejected, (state, action: PayloadAction<any>) => {
        state.loading.list = false;
        state.error = action.payload;
      })

      /* GET SINGLE BOOKING */
      .addCase(getBookingById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.detail = false;
        state.selectedBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action: PayloadAction<any>) => {
        state.loading.detail = false;
        state.error = action.payload;
      })

      /* UPDATE BOOKING */
      .addCase(updateBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.success = true;

        const updated = action.payload.booking;

        state.selectedBooking = updated;
        state.message = action.payload.message;

        state.bookings = state.bookings.map((b: any) => (b._id === updated._id ? updated : b));
      })
      .addCase(updateBooking.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      /* CANCEL BOOKING */
      .addCase(cancelBooking.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.success = true;

        const updated = action.payload.booking;

        state.selectedBooking = updated;
        state.message = action.payload.message;

        state.bookings = state.bookings.map((b: any) => (b._id === updated._id ? updated : b));
      })
      .addCase(cancelBooking.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      /* CHECK AVAILABILITY */
      .addCase(checkAvailability.pending, (state) => {
        state.availability = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action: PayloadAction<any>) => {
        state.availability = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action: PayloadAction<any>) => {
        state.availability = null;
        state.error = action.payload;
      });
  },
});

export const { resetBookingState, clearBookingMessage, clearBookingError } = bookingSlice.actions;

export default bookingSlice.reducer;