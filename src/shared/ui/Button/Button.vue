<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="to"
    :disabled="disabled"
    :class="[buttonClass, $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    type?: 'button' | 'submit';
    disabled?: boolean;
    to?: RouteLocationRaw;
    size?: 'sm' | 'md';
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    size: 'md',
  }
);

const tag = computed(() => (props.to ? 'router-link' : 'button'));

const baseClass =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-zinc-900 text-white hover:bg-black',
  secondary: 'border border-zinc-400 bg-transparent text-zinc-700 hover:bg-zinc-100',
  ghost: 'border border-zinc-300 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
};

const buttonClass = computed(() => [
  baseClass,
  variantClasses[props.variant],
  sizeClasses[props.size ?? 'md'],
]);
</script>
