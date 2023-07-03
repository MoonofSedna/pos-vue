<script setup lang="ts">
  // store
  import { couponStore } from "@/stores/coupon";

  const coupon = couponStore();
</script>

<template>
  <div class="flex flex-col p-1">
    <label class="font-bold py-2"> Do you have a coupon code? </label>
    <p class="py-2 font-bold text-green-700" v-if="coupon.isValidCoupon">
      Coupon code applied!
    </p>
    <div class="space-x-2 flex" v-if="!coupon.isValidCoupon">
      <input
        class="rounded-md w-full max-w-md"
        type="text"
        placeholder="Enter Coupon Code"
        v-model="coupon.couponCode" />
      <button class="btn" @click="coupon.applyCoupon">Apply</button>
    </div>

    <p class="py-2 font-bold" v-if="coupon.validationMessage">
      {{ coupon.validationMessage }}
    </p>
  </div>
</template>
