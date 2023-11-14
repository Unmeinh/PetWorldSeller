import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { onAxiosGet } from '../../../api/axios.function';

const listBillSlice = createSlice({
  name: 'listBill',
  initialState: {
    status: 'idle', data: {
      all: [],
      processing: [],
      delivering: [],
      delivered: [],
      evaluated: [],
      cancelled: [],
    }, message: ''
  },
  reducers: {
    addBill: (state, action) => {
      state.data.unshift(action.payload)
    },
    updateBill: (state, action) => {
      if (state.data.length > 0) {
        let i = state.data.findIndex((bill) => String(bill._id) == action.payload[0]);
        if (i > -1) {
          state.data.splice(i, 1, action.payload[1])
        }
      }
    },
    removeBill: (state, action) => {
      if (state.data.length > 0) {
        let i = state.data.findIndex((bill) => String(bill._id) == action.payload);
        if (i > -1) {
          state.data.splice(i, 1)
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBills.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data.all = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchProcessBills.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchProcessBills.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data.processing = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchDeliveringBills.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDeliveringBills.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data.delivering = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchDeliveredBills.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDeliveredBills.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data.delivered = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchEvaluatedBills.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchEvaluatedBills.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data.evaluated = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchCancelledBills.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchCancelledBills.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data.cancelled = action.payload.data;
          state.status = 'idle';
        } else {
          state.status = 'loading';
        }
      });
  },
});

export const fetchBills = createAsyncThunk(
  'shop/fetchBills', async () => {
    let res = await onAxiosGet('shop/list/bill/all');
    return res;
  });

export const fetchProcessBills = createAsyncThunk(
  'shop/fetchProcessBills', async () => {
    let res = await onAxiosGet('shop/list/bill/processing');
    return res;
  });

export const fetchDeliveringBills = createAsyncThunk(
  'shop/fetchDeliveringBills', async () => {
    let res = await onAxiosGet('shop/list/bill/delivering');
    return res;
  });

export const fetchDeliveredBills = createAsyncThunk(
  'shop/fetchDeliveredBills', async () => {
    let res = await onAxiosGet('shop/list/bill/delivered');
    return res;
  });

export const fetchEvaluatedBills = createAsyncThunk(
  'shop/fetchEvaluatedBills', async () => {
    let res = await onAxiosGet('shop/list/bill/evaluated');
    return res;
  });

export const fetchCancelledBills = createAsyncThunk(
  'shop/fetchCancelledBills', async () => {
    let res = await onAxiosGet('shop/list/bill/cancelled');
    return res;
  });

export const { addBill, updateBill, removeBill } = listBillSlice.actions;
export default listBillSlice.reducer;
