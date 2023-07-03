<template>
  <div class="flex justify-between p-1 w-full">
    <dt class="font-bold">
      <slot name="label" />
    </dt>
    <dd class="text-gray-600">
      <slot />
    </dd>
  </div>
</template>
