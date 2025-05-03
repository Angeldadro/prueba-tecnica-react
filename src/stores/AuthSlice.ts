import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        IsAuthenticated: false,
    },
    reducers: {
        setIsAuthenticated: (state, { payload }) => {
            state.IsAuthenticated = payload
        }
    }
})

export const { setIsAuthenticated } = authSlice.actions;

export default authSlice;