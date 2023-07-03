<script setup lang="ts">
  import VueTailwindDatepicker from "vue-tailwind-datepicker";
  // composables
  import useSales from "@/composables/useSales";
  import SaleItem from "@/components/SaleItem.vue";
  // utils
  import { formatCurrency } from "@/utils";

  const { sales, date, isDateSelected, totalSalesOfDay } = useSales();
  const format = {
    date: "YYYY/MM/DD",
    month: "MMM",
  };
</script>

<template>
  <div class="mt-8">
    <h2 class="title">Sales</h2>
  </div>
  <div class="flex flex-1 lg:overflow-hidden lg:flex-row flex-col gap-6">
    <div
      class="flex flex-col gap-4 px-0 items-start lg:pt-8 pt-4 lg:w-1/3 w-full lg:h-full mr-8">
      <VueTailwindDatepicker
        as-single
        no-input
        v-model="date"
        :formatter="format" />
    </div>
    <div
      class="flex lg:w-3/4 w-full overflow-y-auto flex-col items-center scrollbar-container pt-10 pb-16 mb-4 bg-white rounded-md shadow-md px-8">
      <template v-if="isDateSelected">
        <p class="w-full text-2xl font-bold text-gray-600 text-center">
          Sales from
          <span class="font-extrabold text-gray-500">{{ date }}</span>
        </p>

        <p class="w-full text-xl my-8 font-bold text-gray-600 text-right">
          Total Sales:
          <span class="font-extrabold text-gray-500">{{
            formatCurrency(totalSalesOfDay)
          }}</span>
        </p>
        <hr class="w-full" />
        <SaleItem
          v-if="sales.length > 0"
          v-for="sale in sales"
          :key="sale.id"
          :sale="sale" />

        <p v-else class="text-lg font-bold my-10 text-center">
          There are no sales for this date
        </p>
      </template>
      <p
        class="w-full text-2xl font-bold text-gray-600 text-center my-8"
        v-else>
        Select a date to view sales
      </p>
    </div>
  </div>
</template>
