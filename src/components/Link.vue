<script setup lang="ts">
  import { RouterLink } from "vue-router";

  defineProps<{
    to: string;
    className?: string;
  }>();
</script>

<template>
  <RouterLink
    :class="className"
    :to="{
      name: to,
    }">
    <slot></slot>
  </RouterLink>
</template>
