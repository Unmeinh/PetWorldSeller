import { configureStore, combineReducers } from '@reduxjs/toolkit';
import petReducer from './reducers/pet/petReducer';
import shopReducer from './reducers/shop/shopReducer';
import productReducer from './reducers/product/productReducer';
import billReducer from './reducers/bill/billReducer';

// const store = configureStore({
//   reducer: {
//     listShop: shopReducer,
//     listPet: petReducer,
//     listProduct: productReducer
//   },
// });

const combinedReducer = combineReducers({
  listShop: shopReducer,
  listPet: petReducer,
  listProduct: productReducer,
  listBill: billReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'shop/logout') { // check for action type 
    state = undefined;
  }
  return combinedReducer( state, action );
};

export default configureStore({
  reducer: rootReducer,
});

// export default store;
