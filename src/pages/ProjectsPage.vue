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

    <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div v-if="loading" class="py-12 text-center text-sm text-zinc-500">Завантаження...</div>
      <div
        v-else-if="error"
        class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>
      <div v-else-if="projects.length === 0" class="py-12 text-center text-sm text-zinc-600">
        Ще немає проєктів. Створіть перший.
      </div>
      <table v-else class="min-w-full divide-y divide-zinc-200">
        <thead class="bg-zinc-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Назва
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Задачі
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
          <tr v-for="p in projects" :key="p.id" class="hover:bg-zinc-50">
            <td class="px-4 py-3 text-sm text-zinc-900">
              <router-link
                :to="{ name: 'projectDetail', params: { id: p.id } }"
                class="font-medium text-zinc-900 hover:underline"
              >
                {{ p.name }}
              </router-link>
              <p v-if="p.description" class="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                {{ p.description }}
              </p>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
              {{ p.tasksCount ?? '—' }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right text-sm">
              <Dropdown>
                <router-link
                  :to="{ name: 'projectEdit', params: { id: p.id } }"
                  role="menuitem"
                  class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                >
                  Редагувати
                </router-link>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  @click="confirmRemove(p)"
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
import { ref, onMounted } from 'vue';
import { projectsApi, type Project } from '@/features/projects';
import { Dropdown } from '@/shared/ui';

const projects = ref<Project[]>([]);
const loading = ref(false);
const error = ref('');

async function load() {
  loading.value = true;
  error.value = '';
  try {
    projects.value = await projectsApi.list();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося завантажити проєкти';
    projects.value = [];
  } finally {
    loading.value = false;
  }
}

function confirmRemove(p: Project) {
  if (!window.confirm(`Видалити проєкт «${p.name}» і всі його задачі?`)) return;
  void (async () => {
    try {
      await projectsApi.remove(p.id);
      await load();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося видалити';
    }
  })();
}

onMounted(() => {
  void load();
});
</script>
