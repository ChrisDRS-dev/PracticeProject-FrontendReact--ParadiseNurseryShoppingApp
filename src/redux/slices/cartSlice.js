import { createSlice } from '@reduxjs/toolkit'

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Array de objetos { id, name, title, cost, price, image, category, quantity }
  },
  reducers: {
    addItem: (state, action) => {
      const plant = action.payload
      const plantName = plant.name || plant.title
      const plantId = plant.id || plantName
      const plantPrice =
        typeof plant.price === 'number'
          ? plant.price
          : typeof plant.cost === 'number'
            ? plant.cost
            : parseFloat(String(plant.cost || plant.price || '0').replace('$', '')) || 0

      const existingItem = state.items.find(
        (item) =>
          String(item.id) === String(plantId) ||
          (!item.id && (item.name === plantName || item.title === plantName)),
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          id: plantId,
          name: plantName,
          title: plantName,
          cost: plantPrice,
          price: plantPrice,
          image: plant.image,
          category: plant.category,
          stock: typeof plant.stock === 'number' ? plant.stock : 10,
          quantity: 1,
        })
      }
    },

    removeItem: (state, action) => {
      const payload = action.payload
      const targetId = typeof payload === 'object' ? payload.id || payload.name : payload

      state.items = state.items.filter(
        (item) =>
          String(item.id) !== String(targetId) &&
          (!item.id && item.name !== targetId && item.title !== targetId),
      )
    },

    updateQuantity: (state, action) => {
      const { name, id, quantity } = action.payload
      const targetIdentifier = id || name
      const itemToUpdate = state.items.find(
        (item) =>
          String(item.id) === String(targetIdentifier) ||
          (!item.id && (item.name === targetIdentifier || item.title === targetIdentifier)),
      )

      if (itemToUpdate) {
        if (quantity > 0) {
          itemToUpdate.quantity = quantity
        } else {
          // Si la cantidad llega a 0, se remueve el producto del carrito
          state.items = state.items.filter(
            (item) =>
              String(item.id) !== String(targetIdentifier) &&
              (!item.id && item.name !== targetIdentifier && item.title !== targetIdentifier),
          )
        }
      }
    },

    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = CartSlice.actions

export default CartSlice.reducer

