<script setup lang="ts">
  import { computed } from "vue";
  // interfaces
  import type { ProductInterface } from "@/interfaces/product.interface";
  // utils
  import { formatCategory } from "@/utils";

  const props = defineProps<{
    product: ProductInterface;
  }>();

  defineEmits(["delete-item"]);

  const isProductNotAvailable = computed(() => {
    return props.product.availability === 0;
  });
</script>
<template>
  <div
    class="bg-white rounded-md shadow-md flex items-center"
    :class="{ 'opacity-60': isProductNotAvailable }">
    <div>
      <img
        class="rounded-md sm:w-36 sm:h-36 w-32 h-32 object-contain px-2"
        :src="product.image"
        alt="product" />
    </div>
    <div
      class="py-2 px-6 flex justify-between w-full items-center overflow-hidden divide-x h-full">
      <div class="overflow-hidden">
        <h2 class="text-ellipsis overflow-hidden font-bold truncate text-lg">
          {{ product.name }}
        </h2>
        <span class="block text-gray-500 font-bold text-lg"
          >${{ product.price }}</span
        >
        <span class="block font-bold text-sm"
          >Available: {{ product.availability }}</span
        >
        <span class="block font-bold text-sm"
          >Category: {{ formatCategory(product.category) }}</span
        >
      </div>
      <div class="space-y-4 pl-4">
        <RouterLink :to="`products/edit/${product.id}`">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6 stroke-pink-500 fill-pink-500 cursor-pointer">
            <path
              d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
            <path
              d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
          </svg>
        </RouterLink>
        <button
          type="button"
          @click="$emit('delete-item', product.id, product.image)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              class="w-6 h-6 stroke-pink-500 cursor-pointer" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
