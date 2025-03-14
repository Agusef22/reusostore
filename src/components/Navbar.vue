<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-8 lg:px-16 xl:px-32">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="font-bold text-xl text-[#0e4705]">ReUsoStore</router-link>

        <div class="flex items-center space-x-4">
          <router-link to="/" class="hover:text-gray-600">Productos</router-link>
          <router-link to="/faq" class="hover:text-gray-600">Preguntas frecuentes</router-link>
          <button
            @click="cartStore.toggleCart"
            class="relative text-[#0e4705] hover:text-[#165909] transition-colors cursor-pointer"
          >
            <span class="sr-only">Carrito</span>
            🛒
            <span
              v-if="cartStore.cartCount > 0"
              class="absolute -top-2 -right-2 bg-[#0e4705] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.cartCount }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Componente del carrito -->
    <ShoppingCart />
  </nav>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore'
import ShoppingCart from './ShoppingCart.vue'

const cartStore = useCartStore()
</script>
