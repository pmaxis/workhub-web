<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">{{ title }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const title = computed(
  () => (route.meta.pageTitle as string) ?? route.name?.toString() ?? 'Page',
);
</script>
