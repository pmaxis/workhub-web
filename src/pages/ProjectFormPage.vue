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
        {{ isEdit ? 'Редагування проєкту' : 'Новий проєкт' }}
      </h2>
      <p class="mt-1 text-sm text-zinc-600">Назва та опис для вашого проєкту.</p>

      <form class="mt-5 space-y-4" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>
        <div>
          <label for="name" class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Назва</label>
          <input
            id="name"
            v-model="name"
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
            rows="4"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="saving" @click="router.push(backTo)">
            Скасувати
          </Button>
          <Button type="submit" variant="primary" :disabled="saving || !!loadError">
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
import { projectsApi } from '@/features/projects';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => route.name === 'projectEdit');
const projectId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

const name = ref('');
const description = ref('');
const saving = ref(false);
const formError = ref('');
const loadError = ref('');

const backTo = computed(() => {
  if (isEdit.value && projectId.value) {
    return { name: 'projectDetail' as const, params: { id: projectId.value } };
  }
  return { name: 'projects' as const };
});

async function loadProject() {
  if (!isEdit.value || !projectId.value) {
    name.value = '';
    description.value = '';
    loadError.value = '';
    return;
  }
  loadError.value = '';
  try {
    const p = await projectsApi.get(projectId.value);
    name.value = p.name;
    description.value = p.description ?? '';
  } catch (e: unknown) {
    loadError.value = e instanceof Error ? e.message : 'Не вдалося завантажити проєкт';
  }
}

watch(
  () => [isEdit.value, projectId.value] as const,
  () => {
    void loadProject();
  },
  { immediate: true },
);

async function submit() {
  saving.value = true;
  formError.value = '';
  try {
    const payload = {
      name: name.value.trim(),
      description: description.value.trim() || undefined,
    };
    if (isEdit.value && projectId.value) {
      await projectsApi.update(projectId.value, {
        name: payload.name,
        description: payload.description ?? null,
      });
      await router.push({ name: 'projectDetail', params: { id: projectId.value } });
    } else {
      const created = await projectsApi.create(payload);
      await router.push({ name: 'projectDetail', params: { id: created.id } });
    }
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Не вдалося зберегти';
  } finally {
    saving.value = false;
  }
}
</script>
