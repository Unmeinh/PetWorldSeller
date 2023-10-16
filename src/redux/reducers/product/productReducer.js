import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../../api/axios.config';

const listProductSlice = createSlice({
  name: 'listProduct',
  initialState: { status: 'idle', data: [], message: '' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      });
  },
});

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts', async () => {
    const res = await api.get(`/pet/list/all?page=${page}`);
    return res.data;
  },
);

export default listProductSlice.reducer;
