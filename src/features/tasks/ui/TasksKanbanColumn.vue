<template>
  <section
    class="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100/80"
    :data-status="column.status"
    :aria-label="column.title"
  >
    <div class="flex shrink-0 items-center justify-between border-b border-zinc-200/80 px-3 py-2.5">
      <h2 class="text-sm font-medium text-zinc-900">{{ column.title }}</h2>
      <span
        class="rounded-full bg-white px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600 shadow-sm"
      >
        {{ list.length }}
      </span>
    </div>
    <div
      class="kanban-column-scroll relative min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-contain p-2 pt-2 [scrollbar-gutter:stable]"
    >
      <VueDraggable
        v-model="list"
        :group="kanbanGroup"
        direction="vertical"
        :animation="0"
        :empty-insert-threshold="80"
        :scroll-sensitivity="120"
        :bubble-scroll="true"
        :force-fallback="true"
        :fallback-on-body="true"
        filter="[data-no-drag]"
        :prevent-on-filter="false"
        ghost-class="kanban-ghost"
        drag-class="kanban-drag"
        chosen-class="kanban-chosen"
        class="box-border flex min-h-full w-full flex-col gap-2"
        @start="dragStart"
        @end="dragEnd"
      >
        <TaskKanbanCard
          v-for="t in list"
          :key="t.id"
          :task="t"
          :project-name="projectNameById.get(t.projectId) ?? '—'"
          @remove="forwardRemove"
        />
      </VueDraggable>
      <p
        v-if="list.length === 0"
        class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-zinc-400"
      >
        Drop a task here
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SortableEvent } from 'sortablejs';
import { VueDraggable } from 'vue-draggable-plus';
import type { Task, TaskStatus } from '@/features/tasks';
import TaskKanbanCard from '@/features/tasks/ui/TaskKanbanCard.vue';

const list = defineModel<Task[]>({ required: true });

defineProps<{
  column: { status: TaskStatus; title: string };
  kanbanGroup: { name: string; pull: boolean; put: boolean };
  projectNameById: Map<string, string>;
  dragStart: () => void;
  dragEnd: (evt: SortableEvent) => void;
}>();

const emit = defineEmits<{
  removeTask: [task: Task];
}>();

function forwardRemove(task: Task) {
  emit('removeTask', task);
}
</script>
