import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../thunks/notificationThunk";

const initialState = {
  notifications: [] as any[],
  unreadCount: 0,
  page: 1,
  hasMore: true,

  loading: {
    list: false,
    unreadCount: false,
    action: false,
  },

  error: null as string | null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,

  reducers: {
    resetNotificationState: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.page = 1;
      state.hasMore = true;

      state.loading = {
        list: false,
        unreadCount: false,
        action: false,
      };

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.list = false;

        const { notifications, page, count, limit } = action.payload;

        state.notifications = page > 1 ? [...state.notifications, ...notifications] : notifications;

        state.page = page;
        state.hasMore = count === limit;
      })
      .addCase(getNotifications.rejected, (state, action: PayloadAction<any>) => {
        state.loading.list = false;
        state.error = action.payload;
      })

      .addCase(getUnreadCount.pending, (state) => {
        state.loading.unreadCount = true;
      })
      .addCase(getUnreadCount.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.unreadCount = false;
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action: PayloadAction<any>) => {
        state.loading.unreadCount = false;
        state.error = action.payload;
      })

      .addCase(markAsRead.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading.action = false;

        const updated = action.payload;
        const wasUnread = state.notifications.find((n: any) => n._id === updated._id && !n.isRead);

        state.notifications = state.notifications.map((n: any) => (n._id === updated._id ? updated : n));

        if (wasUnread && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(markAsRead.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      })

      .addCase(markAllAsRead.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading.action = false;
        state.notifications = state.notifications.map((n: any) => ({ ...n, isRead: true }));
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action: PayloadAction<any>) => {
        state.loading.action = false;
        state.error = action.payload;
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;