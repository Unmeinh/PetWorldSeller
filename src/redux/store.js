import { configureStore } from '@reduxjs/toolkit';
import petReducer from './reducers/pet/petReducer';
import shopReducer from './reducers/shop/shopReducer';
import productReducer from './reducers/product/productReducer';

const store = configureStore({
  reducer: {
    listShop: shopReducer,
    listPet: petReducer,
    listProduct: productReducer
  },
});

export default store;
