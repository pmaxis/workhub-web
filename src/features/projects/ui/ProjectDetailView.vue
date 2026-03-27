<template>
  <div class="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-hidden">
    <div class="flex shrink-0 flex-wrap items-center gap-3">
      <router-link
        :to="{ name: 'projects' }"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <Icon name="chevron-left" />
        До списку
      </router-link>
    </div>

    <div
      v-if="loading"
      class="flex flex-1 items-center justify-center py-12 text-sm text-zinc-500"
    >
      Завантаження...
    </div>
    <div
      v-else-if="error"
      class="shrink-0 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>
    <template v-else-if="project">
      <div class="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-zinc-900">{{ project.name }}</h1>
          <p v-if="project.description" class="mt-2 text-zinc-600">{{ project.description }}</p>
        </div>
        <Dropdown>
          <router-link
            :to="{ name: 'projectEdit', params: { id: project.id } }"
            role="menuitem"
            class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Редагувати проєкт
          </router-link>
          <router-link
            :to="{ name: 'taskCreate', query: { projectId: project.id } }"
            role="menuitem"
            class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Нова задача
          </router-link>
        </Dropdown>
      </div>

      <TasksKanbanBoard :project-id="project.id" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useProjectDetail } from '@/features/projects/model/useProjectDetail';
import TasksKanbanBoard from '@/features/tasks/ui/TasksKanbanBoard.vue';
import { Dropdown, Icon } from '@/shared/ui';

const { project, loading, error } = useProjectDetail();
</script>
