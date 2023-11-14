import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { onAxiosGet } from '../../../api/axios.function';

const listPetSlice = createSlice({
  name: 'listPet',
  initialState: { status: 'idle', data: [], dataHide: [], message: '' },
  reducers: {
    addPet: (state, action) => {
      state.data.unshift(action.payload)
    },
    updatePet: (state, action) => {
      if (state.data.length > 0) {
        let i = state.data.findIndex((pet) => String(pet._id) == action.payload[0]);
        if (i > -1) {
          state.data.splice(i, 1, action.payload[1])
        }
      }
    },
    unremovePet: (state, action) => {
      if (state.dataHide.length > 0) {
        let i = state.dataHide.findIndex((pet) => String(pet._id) == action.payload[0]);
        if (i > -1) {
          state.dataHide.splice(i, 1)
          state.data.unshift(action.payload[1])
        }
      }
    },
    removePet: (state, action) => {
      if (state.data.length > 0) {
        let i = state.data.findIndex((pet) => String(pet._id) == action.payload[0]);
        if (i > -1) {
          state.data.splice(i, 1)
          state.dataHide.unshift(action.payload[1])
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPets.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
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

export const fetchPets = createAsyncThunk(
  'shop/fetchPets', async () => {
    let res = await onAxiosGet('shop/list/pet');
    return res;
  });

export const { addPet, updatePet, unremovePet, removePet } = listPetSlice.actions;
export default listPetSlice.reducer;
