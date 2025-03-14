import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false
  }),

  getters: {
    cartCount: (state) => state.items.length,

    total: (state) => {
      return state.items.reduce((sum, item) => {
        return sum + parseFloat(item.precio.replace('$', '')) * item.cantidad
      }, 0)
    }
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id)
      if (existingItem) {
        existingItem.cantidad++
      } else {
        this.items.push({
          ...product,
          cantidad: 1
        })
      }
    },

    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
    },

    updateQuantity(productId, change) {
      const item = this.items.find((item) => item.id === productId)
      if (item) {
        item.cantidad = Math.max(1, item.cantidad + change)
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    closeCart() {
      this.isOpen = false
    }
  }
})
