<template>
  <div class="container mx-auto px-8 lg:px-16 xl:px-32">
    <!-- Hero Section -->
    <section class="py-24 flex flex-col items-center justify-center relative">
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 bg-[#f0f7ef] opacity-50 -skew-y-3 transform my-15"></div>

      <!-- Contenido -->
      <div class="relative z-10 text-center max-w-2xl mx-auto">
        <h1 class="text-5xl font-bold mb-6 text-[#0e4705] leading-tight">Productos Usados en Excelente Estado</h1>
        <p class="text-[#1a6b0c] text-xl mb-10 font-light">
          Descubre nuestra colección de productos usados en excelente estado, listos para usar
        </p>
        <div class="flex justify-center gap-4">
          <router-link to="/faq">
            <button
              class="border-2 border-[#0e4705] text-[#0e4705] px-8 py-3 rounded-lg hover:bg-[#f0f7ef] transition-all duration-300 cursor-pointer"
            >
              Preguntas frecuentes
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Productos -->
    <section class="mb-16 max-w-4xl mx-auto">
      <h2 class="text-2xl font-semibold mb-8 text-[#0e4705]">Nuestros Productos</h2>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e4705] mx-auto"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <!-- Products list -->
      <div v-else class="space-y-4">
        <div
          v-for="producto in productos"
          :key="producto.id"
          @click="openModal(producto)"
          class="bg-white border border-[#cce3c9] rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-6 cursor-pointer"
        >
          <!-- Imagen miniatura -->
          <img
            :src="producto.imagenes[1]"
            :alt="producto.nombre"
            class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          />

          <!-- Información del producto -->
          <div class="flex-grow">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-medium text-[#0e4705]">{{ producto.nombre }}</h3>
                <p class="text-[#1a6b0c] text-sm mt-1">{{ producto.descripcionCorta }}</p>
              </div>
              <span class="text-lg font-semibold text-[#0e4705]">{{ producto.precio }}</span>
            </div>

            <!-- Etiquetas -->
            <div class="mt-2 flex gap-2">
              <span
                v-if="producto.etiqueta"
                class="inline-block bg-[#f0f7ef] text-[#0e4705] text-xs px-2 py-1 rounded-full"
              >
                {{ producto.etiqueta }}
              </span>
            </div>
          </div>

          <!-- Botón de agregar -->
          <button
            @click.stop="cartStore.addToCart(producto)"
            class="bg-[#0e4705] text-white px-6 py-2 rounded-lg hover:bg-[#165909] transition-colors flex-shrink-0"
          >
            Agregar
          </button>
        </div>
      </div>
    </section>

    <!-- Modal de imágenes -->
    <div v-if="selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 backdrop-blur-sm bg-opacity-50" @click="closeModal"></div>

      <!-- Modal content -->
      <div class="relative bg-white rounded-lg max-w-3xl w-full mx-auto z-10">
        <!-- Close button -->
        <button @click="closeModal" class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10">✕</button>

        <div class="p-6">
          <!-- Imagen principal -->
          <div class="relative h-150 mb-4">
            <img
              :src="selectedProduct.imagenes[currentImageIndex]"
              :alt="selectedProduct.nombre"
              class="w-full h-full object-cover rounded-lg"
            />

            <!-- Flechas de navegación -->
            <button
              @click="prevImage"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-[#0e4705] w-8 h-8 rounded-full flex items-center justify-center"
            >
              ←
            </button>
            <button
              @click="nextImage"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-[#0e4705] w-8 h-8 rounded-full flex items-center justify-center"
            >
              →
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(imagen, index) in selectedProduct.imagenes"
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden"
              :class="{ 'ring-2 ring-[#0e4705]': currentImageIndex === index }"
            >
              <img :src="imagen" :alt="selectedProduct.nombre" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabase'

const cartStore = useCartStore()
const productos = ref([])
const selectedProduct = ref(null)
const currentImageIndex = ref(0)
const loading = ref(true)
const error = ref(null)

const fetchProductos = async () => {
  try {
    loading.value = true

    let { data: products, error } = await supabase.from('products').select('*')

    if (error) throw error

    // Transformar los datos para que coincidan con nuestro formato
    productos.value = products.map((producto) => ({
      id: producto.id,
      nombre: producto.name,
      precio: `$${producto.price}`,
      descripcionCorta: producto.description,
      etiqueta: producto.etiqueta,
      imagenes: [producto.imagen1, producto.imagen2, producto.imagen3].filter(Boolean) // Elimina valores null o vacíos
    }))
  } catch (e) {
    error.value = 'Error al cargar los productos'
    console.error('Error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProductos()
})

const openModal = (producto) => {
  selectedProduct.value = producto
  currentImageIndex.value = 0
}

const closeModal = () => {
  selectedProduct.value = null
}

const nextImage = () => {
  if (!selectedProduct.value) return
  currentImageIndex.value = (currentImageIndex.value + 1) % selectedProduct.value.imagenes.length
}

const prevImage = () => {
  if (!selectedProduct.value) return
  currentImageIndex.value =
    currentImageIndex.value === 0 ? selectedProduct.value.imagenes.length - 1 : currentImageIndex.value - 1
}

watch(
  () => selectedProduct.value,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<style scoped>
/* Ocultar scrollbar pero mantener funcionalidad */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
