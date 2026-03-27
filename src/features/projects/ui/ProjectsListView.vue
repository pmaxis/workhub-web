<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Проєкти</h1>
        <p class="mt-1 text-zinc-600">Ваші проєкти та кількість задач</p>
      </div>
      <router-link
        :to="{ name: 'projectCreate' }"
        class="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Новий проєкт
      </router-link>
    </div>

    <ProjectsTable
      :projects="projects"
      :loading="loading"
      :error="error"
      @remove="confirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { useProjectsList } from '@/features/projects/model/useProjectsList';
import ProjectsTable from '@/features/projects/ui/ProjectsTable.vue';

const { projects, loading, error, confirmRemove } = useProjectsList();
</script>
