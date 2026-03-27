import type { MaybeRefOrGetter } from 'vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref, toValue, watch } from 'vue';
import type { SortableEvent } from 'sortablejs';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type Task, type TaskStatus } from '@/features/tasks/api/tasks.api';

export const KANBAN_COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'PENDING', title: 'Очікує' },
  { status: 'IN_PROGRESS', title: 'В роботі' },
  { status: 'COMPLETED', title: 'Завершено' },
];

export const KANBAN_GROUP = { name: 'kanban', pull: true, put: true };

export function useTasksKanban(options?: { projectId?: MaybeRefOrGetter<string | undefined> }) {
  const scopedProjectId = options?.projectId;

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
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Не вдалося оновити статус';
      syncColumnsFromTasks();
    }
  }

  async function loadProjects() {
    const id = scopedProjectId !== undefined ? toValue(scopedProjectId) : undefined;
    if (id) {
      try {
        projects.value = [await projectsApi.get(id)];
      } catch {
        projects.value = [];
      }
      return;
    }
    try {
      projects.value = await projectsApi.list();
    } catch {
      projects.value = [];
    }
  }

  async function loadTasks() {
    loading.value = true;
    error.value = '';
    const id = scopedProjectId !== undefined ? toValue(scopedProjectId) : undefined;
    try {
      tasks.value = await tasksApi.list(id);
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

  if (scopedProjectId !== undefined) {
    watch(
      () => toValue(scopedProjectId),
      () => {
        void loadProjects();
        void loadTasks();
      },
    );
  }

  onBeforeUnmount(() => {
    document.body.classList.remove('kanban-dnd-active');
  });

  return {
    columns: KANBAN_COLUMNS,
    kanbanGroup: KANBAN_GROUP,
    columnLists,
    loading,
    error,
    tasks,
    projectNameById,
    onKanbanDragStart,
    onKanbanEnd,
    confirmRemove,
  };
}
