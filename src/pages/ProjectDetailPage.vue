<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-3">
      <router-link
        :to="{ name: 'projects' }"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        До списку
      </router-link>
    </div>

    <div v-if="loading" class="py-12 text-center text-sm text-zinc-500">Завантаження...</div>
    <div
      v-else-if="error"
      class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>
    <template v-else-if="project">
      <div class="flex flex-wrap items-start justify-between gap-4">
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

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <h2 class="text-sm font-medium text-zinc-900">Задачі проєкту</h2>
        </div>
        <div v-if="tasksLoading" class="py-8 text-center text-sm text-zinc-500">Завантаження задач…</div>
        <div v-else-if="tasks.length === 0" class="py-8 text-center text-sm text-zinc-600">
          Немає задач у цьому проєкті.
        </div>
        <table v-else class="min-w-full divide-y divide-zinc-200">
          <thead class="bg-zinc-50">
            <tr>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
              >
                Заголовок
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
          <tbody class="divide-y divide-zinc-200">
            <tr v-for="t in tasks" :key="t.id" class="hover:bg-zinc-50">
              <td class="px-4 py-3 text-sm text-zinc-900">{{ t.title }}</td>
              <td class="px-4 py-3 text-sm text-zinc-600">{{ statusLabel(t.status) }}</td>
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
                    @click="confirmRemoveTask(t)"
                  >
                    Видалити
                  </button>
                </Dropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type Task, type TaskStatus } from '@/features/tasks';
import { Dropdown } from '@/shared/ui';

const route = useRoute();
const project = ref<Project | null>(null);
const tasks = ref<Task[]>([]);
const loading = ref(true);
const tasksLoading = ref(false);
const error = ref('');

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

async function loadAll() {
  const id = String(route.params.id || '');
  if (!id) return;
  loading.value = true;
  tasksLoading.value = true;
  error.value = '';
  try {
    project.value = await projectsApi.get(id);
    tasks.value = await tasksApi.list(id);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося завантажити';
    project.value = null;
    tasks.value = [];
  } finally {
    loading.value = false;
    tasksLoading.value = false;
  }
}

function confirmRemoveTask(t: Task) {
  if (!window.confirm(`Видалити задачу «${t.title}»?`)) return;
  const projectId = String(route.params.id || '');
  void (async () => {
    try {
      await tasksApi.remove(t.id);
      if (projectId) {
        tasks.value = await tasksApi.list(projectId);
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося видалити задачу';
    }
  })();
}

watch(
  () => route.params.id,
  () => {
    void loadAll();
  },
  { immediate: true },
);
</script>
