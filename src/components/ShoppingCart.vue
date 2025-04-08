<template>
  <div>
    <!-- Overlay con efecto blur -->
    <div
      v-if="cartStore.isOpen"
      class="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-40"
      @click="cartStore.closeCart"
    ></div>

    <!-- Carrito lateral -->
    <div
      class="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 transform transition-transform duration-300 shadow-2xl"
      :class="cartStore.isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Encabezado -->
        <div class="flex justify-between items-center p-4 border-b border-[#cce3c9]">
          <h2 class="text-xl font-semibold text-[#0e4705]">Carrito de Compras</h2>
          <button @click="cartStore.closeCart" class="text-[#0e4705] hover:text-[#165909]">
            <span class="text-2xl">×</span>
          </button>
        </div>

        <!-- Lista de productos -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartStore.items.length === 0" class="text-center text-gray-500 mt-8">El carrito está vacío</div>

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex items-center gap-4 mb-4 border-b border-[#cce3c9] pb-4"
          >
            <div class="flex-1">
              <h3 class="font-medium text-[#0e4705]">{{ item.nombre }}</h3>
              <p class="text-[#1a6b0c]">{{ item.precio }}</p>
              <div class="flex items-center gap-2 mt-2">
                <button @click="cartStore.updateQuantity(item.id, -1)" class="text-[#0e4705] hover:text-[#165909] px-2">
                  -
                </button>
                <span>{{ item.cantidad }}</span>
                <button @click="cartStore.updateQuantity(item.id, 1)" class="text-[#0e4705] hover:text-[#165909] px-2">
                  +
                </button>
                <button @click="cartStore.removeItem(item.id)" class="ml-auto text-red-500 hover:text-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con total y botón de WhatsApp -->
        <div class="border-t border-[#cce3c9] p-4 bg-white">
          <div class="flex justify-between mb-4">
            <span class="font-semibold text-[#0e4705]">Total:</span>
            <span class="font-semibold text-[#0e4705]">${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <button
            @click="whatsappLink"
            class="block w-full bg-[#0e4705] text-white py-3 px-4 rounded text-center hover:bg-[#165909] transition-colors"
          >
            Terminar pedido en WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { useToast } from 'vue-toast-notification'

const cartStore = useCartStore()
const toast = useToast()
const numeroWhatsApp = '5491167919443' // Reemplaza con tu número

const whatsappLink = () => {
  if (cartStore.items.length === 0) {
    toast.error('El carrito está vacío')
    return
  }
  const items = cartStore.items.map((item) => `${item.cantidad}x ${item.nombre}`).join('\n')
  const mensaje = encodeURIComponent(
    `¡Hola! Me gustaría hacer el siguiente pedido:\n\n${items}\n\nTotal: $${cartStore.total.toFixed(2)}`
  )
  window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank')
}

// Observar cambios en el estado del carrito
watch(
  () => cartStore.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<style>
/* Asegurarse de que el carrito tenga scroll si es necesario */
.cart-content {
  overflow-y: auto;
}
</style>
