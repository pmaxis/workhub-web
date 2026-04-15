<template>
  <div class="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-auto">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Deadlines</h1>
      <p class="mt-1 text-sm text-zinc-600">
        Open tasks with a due date, including overdue, within the next {{ horizonDays }} days.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3 text-sm">
      <label class="flex items-center gap-2 text-zinc-700">
        <span>Horizon (days)</span>
        <input
          v-model.number="horizonDays"
          type="number"
          min="1"
          max="365"
          class="w-20 rounded-lg border border-zinc-200 px-2 py-1"
        />
      </label>
      <button
        type="button"
        class="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
        @click="reload"
      >
        Refresh
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-zinc-600">Loading…</p>

    <div v-else-if="!tasks.length" class="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-600">
      No upcoming deadlines in this window. Add due dates on tasks to see them here.
    </div>

    <ul v-else class="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <li
        v-for="t in tasks"
        :key="t.id"
        class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
      >
        <div class="min-w-0">
          <router-link
            :to="{ name: 'taskEdit', params: { id: t.id } }"
            class="font-medium text-zinc-900 underline-offset-2 hover:underline"
          >
            {{ t.title }}
          </router-link>
          <p class="mt-0.5 text-xs text-zinc-500">
            Due {{ formatDue(t.dueAt) }}
            <span v-if="isOverdue(t.dueAt, t.status)" class="ml-2 font-medium text-amber-700">
              Overdue
            </span>
          </p>
        </div>
        <span class="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{{ t.status }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { planningApi, type PlanningDeadlineTask } from '@/features/planning';

const horizonDays = ref(14);
const loading = ref(true);
const error = ref('');
const tasks = ref<PlanningDeadlineTask[]>([]);

function formatDue(iso: string): string {
  return iso.slice(0, 10);
}

function isOverdue(iso: string, status: string): boolean {
  if (status === 'COMPLETED') return false;
  const end = new Date(`${iso.slice(0, 10)}T23:59:59.999Z`);
  return end.getTime() < Date.now();
}

async function reload(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const res = await planningApi.getDeadlines(horizonDays.value, 100);
    tasks.value = res.tasks;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Could not load deadlines';
    tasks.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  horizonDays,
  () => {
    void reload();
  },
  { immediate: true },
);
</script>
