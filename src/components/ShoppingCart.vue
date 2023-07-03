<script setup lang="ts">
  // components
  import ShoppingCartItem from "./ShoppingCartItem.vue";
  import CouponForm from "./CouponForm.vue";
  import Amount from "./Amount.vue";
  // stores
  import { cartStore } from "@/stores/cart";
  import { couponStore } from "@/stores/coupon";
  // utils
  import { formatCurrency } from "@/utils";

  const cart = cartStore();
  const coupon = couponStore();
</script>

<template>
  <div
    v-if="cart.isEmpty"
    class="h-full flex flex-col justify-center items-center max-md:pr-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-20 w-20 mr-2 stroke-pink-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <h2 class="text-xl font-bold">Cart is empty</h2>
  </div>

  <div
    v-else
    class="flex flex-col w-full h-full overflow-y-auto items-start pb-16 lg:pr-8 pr-4 mt-7 pt-2 scrollbar-container">
    <ul class="w-full">
      <ShoppingCartItem
        v-for="item in cart.items"
        :key="item.id"
        :item="item" />
    </ul>
    <dl class="w-full text-sm font-medium text-gray-500">
      <Amount>
        <template #label>Subtotal</template>
        {{ formatCurrency(cart.subtotal) }}
      </Amount>
      <Amount>
        <template #label>Taxes</template>
        {{ formatCurrency(cart.taxes) }}
      </Amount>
      <Amount v-if="coupon.isValidCoupon">
        <template #label>Discount</template>
        -{{ formatCurrency(coupon.discount) }}
      </Amount>
      <Amount>
        <template #label>Total</template>
        {{ formatCurrency(cart.total) }}
      </Amount>
    </dl>
    <hr class="my-4 w-full" />
    <CouponForm />
    <button class="btn w-full mt-8" @click="cart.checkout">Checkout</button>
  </div>
</template>
