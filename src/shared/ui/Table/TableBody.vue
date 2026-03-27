<template>
  <tbody :class="bodyClass">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'plain';
  }>(),
  { variant: 'default' },
);

const bodyClass = computed(() =>
  props.variant === 'plain'
    ? 'divide-y divide-zinc-200'
    : 'divide-y divide-zinc-200 bg-white',
);
</script>
