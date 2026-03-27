<template>
  <div
    class="absolute inset-0 z-10 m-2 flex flex-col rounded-lg border border-zinc-200 bg-white shadow-xl"
    role="dialog"
    :aria-label="group.label"
  >
    <div class="flex shrink-0 items-center border-b border-zinc-200 px-3 py-2.5">
      <button
        type="button"
        class="mr-2 cursor-pointer rounded p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        aria-label="Назад"
        @click="$emit('close')"
      >
        <span aria-hidden="true">←</span>
      </button>
      <h2 class="min-w-0 truncate text-sm font-medium text-zinc-800">
        {{ group.label }}
      </h2>
    </div>
    <nav class="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
      <NavItem
        v-for="child in group.children"
        :key="child.name"
        :to="child.to"
        :label="child.label"
        :is-active="isChildActive(child)"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { NavGroup } from '@/widgets/sidebar/model/useSidebarNav';
import NavItem from '@/widgets/sidebar/ui/NavItem.vue';

defineProps<{
  group: NavGroup;
}>();

defineEmits<{
  close: [];
}>();

const route = useRoute();

function isChildActive(child: { routeNames: string[] }): boolean {
  const name = route.name as string;
  return Boolean(name && child.routeNames.includes(name));
}
</script>
