<template>
  <div class="flex min-h-screen bg-white text-zinc-900">
    <AppSidebar />
    <main class="min-w-0 flex-1 flex flex-col overflow-auto">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/widgets/sidebar/AppSidebar.vue';
</script>
