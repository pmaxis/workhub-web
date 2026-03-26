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

    <div
      class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 p-4"
    >
      <div v-if="loading" class="flex flex-1 items-center justify-center py-12 text-sm text-zinc-500">
        Завантаження...
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
        Немає задач. Створіть першу.
      </div>
      <div
        v-else
        data-kanban-board
        class="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 md:grid-cols-3 md:grid-rows-1 md:items-stretch"
        aria-label="Канбан-дошка задач"
      >
        <section
          v-for="col in columns"
          :key="col.status"
          class="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100/80"
          :data-status="col.status"
          :aria-label="col.title"
        >
          <div
            class="flex shrink-0 items-center justify-between border-b border-zinc-200/80 px-3 py-2.5"
          >
            <h2 class="text-sm font-medium text-zinc-900">{{ col.title }}</h2>
            <span
              class="rounded-full bg-white px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600 shadow-sm"
            >
              {{ columnLists[col.status].length }}
            </span>
          </div>
          <div
            class="kanban-column-scroll relative min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-contain p-2 pt-2 [scrollbar-gutter:stable]"
          >
            <VueDraggable
              v-model="columnLists[col.status]"
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
              @start="onKanbanDragStart"
              @end="onKanbanEnd"
            >
              <article
                v-for="t in columnLists[col.status]"
                :key="t.id"
                :data-task-id="t.id"
                class="group relative rounded-lg border border-zinc-200 bg-white p-0 shadow-sm hover:border-zinc-300 hover:shadow"
                role="listitem"
              >
                <div class="flex gap-2 p-3">
                  <div class="min-w-0 flex-1">
                    <router-link
                      :to="{ name: 'taskEdit', params: { id: t.id } }"
                      class="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
                    >
                      {{ t.title }}
                    </router-link>
                    <p v-if="t.description" class="mt-1 line-clamp-2 text-xs text-zinc-500">
                      {{ t.description }}
                    </p>
                    <p class="mt-2 text-xs text-zinc-500">
                      <span class="text-zinc-400">Проєкт:</span>
                      {{ projectNameById.get(t.projectId) ?? '—' }}
                    </p>
                  </div>
                  <div class="shrink-0 self-start" data-no-drag>
                    <Dropdown>
                      <router-link
                        :to="{ name: 'taskEdit', params: { id: t.id } }"
                        role="menuitem"
                        class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                      >
                        Редагувати
                      </router-link>
                      <button
                        type="button"
                        role="menuitem"
                        class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        @click="confirmRemove(t)"
                      >
                        Видалити
                      </button>
                    </Dropdown>
                  </div>
                </div>
              </article>
            </VueDraggable>
            <p
              v-if="columnLists[col.status].length === 0"
              class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-zinc-400"
            >
              Перетягніть сюди задачу
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import type { SortableEvent } from 'sortablejs';
import { VueDraggable } from 'vue-draggable-plus';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type Task, type TaskStatus } from '@/features/tasks';
import { Dropdown } from '@/shared/ui';

const columns: { status: TaskStatus; title: string }[] = [
  { status: 'PENDING', title: 'Очікує' },
  { status: 'IN_PROGRESS', title: 'В роботі' },
  { status: 'COMPLETED', title: 'Завершено' },
];

const kanbanGroup = { name: 'kanban', pull: true, put: true };

const projects = ref<Project[]>([]);
const tasks = ref<Task[]>([]);
const loading = ref(false);
const error = ref('');

const columnLists = reactive<Record<TaskStatus, Task[]>>({
  PENDING: [],
  IN_PROGRESS: [],
  COMPLETED: [],
});

const projectNameById = computed(() => new Map(projects.value.map((p) => [p.id, p.name])));

function sortTasksInColumn(list: Task[]): Task[] {
  return [...list].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function syncColumnsFromTasks() {
  for (const s of Object.keys(columnLists) as TaskStatus[]) {
    columnLists[s] = sortTasksInColumn(tasks.value.filter((t) => t.status === s));
  }
}

function onKanbanDragStart() {
  document.body.classList.add('kanban-dnd-active');
}

function onKanbanDragEndCleanup() {
  document.body.classList.remove('kanban-dnd-active');
}

async function onKanbanEnd(evt: SortableEvent) {
  onKanbanDragEndCleanup();

  const taskId = (evt.item as HTMLElement).dataset.taskId;
  if (!taskId) return;

  const toEl = evt.to as HTMLElement;
  const newStatus = toEl.closest('[data-status]')?.getAttribute('data-status') as TaskStatus | undefined;
  if (!newStatus) return;

  const task = tasks.value.find((t) => t.id === taskId);
  if (!task || task.status === newStatus) return;

  error.value = '';
  try {
    const updated = await tasksApi.update(taskId, { status: newStatus });
    const idx = tasks.value.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      tasks.value[idx] = updated;
    }
    // Не викликаємо syncColumnsFromTasks: він сортує за updatedAt і збиває порядок,
    // який уже виставив Sortable у columnLists — через це картка «стрибала» нагору.
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Не вдалося оновити статус';
    syncColumnsFromTasks();
  }
}

async function loadProjects() {
  try {
    projects.value = await projectsApi.list();
  } catch {
    projects.value = [];
  }
}

async function loadTasks() {
  loading.value = true;
  error.value = '';
  try {
    tasks.value = await tasksApi.list();
    syncColumnsFromTasks();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося завантажити задачі';
    tasks.value = [];
    syncColumnsFromTasks();
  } finally {
    loading.value = false;
  }
}

function confirmRemove(t: Task) {
  if (!window.confirm(`Видалити задачу «${t.title}»?`)) return;
  void (async () => {
    try {
      await tasksApi.remove(t.id);
      await loadTasks();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося видалити';
    }
  })();
}

onMounted(() => {
  void loadProjects();
  void loadTasks();
});

onBeforeUnmount(() => {
  document.body.classList.remove('kanban-dnd-active');
});
</script>

<style scoped>
/* Плейсхолдер у списку: темна зона під картку під час перенесення (без рамки) */
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
/* Виділення тексту лише всередині дошки; без глобального body * (краще для скролу) */
body.kanban-dnd-active [data-kanban-board],
body.kanban-dnd-active [data-kanban-board] * {
  user-select: none !important;
  -webkit-user-select: none !important;
}

/* Вертикальний скрол колонки під час drag */
body.kanban-dnd-active .kanban-column-scroll {
  touch-action: pan-y !important;
}
</style>
