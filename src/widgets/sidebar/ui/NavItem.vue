<template>
  <Link
    v-if="to"
    :to="to"
    :class="[baseClass, isActive ? activeNavClass : inactiveNavClass]"
    v-bind="$attrs"
  >
    <span class="min-w-0 truncate">{{ label }}</span>
  </Link>
  <button
    v-else
    type="button"
    :aria-expanded="isOpen"
    :aria-haspopup="true"
    :class="[baseClass, isActive ? activeNavClass : inactiveNavClass]"
    v-bind="$attrs"
  >
    <span class="min-w-0 truncate">{{ label }}</span>
    <span class="ml-2 shrink-0 text-base leading-none text-zinc-500" aria-hidden="true">›</span>
  </button>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import { Link } from '@/shared/ui';

defineProps<{
  label: string;
  to?: RouteLocationRaw;
  isActive: boolean;
  isGroup?: boolean;
  isOpen?: boolean;
}>();

const baseClass =
  'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 focus:outline-none';

const activeNavClass =
  'border border-black bg-black text-white shadow-sm';

const inactiveNavClass =
  'border border-transparent text-zinc-600 hover:border-black hover:bg-black hover:text-white';
</script>
