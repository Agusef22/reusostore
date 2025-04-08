<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-8 lg:px-16 xl:px-32">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="font-bold text-xl text-[#0e4705]">ReUsoStore</router-link>

        <!-- Enlaces para pantallas grandes -->
        <div class="hidden md:flex items-center space-x-4">
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

        <!-- Botón de menú hamburguesa para móviles -->
        <div class="md:hidden flex items-center">
          <button @click="isMenuOpen = !isMenuOpen" class="text-[#0e4705] hover:text-[#165909] p-2">
            <span class="sr-only">Menú</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú móvil -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-show="isMenuOpen" class="md:hidden bg-white">
          <div class="px-2 pt-2 pb-3 flex justify-around items-center">
            <router-link to="/" class="hover:text-gray-600" @click="isMenuOpen = false"> Productos </router-link>
            <router-link to="/faq" class="hover:text-gray-600" @click="isMenuOpen = false">
              Preguntas frecuentes
            </router-link>
            <button @click="handleMobileCart" class="hover:text-gray-600 flex items-center">
              🛒
              <span v-if="cartStore.cartCount > 0" class="ml-1 bg-[#0e4705] text-white text-xs rounded-full px-2 py-1">
                {{ cartStore.cartCount }}
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Componente del carrito -->
    <ShoppingCart />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import ShoppingCart from './ShoppingCart.vue'

const cartStore = useCartStore()
const isMenuOpen = ref(false)

const handleMobileCart = () => {
  cartStore.toggleCart()
  isMenuOpen.value = false
}
</script>
