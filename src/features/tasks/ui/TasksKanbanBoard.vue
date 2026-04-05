<template>
  <div
    class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 p-4"
  >
    <div v-if="loading" class="flex flex-1 items-center justify-center py-12 text-sm text-zinc-500">
      Loading...
    </div>
    <div
      v-else-if="error"
      class="shrink-0 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>
    <div
      v-else-if="tasks.length === 0"
      class="flex flex-1 items-center justify-center py-12 text-sm text-zinc-600"
    >
      {{ emptyHint }}
    </div>
    <div
      v-else
      data-kanban-board
      class="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 md:grid-cols-3 md:grid-rows-1 md:items-stretch"
      :aria-label="boardAriaLabel"
    >
      <TasksKanbanColumn
        v-for="col in columns"
        :key="col.status"
        v-model="columnLists[col.status]"
        :column="col"
        :kanban-group="kanbanGroup"
        :project-name-by-id="projectNameById"
        :drag-start="onKanbanDragStart"
        :drag-end="onKanbanEnd"
        @remove-task="confirmRemove"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTasksKanban } from '@/features/tasks/model/useTasksKanban';
import TasksKanbanColumn from '@/features/tasks/ui/TasksKanbanColumn.vue';

const props = defineProps<{
  projectId?: string;
}>();

const emptyHint = computed(() =>
  props.projectId ? 'No tasks in this project.' : 'No tasks yet. Create the first one.',
);

const boardAriaLabel = computed(() =>
  props.projectId ? 'Project task board' : 'Task kanban board',
);

const {
  columns,
  kanbanGroup,
  columnLists,
  loading,
  error,
  tasks,
  projectNameById,
  onKanbanDragStart,
  onKanbanEnd,
  confirmRemove,
} = useTasksKanban({ projectId: () => props.projectId });
</script>

<style scoped>
:deep(.kanban-ghost),
:deep(.kanban-chosen),
:deep(.kanban-drag) {
  user-select: none !important;
  -webkit-user-select: none !important;
}

:deep(.kanban-ghost) {
  box-sizing: border-box !important;
  background-color: rgb(39 39 42) !important;
  background-image: none !important;
  border: none !important;
  border-radius: 0.5rem !important;
  box-shadow: none !important;
  outline: none !important;
}

:deep(.kanban-ghost) * {
  visibility: hidden !important;
  pointer-events: none !important;
}

:deep(.kanban-chosen) {
  background-color: rgb(255 255 255) !important;
}

:deep(.kanban-drag) {
  background-color: rgb(255 255 255) !important;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.12),
    0 2px 4px -2px rgb(0 0 0 / 0.08);
}
</style>

<style>
body.kanban-dnd-active [data-kanban-board],
body.kanban-dnd-active [data-kanban-board] * {
  user-select: none !important;
  -webkit-user-select: none !important;
}

body.kanban-dnd-active .kanban-column-scroll {
  touch-action: pan-y !important;
}
</style>
