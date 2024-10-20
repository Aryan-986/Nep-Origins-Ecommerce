import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from './admin/products-slice'
import shopProductsSlice from "./shop/product-slice"
import shopcartSlice from "./shop/cart-slice"
import shopAddressSlice from "./shop/address-slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts : adminProductsSlice,
    shopProducts : shopProductsSlice,
    shopCart : shopcartSlice,
    shopAddress : shopAddressSlice,
  },
});

export default store;
