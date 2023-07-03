<script setup lang="ts">
  import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <Navbar type="shop" />
  <main class="flex flex-col h-screen pt-20">
    <slot />
  </main>
</template>
