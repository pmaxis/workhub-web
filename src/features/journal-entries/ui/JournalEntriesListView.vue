<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Journal</h1>
        <p class="mt-1 text-sm text-zinc-600">Reflect by day — filter by range or search text.</p>
      </div>
      <router-link
        :to="{ name: 'journalCreate' }"
        class="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
      >
        New entry
      </router-link>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div class="max-w-md flex-1">
        <label class="sr-only" for="jr-search">Search</label>
        <input
          id="jr-search"
          v-model="search"
          type="search"
          placeholder="Search title, mood, or body…"
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>
      <div class="flex flex-wrap gap-3">
        <div>
          <label class="mb-1 block text-xs font-medium text-zinc-600" for="jr-from">From</label>
          <input
            id="jr-from"
            v-model="fromDate"
            type="date"
            class="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-zinc-600" for="jr-to">To</label>
          <input
            id="jr-to"
            v-model="toDate"
            type="date"
            class="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>
      </div>
    </div>

    <JournalEntriesTable :entries="entries" :loading="loading" :error="error" @remove="promptDelete" />

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDelete">
      <template #message>this journal entry</template>
    </ConfirmDeleteModal>

    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between gap-2 text-sm text-zinc-600"
    >
      <span>Page {{ page }} of {{ totalPages }} ({{ total }} total)</span>
      <div class="flex gap-1">
        <button
          :disabled="page <= 1"
          class="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:not-disabled:bg-zinc-50"
          @click="setPage(page - 1)"
        >
          ←
        </button>
        <button
          v-for="p in visiblePages"
          :key="p"
          :class="[
            'rounded-md border px-3 py-1.5 text-sm font-medium',
            p === page
              ? 'border-zinc-900 bg-zinc-900 text-white'
              : 'border-zinc-200 hover:bg-zinc-50',
          ]"
          @click="setPage(p)"
        >
          {{ p }}
        </button>
        <button
          :disabled="page >= totalPages"
          class="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:not-disabled:bg-zinc-50"
          @click="setPage(page + 1)"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useJournalEntriesList } from '@/features/journal-entries/model/useJournalEntriesList';
import JournalEntriesTable from '@/features/journal-entries/ui/JournalEntriesTable.vue';
import { ConfirmDeleteModal } from '@/shared/ui';

const {
  entries,
  loading,
  error,
  search,
  fromDate,
  toDate,
  page,
  total,
  totalPages,
  setPage,
  deleteTarget,
  promptDelete,
  confirmDelete,
} = useJournalEntriesList();

const visiblePages = computed(() => {
  const delta = 2;
  const pages: number[] = [];
  for (
    let i = Math.max(1, page.value - delta);
    i <= Math.min(totalPages.value, page.value + delta);
    i++
  ) {
    pages.push(i);
  }
  return pages;
});
</script>
