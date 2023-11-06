import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios.config';
import { onAxiosGet } from '../../../api/axios.function';

const listShopSlice = createSlice({
  name: 'listShop',
  initialState: { status: 'being idle', data: [], message: '' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMyShops.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMyShops.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.status = 'being idle';
        } else {
          state.status = 'loading';
        }
      });
  },
});

export const fetchMyShops = createAsyncThunk(
  'shop/fetchMyShops', async () => {
    const res = await onAxiosGet('/shop/myDetail');
    return res;
  });

export default listShopSlice.reducer;
