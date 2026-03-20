<template>
  <div
    :class="[
      'relative flex items-center justify-center rounded-full border-2 border-black font-semibold',
      sizeClass,
    ]"
  >
    <div
      class="absolute inset-0 flex items-center justify-center rounded-full border-2 border-white bg-black text-white"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    initials: string;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'sm' }
);

const sizeClass = computed(() => {
  if (props.size === 'lg') return 'h-12 w-12 text-base';
  if (props.size === 'md') return 'h-11 w-11 text-sm';
  return 'h-9 w-9 text-xs';
});
</script>
