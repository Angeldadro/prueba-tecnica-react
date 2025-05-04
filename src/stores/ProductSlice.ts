import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../main/dashboard/products/interfaces/Product";
import { secureFetch } from "../api/secureFetch";
import { API_URL } from "../config/test.config";
import { uCookies } from "../shared/services/cookies";

interface ProductsState {
    items: Product[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    productMemory: Product
}

const initialState: ProductsState = {
    items: [],
    status: 'idle',
    error: null,
    productMemory: {
        id: '', description: '',
        name: '', price: 0,
        stock: 0
    }
};

export const fetchProducts = createAsyncThunk<
    Product[], 
    void,    
    { rejectValue: string }>(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        const token = uCookies.getCookie('AuthToken');
        if (!token) {
            return rejectWithValue("Authentication token missing.");
        }

        const { error, data } = await secureFetch({
            options: {
                url: `${API_URL}/items`,
                method: 'GET',      
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        });

        if (data) {
            return data;
        }
        if (error) {
            return rejectWithValue(error);
        }
        return rejectWithValue('Unknown error fetching products');
    }
);

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
        },
        clearProductError: (state) => {
            state.error = null
        },
        setProductMemory: (state, { payload }) => {
            state.productMemory = payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addProduct.pending, (state) => {
            state.status = 'loading'
            state.error = null
        })

        // Cretae products
        .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
            state.status = 'succeeded'
            state.items.push(action.payload)
            state.error = null
        })
        .addCase(addProduct.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ?? 'Failed to add product (unknown error)';
        })
        
        // Fetching products
        .addCase(fetchProducts.pending, (state) => {
            state.status = 'loading'; 
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.status = 'succeeded';
            state.items = action.payload;
            state.error = null;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ?? 'Failed to fetch products';
        });
    },
})

export const { setIsSaving, clearProductError, setProductMemory } = productSlice.actions;
export default productSlice;