<script setup lang="ts">
  import { computed } from "vue";
  // interfaces
  import type { ProductInterface } from "@/interfaces/product.interface";
  // stores
  import { cartStore } from "@/stores/cart";
  // utils
  import { formatCategory } from "@/utils";

  const props = defineProps<{
    product: ProductInterface;
  }>();

  const cart = cartStore();

  const isAvailable = computed(() => props.product.availability > 0);
</script>

<template>
  <div class="rounded-md overflow-hidden shadow-md bg-white">
    <img
      class="object-cover aspect-square h-80 w-full"
      :src="product.image"
      :alt="product.name" />
    <div class="px-6 py-4 overflow-hidden">
      <h3 class="font-bold text-xl mb-2 truncate">{{ product.name }}</h3>
      <hr class="my-2" />
      <span class="inline-block py-1 text-lg font-bold text-gray-500 mr-2"
        >${{ product.price }}</span
      >
    </div>
    <div class="px-6">
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >Available: {{ product.availability }}</span
      >
      <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >Category: {{ formatCategory(product.category) }}</span
      >
      <button
        :disabled="!isAvailable"
        @click="cart.addItem(product)"
        class="w-full mt-2 mb-6 flex items-center justify-center"
        :class="isAvailable ? 'btn' : 'btn-disabled'">
        <svg
          v-if="isAvailable"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 stroke-white mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {{ isAvailable ? "Add to cart" : "Out of stock" }}
      </button>
    </div>
  </div>
</template>
