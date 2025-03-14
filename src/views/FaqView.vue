<template>
  <div class="container mx-auto px-8 lg:px-16 xl:px-32">
    <!-- Hero Section -->
    <section class="py-24 flex flex-col items-center justify-center relative">
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 bg-[#f0f7ef] opacity-50 -skew-y-3 transform my-15"></div>

      <!-- Contenido -->
      <div class="relative z-10 text-center max-w-2xl mx-auto">
        <h1 class="text-5xl font-bold mb-6 text-[#0e4705] leading-tight">Preguntas Frecuentes</h1>
        <p class="text-[#1a6b0c] text-xl mb-10 font-light">
          Encuentra respuestas a las dudas más comunes sobre nuestros productos
        </p>
      </div>
    </section>

    <!-- Preguntas Frecuentes -->
    <section class="max-w-3xl mx-auto mb-24">
      <div class="space-y-6">
        <div
          v-for="(pregunta, index) in preguntas"
          :key="index"
          class="border border-[#cce3c9] rounded-lg overflow-hidden bg-white"
        >
          <button
            @click="pregunta.isOpen = !pregunta.isOpen"
            class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-[#f0f7ef] transition-colors"
          >
            <span class="text-lg font-medium text-[#0e4705]">{{ pregunta.pregunta }}</span>
            <span class="transform transition-transform duration-200" :class="pregunta.isOpen ? 'rotate-180' : ''">
              ▼
            </span>
          </button>
          <div v-show="pregunta.isOpen" class="px-6 py-4 border-t border-[#cce3c9] text-[#1a6b0c]">
            {{ pregunta.respuesta }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const preguntas = ref([
  {
    pregunta: '¿Cómo realizo un pedido?',
    respuesta:
      'Simplemente agrega los productos que desees al carrito y haz clic en "Terminar pedido en WhatsApp". Te atenderemos personalmente para coordinar el envío y el pago.',
    isOpen: true
  },
  {
    pregunta: '¿Cuáles son los métodos de pago?',
    respuesta: 'Aceptamos transferencias bancarias y efectivo. Los detalles específicos se coordinarán por WhatsApp.',
    isOpen: false
  },
  {
    pregunta: '¿Realizan envíos a todo el país?',
    respuesta:
      'Sí, realizamos envíos a todo el país a través de empresas de logística confiables. Los costos y tiempos de envío varían según la ubicación.',
    isOpen: false
  },
  {
    pregunta: '¿Tienen tienda física?',
    respuesta: 'Actualmente operamos exclusivamente de manera online para mantener precios más accesibles.',
    isOpen: false
  }
])
</script>

<style scoped>
/* Animación suave para el acordeón */
.transform {
  transition: transform 0.2s ease-in-out;
}
</style>
