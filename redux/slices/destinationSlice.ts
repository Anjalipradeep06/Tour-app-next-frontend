import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  getAllDestinations,
  getFeaturedDestinations,
  getPopularDestinations,
  getDestinationsByContinent,
  getDestinationById,
  createDestination,
  updateDestination,
} from "../thunks/destinationThunk";

const getStoredAuth = (): any => {
  if (typeof window === "undefined") return null;
  const storedAuth = localStorage.getItem("auth");
  return storedAuth ? JSON.parse(storedAuth) : null;
};

const parsedAuth = getStoredAuth();

const initialState = {
  featuredDestinations: parsedAuth?.featuredDestinations || [],
  destinations: parsedAuth?.destinations || [],
  popularDestinations: parsedAuth?.popularDestinations || [],
  allDestinations: parsedAuth?.allDestinations || [],
  selectedDestination: parsedAuth?.selectedDestination || null,
  destinationTours: parsedAuth?.destinationTours || [],

  total: 0,
  page: 1,
  pages: 1,

  loading: false,
  error: null as string | null,

  actionLoading: false,
  actionError: null as string | null,
  actionSuccess: false,
  actionMessage: null as string | null,
};

const destinationSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {
    clearDestinations: (state) => {
      state.destinations = [];
      state.popularDestinations = [];
    },

    clearSelectedDestination: (state) => {
      state.selectedDestination = null;
      state.destinationTours = [];
    },

    resetDestinationActionState: (state) => {
      state.actionLoading = false;
      state.actionError = null;
      state.actionSuccess = false;
      state.actionMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ALL DESTINATIONS */
      .addCase(getAllDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDestinations.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.allDestinations = action.payload.destinations || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(getAllDestinations.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FEATURED */
      .addCase(getFeaturedDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedDestinations.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.featuredDestinations = action.payload.destinations || action.payload || [];
      })
      .addCase(getFeaturedDestinations.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* POPULAR */
      .addCase(getPopularDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularDestinations.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.popularDestinations = action.payload.destinations || action.payload || [];
      })
      .addCase(getPopularDestinations.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CONTINENT */
      .addCase(getDestinationsByContinent.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDestinationsByContinent.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.destinations = action.payload.destinations || action.payload || [];
      })
      .addCase(getDestinationsByContinent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SINGLE DESTINATION */
      .addCase(getDestinationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDestinationById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.selectedDestination = action.payload.destination || action.payload;
        state.destinationTours = action.payload.tours || [];
      })
      .addCase(getDestinationById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE DESTINATION */
      .addCase(createDestination.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })
      .addCase(createDestination.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.allDestinations = [action.payload.destination, ...state.allDestinations];
        state.total += 1;
        state.actionMessage = action.payload.message || "Destination created successfully";
      })
      .addCase(createDestination.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
        state.actionSuccess = false;
      })

      /* UPDATE DESTINATION */
      .addCase(updateDestination.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionSuccess = false;
      })
      .addCase(updateDestination.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.allDestinations = state.allDestinations.map((destination: any) =>
          destination._id === action.payload.destination._id
            ? action.payload.destination
            : destination
        );
        state.actionMessage = action.payload.message || "Destination updated successfully";
      })
      .addCase(updateDestination.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
        state.actionSuccess = false;
      });
  },
});

export const { clearDestinations, clearSelectedDestination, resetDestinationActionState } =
  destinationSlice.actions;

export default destinationSlice.reducer;