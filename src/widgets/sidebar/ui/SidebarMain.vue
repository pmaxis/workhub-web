<template>
  <div class="relative min-h-0 flex-1 flex flex-col overflow-hidden">
    <SidebarNavList
      :nav-items="navItems"
      :is-active="isActive"
    />
  </div>
</template>

<script setup lang="ts">
import { useSidebarNav } from '../model/useSidebarNav';
import SidebarNavList from './SidebarNavList.vue';

const { navItems, isActive } = useSidebarNav();
</script>
