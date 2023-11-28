import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { onAxiosGet } from '../../../api/axios.function';

const listProductSlice = createSlice({
  name: 'listProduct',
  initialState: { status: 'idle', data: [], dataHide: [], message: '' },
  reducers: {
    addProduct: (state, action) => {
      state.data.unshift(action.payload)
    },
    updateProduct: (state, action) => {
      if (state.data.length > 0) {
        let i = state.data.findIndex((product) => String(product._id) == action.payload[0]);
        if (i > -1) {
          state.data.splice(i, 1, action.payload[1])
        }
      }
    },
    unremoveProduct: (state, action) => {
      if (state.dataHide.length > 0) {
        let i = state.dataHide.findIndex((product) => String(product._id) == action.payload[0]);
        if (i > -1) {
          state.dataHide.splice(i, 1)
          state.data.unshift(action.payload[1])
        }
      }
    },
    removeProduct: (state, action) => {
      if (state.data.length > 0) {
        let i = state.data.findIndex((product) => String(product._id) == action.payload[0]);
        if (i > -1) {
          state.data.splice(i, 1)
          state.dataHide.unshift(action.payload[1])
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data?.dataShow;
          state.dataHide = action.payload.data?.dataHide;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      });
  },
});

export const fetchProducts = createAsyncThunk(
  'shop/fetchProducts', async () => {
    const res = await onAxiosGet('shop/list/product');
    return res;
  },
);

export const { addProduct, updateProduct, unremoveProduct, removeProduct } = listProductSlice.actions;
export default listProductSlice.reducer;
