import { computed, onMounted, ref, watch } from "vue";
import { defineStore } from "pinia";
// stores
import { cartStore } from "./cart";

export const couponStore = defineStore("coupon", () => {
  const couponCode = ref("");
  const validationMessage = ref("");
  const discountPercentage = ref(0);
  const discount = ref(0);

  const cart = cartStore();

  const VALID_COUPONS = [
    {
      code: "10OFF",
      discount: 0.1,
    },
    {
      code: "20OFF",
      discount: 0.2,
    },
  ];

  onMounted(() => {
    const coupon = window.localStorage.getItem("coupon");
    if (coupon) {
      discountPercentage.value = +coupon;
    }
  });

  watch(
    () => cart.totalBeforeDiscount,
    () => {
      discount.value = +(
        cart.totalBeforeDiscount * discountPercentage.value
      ).toFixed(2);
    }
  );

  const applyCoupon = () => {
    const coupon = VALID_COUPONS.find(
      coupon => coupon.code === couponCode.value
    );
    if (coupon) {
      validationMessage.value = "Applying coupon...";

      window.localStorage.setItem("coupon", coupon.discount.toString());

      setTimeout(() => {
        discountPercentage.value = coupon.discount;
        discount.value = +(
          cart.totalBeforeDiscount * discountPercentage.value
        ).toFixed(2);
      }, 4000);
    } else {
      validationMessage.value = "Invalid coupon";
    }

    setTimeout(() => {
      validationMessage.value = "";
    }, 4000);
  };

  const resetCoupon = () => {
    discountPercentage.value = 0;
    discount.value = 0;
    couponCode.value = "";
    window.localStorage.removeItem("coupon");
  };

  const isValidCoupon = computed(() => discountPercentage.value > 0);

  return {
    discount,
    couponCode,
    applyCoupon,
    resetCoupon,
    isValidCoupon,
    validationMessage,
    discountPercentage,
  };
});
