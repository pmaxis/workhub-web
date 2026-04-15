<template>
  <div class="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-auto">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Reminders</h1>
      <p class="mt-1 text-sm text-zinc-600">Personal reminders. Optionally link a task you can access.</p>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
      <h2 class="text-sm font-medium text-zinc-900">New reminder</h2>
      <form class="mt-4 grid gap-3 sm:grid-cols-2" @submit.prevent="createReminder">
        <label class="block text-sm text-zinc-700 sm:col-span-2">
          Title
          <input
            v-model="formTitle"
            type="text"
            required
            maxlength="500"
            class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
          />
        </label>
        <label class="block text-sm text-zinc-700 sm:col-span-2">
          Notes (optional)
          <textarea
            v-model="formNotes"
            rows="2"
            maxlength="10000"
            class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
          />
        </label>
        <label class="block text-sm text-zinc-700">
          When
          <input
            v-model="formRemindLocal"
            type="datetime-local"
            required
            class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
          />
        </label>
        <label class="block text-sm text-zinc-700">
          Task (optional)
          <select
            v-model="formTaskId"
            class="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900"
          >
            <option value="">— None —</option>
            <option v-for="t in taskOptions" :key="t.id" :value="t.id">{{ t.title }}</option>
          </select>
        </label>
        <div class="flex items-end gap-2 sm:col-span-2">
          <button
            type="submit"
            class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            :disabled="saving"
          >
            {{ saving ? 'Saving…' : 'Add reminder' }}
          </button>
          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        </div>
      </form>
    </div>

    <div class="flex flex-wrap items-center gap-3 text-sm">
      <label class="flex items-center gap-2 text-zinc-700">
        <input v-model="includeDismissed" type="checkbox" @change="reload" />
        Show dismissed
      </label>
      <button
        type="button"
        class="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50"
        @click="reload"
      >
        Refresh
      </button>
    </div>

    <p v-if="listError" class="text-sm text-red-600">{{ listError }}</p>
    <p v-else-if="loading" class="text-sm text-zinc-600">Loading…</p>

    <ul v-else class="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <li
        v-for="r in rows"
        :key="r.id"
        class="flex flex-wrap items-start justify-between gap-3 px-4 py-3 text-sm"
      >
        <div class="min-w-0">
          <p class="font-medium text-zinc-900">{{ r.title }}</p>
          <p v-if="r.notes" class="mt-1 whitespace-pre-wrap text-xs text-zinc-600">{{ r.notes }}</p>
          <p class="mt-1 text-xs text-zinc-500">
            {{ formatWhen(r.remindAt) }}
            <span v-if="r.dismissedAt" class="ml-2 text-zinc-400">Dismissed</span>
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap gap-2">
          <button
            v-if="!r.dismissedAt"
            type="button"
            class="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
            @click="dismiss(r.id)"
          >
            Dismiss
          </button>
          <button
            v-else
            type="button"
            class="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
            @click="restore(r.id)"
          >
            Restore
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
            @click="removeRow(r.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { remindersApi, type Reminder } from '@/features/reminders';
import { tasksApi, type Task } from '@/features/tasks';

const loading = ref(true);
const listError = ref('');
const rows = ref<Reminder[]>([]);
const includeDismissed = ref(false);

const taskOptions = ref<Task[]>([]);
const formTitle = ref('');
const formNotes = ref('');
const formRemindLocal = ref('');
const formTaskId = ref('');
const saving = ref(false);
const formError = ref('');

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

async function reload(): Promise<void> {
  loading.value = true;
  listError.value = '';
  try {
    const res = await remindersApi.list({
      page: 1,
      limit: 50,
      includeDismissed: includeDismissed.value,
    });
    rows.value = res.data;
  } catch (e: unknown) {
    listError.value = e instanceof Error ? e.message : 'Could not load reminders';
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadTasks(): Promise<void> {
  try {
    taskOptions.value = await tasksApi.list();
  } catch {
    taskOptions.value = [];
  }
}

async function createReminder(): Promise<void> {
  saving.value = true;
  formError.value = '';
  try {
    const remindAt = new Date(formRemindLocal.value).toISOString();
    await remindersApi.create({
      title: formTitle.value.trim(),
      notes: formNotes.value.trim() || undefined,
      remindAt,
      taskId: formTaskId.value || undefined,
    });
    formTitle.value = '';
    formNotes.value = '';
    formTaskId.value = '';
    await reload();
  } catch (e: unknown) {
    formError.value = e instanceof Error ? e.message : 'Could not create';
  } finally {
    saving.value = false;
  }
}

async function dismiss(id: string): Promise<void> {
  try {
    await remindersApi.update(id, { dismissedAt: new Date().toISOString() });
    await reload();
  } catch {
    /* toast optional */
  }
}

async function restore(id: string): Promise<void> {
  try {
    await remindersApi.update(id, { dismissedAt: null });
    await reload();
  } catch {
    /* */
  }
}

async function removeRow(id: string): Promise<void> {
  if (!window.confirm('Delete this reminder?')) return;
  try {
    await remindersApi.remove(id);
    await reload();
  } catch {
    /* */
  }
}

void loadTasks();
void reload();
</script>
