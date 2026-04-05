<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-zinc-600">{{ description }}</p>
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
const description = computed(
  () => route.meta.pageDescription as string | undefined,
);
</script>
