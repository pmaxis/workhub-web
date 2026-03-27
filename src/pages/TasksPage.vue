<template>
  <div class="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-hidden">
    <div class="flex shrink-0 flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Задачі</h1>
        <p class="mt-1 text-zinc-600">Усі задачі у ваших проєктах</p>
      </div>
      <router-link
        :to="{ name: 'taskCreate' }"
        class="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Нова задача
      </router-link>
    </div>

    <TasksKanbanBoard />
  </div>
</template>

<script setup lang="ts">
import TasksKanbanBoard from '@/features/tasks/ui/TasksKanbanBoard.vue';
</script>
