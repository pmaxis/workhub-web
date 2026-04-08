<template>
  <div class="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-hidden">
    <div class="flex shrink-0 flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Time tracker</h1>
      </div>
    </div>

    <p
      v-if="loadError"
      class="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
    >
      {{ loadError }}
    </p>

    <section
      v-if="running"
      class="shrink-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="text-xs font-medium uppercase tracking-wide text-zinc-500">Running</p>
          <p class="mt-1 font-mono text-2xl font-semibold text-zinc-900 tabular-nums">{{ elapsedLabel }}</p>
          <p v-if="running.description" class="mt-2 text-sm text-zinc-800">
            {{ running.description }}
          </p>
          <p v-else class="mt-2 text-sm text-zinc-500">No description</p>
          <p class="mt-1 text-xs text-zinc-500">
            Started {{ formatDateTime(running.startedAt) }}
            <span v-if="runningProjectLabel"> · {{ runningProjectLabel }}</span>
            <span v-if="runningTaskLabel"> · {{ runningTaskLabel }}</span>
          </p>
        </div>
        <div class="shrink-0 self-start">
          <button
            type="button"
            class="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="actionLoading"
            @click="stopTimer"
          >
            Stop
          </button>
        </div>
      </div>
    </section>

    <section
      v-else
      class="shrink-0 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <h2 class="text-sm font-semibold text-zinc-900">Start timer</h2>
      <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div class="min-w-48 flex-1 basis-0">
          <FormField
            v-model="startProjectId"
            label="Project"
            as="select"
            id="time-tracker-project"
            select-placeholder="None"
            :options="projectSelectOptions"
          />
        </div>
        <div class="min-w-48 flex-1 basis-0">
          <FormField
            v-model="startTaskId"
            label="Task"
            as="select"
            id="time-tracker-task"
            select-placeholder="None"
            :disabled="!startProjectId"
            :options="taskSelectOptions"
          />
        </div>
        <div class="min-w-56 flex-2 basis-0">
          <FormField
            v-model="startDescription"
            label="Note (optional)"
            as="input"
            id="time-tracker-note"
            type="text"
            placeholder="What are you working on?"
          />
        </div>
        <button
          type="button"
          class="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          :disabled="actionLoading"
          @click="startTimer"
        >
          Start
        </button>
      </div>
    </section>

    <section class="flex min-h-0 min-w-0 flex-1 flex-col">
      <h2 class="mb-3 shrink-0 text-sm font-semibold text-zinc-900">Recent entries</h2>
      <div
        class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-gutter:stable] pr-1"
      >
        <div
          v-if="!entries.length && !listLoading"
          class="rounded-lg border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500"
        >
          No entries in the last 30 days.
        </div>
        <ul v-else class="flex flex-col gap-2 pb-1">
          <li
            v-for="e in displayEntries"
            :key="e.id"
            class="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm"
          >
            <div class="min-w-0 flex-1">
              <p class="font-medium text-zinc-900">{{ formatDuration(e) }}</p>
              <p class="mt-0.5 text-sm text-zinc-600">
                {{ formatDateTime(e.startedAt) }}
                <span v-if="e.endedAt"> — {{ formatDateTime(e.endedAt) }}</span>
                <span v-else class="text-zinc-600"> · running</span>
              </p>
              <p v-if="e.description" class="mt-1 text-sm text-zinc-700">{{ e.description }}</p>
              <p class="mt-1 text-xs text-zinc-500">
                <span v-if="projectLabel(e.projectId)">{{ projectLabel(e.projectId) }}</span>
                <span v-if="taskTitle(e.taskId)">
                  {{ projectLabel(e.projectId) ? ' · ' : '' }}{{ taskTitle(e.taskId) }}
                </span>
                <span v-if="!projectLabel(e.projectId) && !taskTitle(e.taskId)">No project</span>
              </p>
            </div>
            <div class="shrink-0 self-start">
              <Dropdown no-highlight :aria-label="`Time entry actions`">
                <button
                  v-if="!e.endedAt"
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="actionLoading"
                  @click="stopEntry(e)"
                >
                  Stop timer
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="actionLoading"
                  @click="promptDelete(e)"
                >
                  Delete
                </button>
              </Dropdown>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <ConfirmDeleteModal v-model="deleteTarget" :loading="deleteLoading" @confirm="confirmDelete">
      <template #message>
        <span v-if="deleteTarget">this time entry ({{ formatDuration(deleteTarget) }})</span>
      </template>
    </ConfirmDeleteModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Project } from '@/features/projects/api/projects.api';
import { projectsApi } from '@/features/projects/api/projects.api';
import type { Task } from '@/features/tasks/api/tasks.api';
import { tasksApi } from '@/features/tasks/api/tasks.api';
import type { TimeEntry } from '@/features/time-entries/api/timeEntries.api';
import { timeEntriesApi } from '@/features/time-entries/api/timeEntries.api';
import { ApiError } from '@/shared/api/client';
import { ConfirmDeleteModal, Dropdown, FormField } from '@/shared/ui';

const loadError = ref('');
const listLoading = ref(false);
const actionLoading = ref(false);
const deleteTarget = ref<TimeEntry | null>(null);
const deleteLoading = ref(false);

const running = ref<TimeEntry | null>(null);
const entries = ref<TimeEntry[]>([]);
const projects = ref<Project[]>([]);
const tasksByProject = ref<Record<string, Task[]>>({});

const startProjectId = ref('');
const startTaskId = ref('');
const startDescription = ref('');
const startTasks = computed(() => {
  const id = startProjectId.value;
  return id ? (tasksByProject.value[id] ?? []) : [];
});

const projectSelectOptions = computed(() =>
  projects.value.map((p) => ({ value: p.id, label: p.name })),
);

const taskSelectOptions = computed(() =>
  startTasks.value.map((t) => ({ value: t.id, label: t.title })),
);

const projectNameById = computed(() => {
  const m: Record<string, string> = {};
  for (const p of projects.value) m[p.id] = p.name;
  return m;
});

const taskTitleById = computed(() => {
  const m: Record<string, string> = {};
  for (const list of Object.values(tasksByProject.value)) {
    for (const t of list) m[t.id] = t.title;
  }
  return m;
});

function projectLabel(projectId: string | null): string {
  if (!projectId) return '';
  return projectNameById.value[projectId] ?? '';
}

function taskTitle(taskId: string | null): string {
  if (!taskId) return '';
  return taskTitleById.value[taskId] ?? '';
}

const runningProjectLabel = computed(() => projectLabel(running.value?.projectId ?? null));
const runningTaskLabel = computed(() => taskTitle(running.value?.taskId ?? null));

const displayEntries = computed(() => {
  const rid = running.value?.id;
  if (!rid) return entries.value;
  return entries.value.filter((e) => e.id !== rid);
});

const tick = ref(0);
let tickId: ReturnType<typeof setInterval> | null = null;

const elapsedLabel = computed(() => {
  tick.value;
  if (!running.value) return '0:00';
  const start = new Date(running.value.startedAt).getTime();
  const sec = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
});

function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatDuration(e: TimeEntry): string {
  const start = new Date(e.startedAt).getTime();
  const end = e.endedAt ? new Date(e.endedAt).getTime() : Date.now();
  const ms = Math.max(0, end - start);
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

async function loadProjects() {
  const res = await projectsApi.list({ page: 1, limit: 100 });
  projects.value = res.data ?? [];
}

async function ensureTasksForProject(projectId: string) {
  if (!projectId || tasksByProject.value[projectId]) return;
  const list = await tasksApi.list(projectId);
  tasksByProject.value = { ...tasksByProject.value, [projectId]: list };
}

watch(startProjectId, (id, prev) => {
  if (id !== prev) {
    startTaskId.value = '';
  }
  if (id) {
    void ensureTasksForProject(id);
  }
});

async function refreshRunning() {
  try {
    running.value = await timeEntriesApi.running();
    if (running.value?.projectId) {
      await ensureTasksForProject(running.value.projectId);
    }
  } catch (e) {
    if (e instanceof ApiError && e.isForbidden) {
      loadError.value = 'You do not have permission to use the time tracker.';
    } else {
      loadError.value = e instanceof Error ? e.message : 'Failed to load timer.';
    }
    running.value = null;
  }
}

async function refreshList() {
  listLoading.value = true;
  loadError.value = '';
  try {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    entries.value = await timeEntriesApi.list({ from: from.toISOString() });
    const projectIds = [
      ...new Set(
        entries.value.map((e) => e.projectId).filter((id): id is string => Boolean(id)),
      ),
    ];
    await Promise.all(projectIds.map((pid) => ensureTasksForProject(pid)));
  } catch (e) {
    if (e instanceof ApiError && e.isForbidden) {
      loadError.value = 'You do not have permission to view time entries.';
    } else {
      loadError.value = e instanceof Error ? e.message : 'Failed to load entries.';
    }
    entries.value = [];
  } finally {
    listLoading.value = false;
  }
}

async function startTimer() {
  actionLoading.value = true;
  loadError.value = '';
  try {
    const body: Parameters<typeof timeEntriesApi.create>[0] = {
      startedAt: new Date().toISOString(),
    };
    if (startProjectId.value) body.projectId = startProjectId.value;
    if (startTaskId.value) body.taskId = startTaskId.value;
    if (startDescription.value.trim()) body.description = startDescription.value.trim();

    await timeEntriesApi.create(body);
    startDescription.value = '';
    await refreshRunning();
    await refreshList();
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Could not start timer.';
  } finally {
    actionLoading.value = false;
  }
}

async function stopEntry(e: TimeEntry) {
  if (e.endedAt) return;
  actionLoading.value = true;
  loadError.value = '';
  try {
    await timeEntriesApi.update(e.id, { endedAt: new Date().toISOString() });
    if (running.value?.id === e.id) running.value = null;
    await refreshList();
    await refreshRunning();
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Could not stop timer.';
  } finally {
    actionLoading.value = false;
  }
}

async function stopTimer() {
  if (!running.value) return;
  await stopEntry(running.value);
}

function promptDelete(e: TimeEntry) {
  deleteTarget.value = e;
}

async function confirmDelete() {
  const target = deleteTarget.value;
  if (!target) return;
  deleteLoading.value = true;
  loadError.value = '';
  try {
    await timeEntriesApi.remove(target.id);
    deleteTarget.value = null;
    if (running.value?.id === target.id) running.value = null;
    await refreshList();
    await refreshRunning();
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Could not delete entry.';
  } finally {
    deleteLoading.value = false;
  }
}

onMounted(async () => {
  try {
    await loadProjects();
  } catch {
    /* projects optional for timer */
  }
  await refreshRunning();
  await refreshList();
  tickId = setInterval(() => {
    tick.value += 1;
  }, 1000);
});

onUnmounted(() => {
  if (tickId) clearInterval(tickId);
});
</script>
