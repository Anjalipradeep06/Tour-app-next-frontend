import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import tourReducer from "./slices/tourSlice";
import destinationReducer from "./slices/destinationSlice";
import bookingReducer from "./slices/bookingSlice";
import paymentReducer from "./slices/paymentSlice";
import notificationReducer from "./slices/notificationSlice";
import reviewReducer from "./slices/reviewSlice";
import adminReducer from "./slices/adminSlice";
import adminUserReducer from "./slices/adminUserSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: tourReducer,
    destinations: destinationReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    notification: notificationReducer,
    review: reviewReducer,
    admin: adminReducer,
    adminUsers: adminUserReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;