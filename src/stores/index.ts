import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";
import productSlice from "./ProductSlice";
import checkoutSlice from "./CheckoutSlice";
import notificationSlice from "./NotificationSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        products: productSlice.reducer,
        checkout: checkoutSlice.reducer,
        notifications: notificationSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;