import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../main/dashboard/products/interfaces/Product";
import { secureFetch } from "../api/secureFetch";
import { API_URL } from "../config/test.config";
import { uCookies } from "../shared/services/cookies";

interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const addProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
    'products/addProduct',
    async (newProductData, { rejectWithValue }) => {
        const { error, data } = await secureFetch({
            options: {
                url: `${API_URL}/items`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${uCookies.getCookie('AuthToken')}`
                },
                body: newProductData,
                stringifyBody: true
            }
        })
        
        if (data) return data
        if (error) return rejectWithValue(error)
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: initialState,
    reducers: {
        setIsSaving: (state, { payload }) => {
            state.status = payload
        } 
    },
    extraReducers: (builder) => {
        builder.addCase(addProduct.pending, (state) => {
            state.status = 'loading'
            state.error = null
        })
        .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
            state.status = 'succeeded'
            state.items.push(action.payload)
            state.error = null
        })
        .addCase(addProduct.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ?? 'Failed to add product (unknown error)';
        });
    },
})

export const { setIsSaving } = productSlice.actions;
export default productSlice;