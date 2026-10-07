import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import inventoryReducer from './slices/inventorySlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    inventory: inventoryReducer,
  },
})

export default store

