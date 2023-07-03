<script setup lang="ts">
  // interfaces
  import type { CartInterface } from "@/interfaces/product.interface";
  // store
  import { cartStore } from "@/stores/cart";
  // utils
  import { formatCurrency } from "@/utils";

  defineProps<{
    item: CartInterface;
  }>();

  const cart = cartStore();
</script>

<template>
  <li>
    <div class="flex items-center justify-between">
      <div class="flex items-center w-full">
        <img
          class="aspect-square w-16 h-16 object-cover rounded-full shadow-lg"
          :src="item.image"
          alt="product" />
        <div class="ml-4 w-full overflow-hidden">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ item.name }}
          </p>
          <p class="text-sm text-gray-600 py-1">
            {{ formatCurrency(item.price) }}
          </p>
          <select
            class="rounded-md min-w-[80px]"
            :value="item.quantity"
            @change="
              cart.updateQuantity(
                item.id,
                +($event.target as HTMLInputElement)?.value
              )
            ">
            <option v-for="n in cart.checkAvailability(item)">{{ n }}</option>
          </select>
        </div>
      </div>
      <div class="flex items-center">
        <button
          aria-label="Remove item"
          class="text-gray-400 hover:text-gray-500"
          @click="cart.deleteItem(item.id)">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M20 12H4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>
    <hr class="my-4" />
  </li>
</template>
