<script setup lang="ts">
  // components
  import Amount from "./Amount.vue";
  // interfaces
  import type { SaleInterface } from "@/interfaces/product.interface";
  // utils
  import { formatCurrency } from "@/utils";

  defineProps<{
    sale: SaleInterface;
  }>();
</script>
<template>
  <div class="flex w-full flex-col items-start">
    <h1 class="text-xl font-bold mt-8">Sale Details:</h1>
    <h2 class="font-bold text-gray-500 my-8">Sold Products:</h2>
    <ul class="flex flex-col w-full">
      <li v-for="item in sale.items" class="flex w-full flex-col">
        <div class="flex">
          <div
            class="w-20 h-18 overflow-hidden rounded-full relative shadow-lg">
            <img
              class="h-full w-full object-cover absolute top-0 left-0"
              :src="item.image"
              alt="product" />
          </div>
          <div class="ml-4 w-full overflow-hidden">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ item.name }}
            </p>
            <p class="text-sm text-gray-600 py-1">
              {{ formatCurrency(item.price) }}
            </p>
            <p class="text-sm text-gray-600 py-1">
              Quantity: {{ item.quantity }}
            </p>
          </div>
        </div>

        <hr class="my-4 w-full" />
      </li>
    </ul>
    <dl class="w-full text-sm font-medium text-gray-500 space-y-2">
      <Amount>
        <template #label>Subtotal</template>
        {{ formatCurrency(sale.subtotal) }}
      </Amount>
      <Amount>
        <template #label>Taxes</template>
        {{ formatCurrency(sale.taxes) }}
      </Amount>
      <Amount v-if="sale.discount" class="bg-green-200">
        <template #label>Discount</template>
        -{{ formatCurrency(sale.discount) }}
      </Amount>
      <Amount class="text-lg">
        <template #label>Total</template>
        {{ formatCurrency(sale.total) }}
      </Amount>
    </dl>
    <hr class="mt-8 w-full" />
  </div>
</template>
