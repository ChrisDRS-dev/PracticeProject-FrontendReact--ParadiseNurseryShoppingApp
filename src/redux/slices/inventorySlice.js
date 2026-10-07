import { createSlice } from '@reduxjs/toolkit'
import plantsDbData from '../../data/PlantsDB.json'

const STORAGE_KEY = 'paradise_nursery_inventory_v2'
const HISTORY_STORAGE_KEY = 'paradise_nursery_restock_history_v2'

const loadInitialInventory = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('No se pudo leer inventario de localStorage:', e)
  }
  return plantsDbData.map((plant) => ({
    ...plant,
    stock: typeof plant.stock === 'number' ? plant.stock : 10,
    initialStock: 10,
  }))
}

const loadInitialHistory = () => {
  try {
    const cached = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // fallback
  }
  return []
}

const initialState = {
  items: loadInitialInventory(),
  isRestocking: false,
  restockCount: 0,
  lastRestockTimestamp: null,
  restockHistory: loadInitialHistory(),
  restockThresholdPercentage: 50, // 50% de los items sin stock detona la orden a la API
}

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Descuenta stock al realizar compras
    deductStock: (state, action) => {
      const purchasedItems = action.payload || []

      purchasedItems.forEach((purchased) => {
        const identifier = purchased.id || purchased.name || purchased.title
        const plant = state.items.find(
          (p) =>
            p.id === identifier ||
            p.name?.es === identifier ||
            p.name?.en === identifier ||
            p.title === identifier,
        )

        if (plant) {
          const qty = purchased.quantity || 1
          plant.stock = Math.max(0, (plant.stock ?? 10) - qty)
        }
      })

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
      } catch (err) {
        console.error('Error guardando inventario en localStorage:', err)
      }
    },

    // Establece el estado de carga mientras se consulta la API
    setRestocking: (state, action) => {
      state.isRestocking = Boolean(action.payload)
    },

    // Reabastece el inventario cargando 10 unidades a todos los productos desde la API
    replenishStock: (state, action) => {
      const amount = action.payload?.amount || 10
      const source = action.payload?.source || 'perenual-api'

      state.items.forEach((plant) => {
        plant.stock = amount
      })

      state.restockCount += 1
      state.lastRestockTimestamp = new Date().toISOString()
      state.isRestocking = false

      const logEntry = {
        id: Date.now(),
        timestamp: state.lastRestockTimestamp,
        amount,
        source,
        reason: 'Umbral logístico de 50% de stock agotado alcanzado',
      }

      state.restockHistory.unshift(logEntry)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(state.restockHistory))
      } catch (err) {
        console.error('Error guardando reabastecimiento en localStorage:', err)
      }
    },

    // Simulación de prueba de estrés para vaciar el stock de la mitad de los items
    simulateDepleteHalfStock: (state) => {
      const halfIndex = Math.ceil(state.items.length / 2)
      for (let i = 0; i < halfIndex; i++) {
        state.items[i].stock = 0
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
      } catch (e) {
        console.error(e)
      }
    },

    // Restablece el inventario completo a su estado inicial
    resetInventory: (state) => {
      state.items = plantsDbData.map((plant) => ({
        ...plant,
        stock: 10,
        initialStock: 10,
      }))
      state.isRestocking = false
      state.restockCount = 0
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
      } catch (e) {
        console.error(e)
      }
    },
  },
})

export const {
  deductStock,
  setRestocking,
  replenishStock,
  simulateDepleteHalfStock,
  resetInventory,
} = inventorySlice.actions

// Selectores
export const selectInventoryItems = (state) => state.inventory?.items || []

export const selectOutOfStockCount = (state) => {
  const items = state.inventory?.items || []
  return items.filter((item) => (item.stock ?? 10) === 0).length
}

export const selectInventoryMetrics = (state) => {
  const items = state.inventory?.items || []
  const total = items.length
  const outOfStock = items.filter((item) => (item.stock ?? 10) === 0).length
  const available = total - outOfStock
  const outOfStockPct = total > 0 ? (outOfStock / total) * 100 : 0
  const isThresholdReached = total > 0 && outOfStock >= Math.ceil(total / 2)

  return {
    total,
    available,
    outOfStock,
    outOfStockPct: Number(outOfStockPct.toFixed(1)),
    isThresholdReached,
    restockCount: state.inventory?.restockCount || 0,
    lastRestockTimestamp: state.inventory?.lastRestockTimestamp || null,
    isRestocking: state.inventory?.isRestocking || false,
    restockHistory: state.inventory?.restockHistory || [],
  }
}

export default inventorySlice.reducer

