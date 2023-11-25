import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { onAxiosGet } from '../../../api/axios.function';

const listLayoutSlice = createSlice({
  name: 'listLayout',
  initialState: { status: 'idle', data: [], HomeTab: { index: 0 }, message: '' },
  reducers: {
    onChangeHomeTabIndex: (state, action) => {
      state.HomeTab.index = action.payload;
    },
  },
  extraReducers: builder => {

  },
});

export const { onChangeHomeTabIndex } = listLayoutSlice.actions;
export default listLayoutSlice.reducer;
