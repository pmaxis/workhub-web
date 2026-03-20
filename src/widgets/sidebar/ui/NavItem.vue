<template>
  <Link
    :to="to"
    :class="[baseClass, isActive ? activeNavClass : inactiveNavClass]"
    v-bind="$attrs"
  >
    <span class="min-w-0 truncate">{{ label }}</span>
  </Link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { Link } from '@/shared/ui';

defineProps<{
  label: string;
  to: RouteLocationRaw;
  isActive: boolean;
}>();

const baseClass =
  'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none';

const activeNavClass =
  'border border-zinc-400 bg-zinc-100 text-zinc-900 shadow-sm';

const inactiveNavClass =
  'border border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900';
</script>
