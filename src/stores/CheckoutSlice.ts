import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { secureFetch } from "../api/secureFetch";
import { API_TEST, API_URL } from "../config/test.config";
import { uCookies } from "../shared/services/cookies";
//  transaction
import { ICreateOrderPayload } from "../main/shared/components/ProcessCardInfo/interfaces/CreateOrder";

interface CheckoutState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    acceptenceToken: any | null;
    acceptenceTokenStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CheckoutState = {
    status: 'idle',
    error: null,
    acceptenceToken: null,
    acceptenceTokenStatus: 'idle'
};

export const validatePayment = createAsyncThunk<
    any, 
    ICreateOrderPayload,    
    { rejectValue: string }>(
    'checkout/validatePayment',
    async (NewOrder, { rejectWithValue }) => {
        const token = uCookies.getCookie('AuthToken');
        if (!token) {
            return rejectWithValue("Authentication token missing.");
        }

        const { error, data } = await secureFetch({
            options: {
                url: `${API_URL}/orders`,
                method: 'POST',      
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                stringifyBody: true,
                convertJson: false,
                body: NewOrder
            }
        });

        if (data) {
            return data;
        }
        if (error) {
            return rejectWithValue(error);
        }
        return rejectWithValue('Unknown error creating order');
    }
);

export const getAcceptenceToken = createAsyncThunk<
    any,
    void,
    { rejectValue: string }>(
    'checkout/getAcceptenceToken',
    async (_, { rejectWithValue }) => {
        const { error, data } = await secureFetch({
            options: {
                url: `${API_TEST}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                convertJson: true
            }
        })

        if (data) {
            return data;
        }
        
        if (error) {
            return rejectWithValue(error);
        }

        return rejectWithValue('Unknown error getting acceptence token');
    }
)

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: initialState,
    reducers: {
        cleanCheckoutError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder.addCase(validatePayment.pending, (state) => {
            state.status = 'loading'
            state.error = null
        })
        .addCase(validatePayment.fulfilled, (state) => {
            state.error = null
            state.status = 'succeeded'
        })
        .addCase(validatePayment.rejected, (state, { payload }) => {
            state.error = payload || 'An error has occurred while processing this payment. Try again.'
            state.status = 'failed' 
        })

        .addCase(getAcceptenceToken.pending, (state) => {
            state.acceptenceTokenStatus = 'loading'
            state.error = null
        })
        .addCase(getAcceptenceToken.fulfilled, (state, { payload }) => {
            state.acceptenceToken = payload
            state.acceptenceTokenStatus = 'succeeded'
        })
        .addCase(getAcceptenceToken.rejected, (state, { payload }) => {
            state.error = payload || 'An error has occurred while processing this payment. Try again.'
            state.acceptenceTokenStatus = 'failed' 
        })

    },
})

export const { cleanCheckoutError } = checkoutSlice.actions;
export default checkoutSlice;