<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
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

    <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div v-if="loading" class="py-12 text-center text-sm text-zinc-500">Завантаження...</div>
      <div
        v-else-if="error"
        class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>
      <div v-else-if="tasks.length === 0" class="py-12 text-center text-sm text-zinc-600">
        Немає задач. Створіть першу.
      </div>
      <table v-else class="min-w-full divide-y divide-zinc-200">
        <thead class="bg-zinc-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Задача
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Проєкт
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Статус
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Дії
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 bg-white">
          <tr v-for="t in tasks" :key="t.id" class="hover:bg-zinc-50">
            <td class="px-4 py-3 text-sm text-zinc-900">
              {{ t.title }}
              <p v-if="t.description" class="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                {{ t.description }}
              </p>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
              {{ projectNameById.get(t.projectId) ?? '—' }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
              {{ statusLabel(t.status) }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right text-sm">
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type Task, type TaskStatus } from '@/features/tasks';
import { Dropdown } from '@/shared/ui';

const projects = ref<Project[]>([]);
const tasks = ref<Task[]>([]);
const loading = ref(false);
const error = ref('');

const projectNameById = computed(() => new Map(projects.value.map((p) => [p.id, p.name])));

function statusLabel(s: TaskStatus): string {
  switch (s) {
    case 'IN_PROGRESS':
      return 'В роботі';
    case 'COMPLETED':
      return 'Завершено';
    default:
      return 'Очікує';
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
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося завантажити задачі';
    tasks.value = [];
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
</script>
