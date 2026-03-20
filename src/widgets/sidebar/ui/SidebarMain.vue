<template>
  <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
    <SidebarNavList
      :nav-structure="navStructure"
      :open-flyout-id="openFlyoutId"
      :has-open-flyout="!!openFlyoutGroup"
      @toggle-group="toggleGroup"
    />
    <SidebarFlyout
      v-if="openFlyoutGroup"
      :group="openFlyoutGroup"
      @close="closeFlyout"
    />
  </div>
</template>

<script setup lang="ts">
import { useSidebarNav } from '../model/useSidebarNav';
import SidebarNavList from './SidebarNavList.vue';
import SidebarFlyout from './SidebarFlyout.vue';

const {
  navStructure,
  openFlyoutId,
  openFlyoutGroup,
  toggleGroup,
  closeFlyout,
} = useSidebarNav();
</script>
