<script setup lang="ts">
  import { computed } from "vue";
  // components
  import Link from "./Link.vue";
  import Drawer from "./Drawer.vue";
  import ShoppingCart from "./ShoppingCart.vue";
  import Logo from "@/assets/pos-logo.svg";
  // composables
  import useToggle from "@/composables/useToggle";
  // stores
  import { useAuthStore } from "@/stores/auth";
  import { cartStore } from "@/stores/cart";
  // utils
  import { shopLinks, adminLinks } from "@/utils";

  const props = defineProps<{
    type: string;
  }>();

  const auth = useAuthStore();
  const cart = cartStore();

  const { isOpen, onOpen, onClose, isAnimated } = useToggle();

  const userView = computed(() => {
    return props.type === "shop"
      ? {
          name: "Admin Panel",
          to: "products",
        }
      : {
          name: "Go to Shop",
          to: "home",
        };
  });

  const links = computed(() => {
    return !auth.isAuth
      ? shopLinks
      : props.type === "admin"
      ? adminLinks
      : shopLinks;
  });
</script>
<template>
  <nav
    class="flex fixed top-0 z-50 justify-between bg-white text-gray-500 w-screen shadow-md">
    <div class="px-5 xl:px-12 py-6 flex w-full items-center justify-between">
      <a href="#">
        <img :src="Logo" alt="logo" class="h-10 w-20" />
      </a>
      <div class="flex items-center space-x-10">
        <ul class="hidden md:flex px-4 font-semibold font-heading space-x-12">
          <li v-for="link in links">
            <Link class="hover:text-pink-400 text-xl font-bold" :to="link.to">
              {{ link.name }}
            </Link>
          </li>
        </ul>
        <span class="lg:hidden flex mr-6 items-center" @click="onOpen('cart')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 hover:text-pink-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="flex absolute -mt-5 ml-4">
            <span
              class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-pink-400 opacity-75"></span>
            <span
              class="relative rounded-full h-4 w-4 bg-pink-500 flex justify-center items-center">
              <span class="text-white text-sm"> {{ cart.items.length }}</span>
            </span>
          </span>
        </span>

        <div class="hidden md:flex space-x-3 items-center">
          <Link class="btn" v-if="auth.isAuth" :to="userView.to">{{
            userView.name
          }}</Link>

          <button v-if="auth.isAuth" class="btn" @click="auth.logout">
            Logout
          </button>
          <Link v-else class="btn" to="login"> Login as Admin </Link>
        </div>
      </div>
    </div>

    <!-- Responsive navbar -->

    <a
      class="self-center mr-6 md:hidden"
      href="#"
      @click="onOpen('mb-navbar')"
      aria-label="navbar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 hover:text-pink-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </a>
  </nav>

  <Drawer
    id="mb-navbar"
    classes="px-6"
    position="left"
    :isOpen="isOpen"
    :isAnimated="isAnimated"
    @close-drawer="onClose">
    <template #title>
      <a href="#" class="w-full">
        <img :src="Logo" alt="logo" class="h-10 w-20" />
      </a>
    </template>
    <template #default>
      <div class="mt-8">
        <ul class="md:flex font-heading space-y-6 mt-4">
          <li v-for="link in links">
            <Link
              @click="onClose"
              class="hover:text-pink-400 text-lg font-semibold block"
              :to="link.to">
              {{ link.name }}
            </Link>
            <hr class="my-2" />
          </li>
        </ul>
        <Link class="btn block mt-6" v-if="auth.isAuth" :to="userView.to">{{
          userView.name
        }}</Link>
      </div>
      <div class="mt-auto">
        <div class="pt-6">
          <button v-if="auth.isAuth" class="btn w-full" @click="auth.logout">
            Logout
          </button>
          <Link v-else class="btn w-full block" to="login">
            Login as Admin
          </Link>
        </div>
      </div>
    </template>
  </Drawer>
  <Drawer
    id="cart"
    classes="pl-6"
    header-class="pr-6"
    position="right"
    :isOpen="isOpen"
    :isAnimated="isAnimated"
    @close-drawer="onClose">
    <template #title>
      <h2 class="title mr-auto">Cart</h2>
    </template>
    <div class="h-full w-full flex flex-col">
      <ShoppingCart />
    </div>
  </Drawer>
</template>
