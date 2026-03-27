<template>
  <th scope="col" :class="cellClass">
    <slot />
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    align?: 'left' | 'right' | 'center';
  }>(),
  { align: 'left' },
);

const alignClass = computed(() => {
  switch (props.align) {
    case 'right':
      return 'text-right';
    case 'center':
      return 'text-center';
    default:
      return 'text-left';
  }
});

const cellClass = computed(() => [
  'px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-600',
  alignClass.value,
]);
</script>
