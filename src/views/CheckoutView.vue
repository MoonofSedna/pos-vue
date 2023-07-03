<script setup lang="ts">
  import { onMounted, ref, computed } from "vue";
  import { useRoute } from "vue-router";
  // components
  import Link from "@/components/Link.vue";
  import ShopLayout from "@/components/ShopLayout.vue";
  // composables
  import useSales from "@/composables/useSales";
  // interfaces
  import type { SaleInterface } from "@/interfaces/product.interface";
  // utils
  import { formatCurrency } from "@/utils";

  const route = useRoute();
  const { getSale } = useSales();

  const sale = ref<SaleInterface | null>(null);

  const saleId = computed(() => route.params.id as string);

  onMounted(async () => {
    const saleRef = (await getSale(saleId.value)).data();
    sale.value = saleRef as SaleInterface;
  });
</script>
<template>
  <ShopLayout>
    <div class="flex flex-col items-center justify-center pt-20 pb-12">
      <h2 class="title">Checkout</h2>
      <div class="p-9 w-full max-w-[800px]" v-if="sale">
        <div class="flex flex-col mx-0 mt-8">
          <table class="w-full divide-y divide-slate-500">
            <thead>
              <tr>
                <th
                  scope="col"
                  colspan="2"
                  class="py-3.5 pl-4 pr-3 text-left text-sm text-slate-700 sm:pl-6 md:pl-0 font-bold">
                  Description
                </th>
                <th
                  scope="col"
                  class="hidden py-3.5 px-3 text-right text-sm font-bold text-slate-700 sm:table-cell">
                  Quantity
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-3 pr-4 text-right text-sm font-bold text-slate-700 sm:pr-6 md:pr-0">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-200" v-for="item in sale.items">
                <td colspan="2" class="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                  <div class="text-slate-700">{{ item.name }}</div>
                  <div class="mt-0.5 text-slate-500 sm:hidden">
                    {{ item.quantity }} (unit)
                  </div>
                </td>
                <td
                  class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                  {{ item.quantity }}
                </td>
                <td
                  class="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                  {{ formatCurrency(item.price) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th
                  scope="row"
                  colspan="3"
                  class="hidden pt-6 pl-6 pr-3 text-sm text-right text-slate-500 sm:table-cell md:pl-0">
                  Subtotal
                </th>
                <th
                  scope="row"
                  class="pt-6 pl-4 pr-3 text-sm text-left text-slate-500 sm:hidden">
                  Subtotal
                </th>
                <td
                  class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                  {{ formatCurrency(sale.subtotal) }}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colspan="3"
                  class="hidden pt-6 pl-6 pr-3 text-sm text-right text-slate-500 sm:table-cell md:pl-0">
                  Discount
                </th>
                <th
                  scope="row"
                  class="pt-6 pl-4 pr-3 text-sm text-left text-slate-500 sm:hidden">
                  Discount
                </th>
                <td
                  class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                  {{ formatCurrency(sale.discount) }}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colspan="3"
                  class="hidden pt-4 pl-6 pr-3 text-sm text-right text-slate-500 sm:table-cell md:pl-0">
                  Tax
                </th>
                <th
                  scope="row"
                  class="pt-4 pl-4 pr-3 text-sm text-left text-slate-500 sm:hidden">
                  Tax
                </th>
                <td
                  class="pt-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                  {{ formatCurrency(sale.taxes) }}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colspan="3"
                  class="font-bold hidden pt-4 pl-6 pr-3 text-sm text-right text-slate-700 sm:table-cell md:pl-0">
                  Total
                </th>
                <th
                  scope="row"
                  class="font-bold pt-4 pl-4 pr-3 text-sm text-left text-slate-700 sm:hidden">
                  Total
                </th>
                <td
                  class="font-bold pt-4 pl-3 pr-4 text-sm text-right text-slate-700 sm:pr-6 md:pr-0">
                  {{ formatCurrency(sale.total) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="my-8">
          Thank you for your purchase! Your order number is
          <span class="uppercase font-bold">{{ saleId }}</span
          >.
        </p>
      </div>
      <h2 v-else class="text-xl font-bold text-center my-8">Sale not found</h2>

      <Link class="btn" to="home">Go Home</Link>
    </div>
  </ShopLayout>
</template>
