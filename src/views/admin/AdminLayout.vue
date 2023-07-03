<script setup lang="ts">
  import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <Navbar type="admin" />
  <main class="flex flex-col h-screen container mx-auto px-4 pt-28">
    <RouterView />
  </main>
</template>
