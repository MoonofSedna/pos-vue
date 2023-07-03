import { computed, ref, onMounted, watch } from "vue";
import { useFirestore } from "vuefire";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
// interfaces
import type {
  CartInterface,
  ProductInterface,
} from "@/interfaces/product.interface";
// stores
import { couponStore } from "./coupon";
// utils
import { getCurrentDate } from "@/utils";

export const cartStore = defineStore("car", () => {
  const items = ref<CartInterface[]>([]);
  const showCart = ref(false);
  const cartAnimation = ref(false);
  const subtotal = ref(0);
  const taxes = ref(0);
  const totalAfterDiscount = ref(0);
  const totalBeforeDiscount = ref(0);

  const MAX_ITEMS = 5;
  const TAX_RATE = 0.07;
  const router = useRouter();

  const coupon = couponStore();

  const hideCartModal = () => {
    showCart.value = false;
    setTimeout(() => {
      cartAnimation.value = false;
    }, 200);
  };

  const toggleCart = () => {
    if (showCart.value) {
      cartAnimation.value = false;

      setTimeout(() => {
        showCart.value = false;
      }, 300);
    } else {
      showCart.value = true;
      setTimeout(() => {
        cartAnimation.value = true;
      }, 300);
    }
  };

  const isItemInCart = (productId: string) => {
    return items.value.findIndex(item => item.id === productId);
  };

  const isProductAvailable = (product: ProductInterface, index: number) => {
    return (
      items.value[index].quantity >= product.availability ||
      items.value[index].quantity >= MAX_ITEMS
    );
  };

  const addItem = (product: ProductInterface) => {
    const index = isItemInCart(product.id);

    if (index >= 0) {
      if (isProductAvailable(product, index)) return;
      items.value[index].quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    items.value = items.value.map(item => {
      if (item.id === productId) {
        item.quantity = quantity;
      }
      return item;
    });
  };

  const deleteItem = (productId: string) => {
    items.value = items.value.filter(item => item.id !== productId);
  };

  const isEmpty = computed(() => {
    return items.value.length === 0;
  });

  const checkAvailability = computed(() => (product: ProductInterface) => {
    return product.availability < MAX_ITEMS ? product.availability : MAX_ITEMS;
  });

  const resetCart = () => {
    items.value = [];
    subtotal.value = 0;
    taxes.value = 0;
    totalAfterDiscount.value = 0;
    totalBeforeDiscount.value = 0;
  };

  const checkout = async () => {
    const itemsRef = items.value.map(item => {
      const { availability, category, ...data } = item;
      return data;
    });
    try {
      const db = useFirestore();
      const docRef = await addDoc(collection(db, "sales"), {
        items: itemsRef,
        total: total.value,
        subtotal: subtotal.value,
        taxes: taxes.value,
        discount: coupon.discount,
        date: getCurrentDate(),
      });

      await items.value.forEach(async item => {
        const productRef = doc(db, "products", item.id);
        await runTransaction(db, async transaction => {
          const product = (await transaction.get(productRef)).data();
          if (!product) return;
          const newAvailability = product.availability - item.quantity;
          transaction.update(productRef, { availability: newAvailability });
        });
      });

      router.push(`/checkout/${docRef.id}`);

      resetCart();
      coupon.resetCoupon();
    } catch (error) {
      console.log(error);
    }
  };

  onMounted(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      items.value = JSON.parse(cart);
    }
  });

  watch(
    items,
    () => {
      localStorage.setItem("cart", JSON.stringify(items.value));
      subtotal.value = items.value.reduce((acc, item) => {
        return acc + item.price * (item.quantity || 1);
      }, 0);
      taxes.value = +(subtotal.value * TAX_RATE).toFixed(2);
      totalBeforeDiscount.value = subtotal.value + taxes.value;
    },
    {
      deep: true,
    }
  );

  watch(
    () => coupon.discount,
    () => {
      totalAfterDiscount.value = totalBeforeDiscount.value - coupon.discount;
    }
  );

  const total = computed(() => {
    return totalAfterDiscount.value > 0
      ? +totalAfterDiscount.value.toFixed(2)
      : +totalBeforeDiscount.value.toFixed(2);
  });

  return {
    items,
    totalBeforeDiscount,
    total,
    subtotal,
    taxes,
    checkout,
    showCart,
    hideCartModal,
    toggleCart,
    addItem,
    isEmpty,
    checkAvailability,
    updateQuantity,
    deleteItem,
    cartAnimation,
  };
});
