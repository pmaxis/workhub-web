<template>
  <div
    :class="[
      'flex items-center justify-center rounded-full font-semibold border border-zinc-300 bg-zinc-200 text-zinc-700',
      sizeClass,
    ]"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    initials: string;
    size?: 'sm' | 'md';
  }>(),
  { size: 'sm' }
);

const sizeClass = computed(() =>
  props.size === 'md' ? 'h-11 w-11 text-sm' : 'h-9 w-9 text-xs'
);
</script>
