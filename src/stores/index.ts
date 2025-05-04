import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";
import productSlice from "./ProductSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        products: productSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;