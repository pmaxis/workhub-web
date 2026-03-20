<template>
  <nav class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
    <NavItem
      v-for="item in navItems"
      :key="item.name"
      :to="item.to"
      :label="item.label"
      :is-active="isActive(item)"
    />
  </nav>
</template>

<script setup lang="ts">
import type { NavLink } from '../model/useSidebarNav';
import NavItem from './NavItem.vue';

defineProps<{
  navItems: NavLink[];
  isActive: (item: NavLink) => boolean;
}>();
</script>
