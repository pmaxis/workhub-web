<template>
  <div class="flex h-screen min-h-0 overflow-hidden bg-zinc-50 text-zinc-900">
    <AppSidebar />
    <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div class="flex h-full min-h-0 flex-1 flex-col p-4">
        <div
          class="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white p-4 shadow-md"
        >
          <div class="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
            <router-view />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/widgets/sidebar/AppSidebar.vue';
</script>
