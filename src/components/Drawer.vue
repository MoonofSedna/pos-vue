<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps<{
    id: string;
    isOpen: string;
    isAnimated: string;
    position: string;
    classes: string;
    headerClass?: string;
  }>();

  defineEmits(["close-drawer"]);

  const direction = computed(() => {
    if (props.isAnimated) {
      return `translate-x-0`;
    } else {
      return props.position === "right"
        ? `translate-x-[100%]`
        : `translate-x-[-100%]`;
    }
  });

  const show = computed(() => props.isOpen === props.id);

  const drawerPostion = computed(() => {
    if (props.position === "right") {
      return `right-0`;
    } else {
      return `left-0`;
    }
  });
</script>

<template>
  <div
    class="absolute z-50 w-full overflow-hidden"
    :class="[show ? 'show-drawer' : 'hide-drawer']">
    <div
      class="fixed inset-0 bg-gray-800 opacity-25 overflow-hidden z-[-1]"
      :class="[show ? 'block' : 'hidden']"
      @click="$emit('close-drawer')"></div>
    <div
      class="absolute flex flex-col w-5/6 max-w-sm py-6 bg-white border-r h-full transition-transform duration-200 ease-linear"
      :class="[direction, drawerPostion, classes]">
      <div class="flex items-center mb-2" :class="headerClass">
        <slot name="title" />
        <button @click="$emit('close-drawer')">
          <svg
            class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>
