<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="backTo"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Назад
      </router-link>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <h2 class="text-base font-medium text-zinc-900">
        {{ isEdit ? 'Редагування задачі' : 'Нова задача' }}
      </h2>

      <form class="mt-5 space-y-4" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>
        <div>
          <label for="projectId" class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Проєкт</label>
          <select
            id="projectId"
            v-model="selectedProjectId"
            required
            :disabled="isEdit"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none disabled:bg-zinc-100"
          >
            <option value="" disabled>Оберіть проєкт</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label for="title" class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Заголовок</label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label for="description" class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Опис</label>
          <textarea
            id="description"
            v-model="description"
            rows="3"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label for="status" class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Статус</label>
          <select
            id="status"
            v-model="status"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
          >
            <option value="PENDING">Очікує</option>
            <option value="IN_PROGRESS">В роботі</option>
            <option value="COMPLETED">Завершено</option>
          </select>
        </div>
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="saving" @click="router.push(backTo)">
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="saving || !!loadError || !projects.length"
          >
            {{ saving ? 'Збереження…' : 'Зберегти' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/shared/ui';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type TaskStatus } from '@/features/tasks';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => route.name === 'taskEdit');
const taskId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

const projects = ref<Project[]>([]);
const selectedProjectId = ref('');
const title = ref('');
const description = ref('');
const status = ref<TaskStatus>('PENDING');

const saving = ref(false);
const formError = ref('');
const loadError = ref('');

const backTo = computed(() => {
  if (selectedProjectId.value) {
    return { name: 'projectDetail' as const, params: { id: selectedProjectId.value } };
  }
  return { name: 'tasks' as const };
});

async function loadProjects(): Promise<void> {
  loadError.value = '';
  try {
    projects.value = await projectsApi.list();
  } catch {
    projects.value = [];
    loadError.value = 'Не вдалося завантажити проєкти';
  }
}

async function loadTask(): Promise<void> {
  if (!isEdit.value || !taskId.value) return;
  try {
    const t = await tasksApi.get(taskId.value);
    selectedProjectId.value = t.projectId;
    title.value = t.title;
    description.value = t.description ?? '';
    status.value = t.status;
  } catch (e: unknown) {
    loadError.value = e instanceof Error ? e.message : 'Не вдалося завантажити задачу';
  }
}

watch(
  () =>
    [String(route.name), String(route.params.id ?? ''), String(route.query.projectId ?? '')] as const,
  async () => {
    loadError.value = '';
    await loadProjects();
    if (isEdit.value && taskId.value) {
      await loadTask();
      return;
    }
    title.value = '';
    description.value = '';
    status.value = 'PENDING';
    const fromQuery = String(route.query.projectId || '');
    if (fromQuery && projects.value.some((p) => p.id === fromQuery)) {
      selectedProjectId.value = fromQuery;
    } else {
      selectedProjectId.value = '';
    }
  },
  { immediate: true },
);

async function submit() {
  saving.value = true;
  formError.value = '';
  try {
    if (isEdit.value && taskId.value) {
      await tasksApi.update(taskId.value, {
        title: title.value.trim(),
        description: description.value.trim() || null,
        status: status.value,
      });
      await router.push(backTo.value);
    } else {
      if (!selectedProjectId.value) {
        formError.value = 'Оберіть проєкт';
        return;
      }
      await tasksApi.create({
        title: title.value.trim(),
        description: description.value.trim() || undefined,
        status: status.value,
        projectId: selectedProjectId.value,
      });
      await router.push({ name: 'tasks' });
    }
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Не вдалося зберегти';
  } finally {
    saving.value = false;
  }
}
</script>
