<template>
  <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
    <div v-if="loading" class="py-12 text-center text-sm text-zinc-500">Loading...</div>
    <div
      v-else-if="error"
      class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>
    <div v-else-if="empty" class="py-12 text-center text-sm text-zinc-600">
      {{ emptyMessage }}
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  error: string;
  empty: boolean;
  emptyMessage: string;
}>();
</script>
