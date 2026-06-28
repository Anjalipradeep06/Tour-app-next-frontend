import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllUsers, softDeleteUser, restoreUser } from "../thunks/adminUserThunk";

const initialState = {
  users: [] as any[],
  count: 0,

  loading: false,
  error: null as string | null,

  actionLoading: false,
  actionError: null as string | null,
  actionTargetId: null as string | null,
};

const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    resetAdminUserError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL USERS */
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.count = action.payload.count;
      })
      .addCase(getAllUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SOFT DELETE USER */
      .addCase(softDeleteUser.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionTargetId = action.meta.arg;
      })
      .addCase(softDeleteUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        const idx = state.users.findIndex((u: any) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(softDeleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        state.actionError = action.payload;
      })

      /* RESTORE USER */
      .addCase(restoreUser.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        state.actionTargetId = action.meta.arg;
      })
      .addCase(restoreUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        const idx = state.users.findIndex((u: any) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(restoreUser.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionTargetId = null;
        state.actionError = action.payload;
      });
  },
});

export const { resetAdminUserError } = adminUserSlice.actions;
export default adminUserSlice.reducer;