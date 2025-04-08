<template>
  <div class="container mx-auto px-8 lg:px-16 xl:px-32">
    <!-- Hero Section -->
    <section class="py-12 md:py-24 flex flex-col items-center justify-center relative">
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 bg-[#f0f7ef] opacity-50 -skew-y-3 transform my-15"></div>

      <!-- Contenido -->
      <div class="relative z-10 text-center max-w-2xl mx-auto px-4">
        <h1 class="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-[#0e4705] leading-tight">
          Productos Usados en Excelente Estado
        </h1>
        <p class="text-[#1a6b0c] text-lg md:text-xl mb-8 md:mb-10 font-light">
          Descubre nuestra colección de productos usados en excelente estado, listos para usar
        </p>
        <div class="flex justify-center gap-4">
          <router-link to="/faq">
            <button
              class="border-2 border-[#0e4705] text-[#0e4705] px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-[#f0f7ef] transition-all duration-300 cursor-pointer text-sm md:text-base"
            >
              Preguntas frecuentes
            </button>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Productos -->
    <section class="mb-8 md:mb-16 max-w-4xl mx-auto px-4">
      <h2 class="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-[#0e4705]">Nuestros Productos</h2>

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
          v-for="producto in paginatedProducts"
          :key="producto.id"
          @click="openModal(producto)"
          class="bg-white border border-[#cce3c9] rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 cursor-pointer"
        >
          <!-- Imagen miniatura -->
          <img
            :src="producto.imagenes[0]"
            :alt="producto.nombre"
            class="w-full md:w-20 h-48 md:h-20 object-cover rounded-lg flex-shrink-0"
          />

          <!-- Información del producto -->
          <div class="flex-grow w-full">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-2">
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
            class="bg-[#0e4705] text-white w-full md:w-auto px-4 md:px-6 py-2 rounded-lg hover:bg-[#165909] transition-colors flex-shrink-0 text-center"
          >
            Agregar
          </button>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="{
              'bg-[#0e4705] text-white': currentPage === page,
              'border border-[#0e4705] text-[#0e4705] hover:bg-[#f0f7ef]': currentPage !== page
            }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </section>

    <!-- Modal de imágenes -->
    <div v-if="selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 backdrop-blur-sm bg-opacity-50" @click="closeModal"></div>

      <!-- Modal content -->
      <div class="relative bg-white rounded-lg w-full max-w-5xl mx-auto z-10 max-h-[95vh] overflow-y-auto">
        <!-- Close button -->
        <button @click="closeModal" class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10 p-2 text-xl">
          ✕
        </button>

        <div class="p-4 md:p-8">
          <!-- Imagen principal -->
          <div class="relative h-[300px] md:h-[600px] mb-6">
            <img
              :src="selectedProduct.imagenes[currentImageIndex]"
              :alt="selectedProduct.nombre"
              class="w-full h-full object-contain rounded-lg"
            />

            <!-- Flechas de navegación -->
            <button
              @click="prevImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-[#0e4705] w-10 h-10 rounded-full flex items-center justify-center shadow-md text-xl"
            >
              ←
            </button>
            <button
              @click="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-[#0e4705] w-10 h-10 rounded-full flex items-center justify-center shadow-md text-xl"
            >
              →
            </button>
          </div>

          <!-- Miniaturas -->
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
            <button
              v-for="(imagen, index) in selectedProduct.imagenes"
              :key="index"
              @click="currentImageIndex = index"
              class="flex-shrink-0 w-20 md:w-24 h-20 md:h-24 rounded-lg overflow-hidden"
              :class="{ 'ring-3 ring-[#0e4705]': currentImageIndex === index }"
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
import { ref, onMounted, watch, computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import productosData from '../data/productos.json'

const cartStore = useCartStore()
const productos = ref([])
const selectedProduct = ref(null)
const currentImageIndex = ref(0)
const loading = ref(true)
const error = ref(null)

const itemsPerPage = 6
const currentPage = ref(1)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return productos.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(productos.value.length / itemsPerPage))

const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fetchProductos = async () => {
  try {
    loading.value = true
    // Simulamos una pequeña demora para mostrar el loading
    await new Promise((resolve) => setTimeout(resolve, 500))
    productos.value = productosData.productos
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
