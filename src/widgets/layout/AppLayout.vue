<template>
  <div class="flex min-h-screen bg-zinc-50 text-zinc-900">
    <AppSidebar />
    <main class="min-w-0 min-h-screen flex-1 flex flex-col overflow-auto">
      <div class="flex min-h-full flex-1 flex-col p-4">
        <div class="min-h-full flex-1 rounded-xl bg-white p-4 shadow-md">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/widgets/sidebar/AppSidebar.vue';
</script>
