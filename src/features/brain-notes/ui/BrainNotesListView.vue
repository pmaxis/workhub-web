<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Notes</h1>
        <p class="mt-1 text-sm text-zinc-600">Second Brain — quick capture and search.</p>
      </div>
      <router-link
        :to="{ name: 'noteCreate' }"
        class="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
      >
        New note
      </router-link>
    </div>

    <div class="max-w-md">
      <label class="sr-only" for="brain-search">Search notes</label>
      <input
        id="brain-search"
        v-model="search"
        type="search"
        placeholder="Search title or content…"
        class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
    </div>

    <BrainNotesTable :notes="notes" :loading="loading" :error="error" @remove="promptDelete" />

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDelete">
      <template #message>note “{{ deleteTarget?.title }}”</template>
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
import { useBrainNotesList } from '@/features/brain-notes/model/useBrainNotesList';
import BrainNotesTable from '@/features/brain-notes/ui/BrainNotesTable.vue';
import { ConfirmDeleteModal } from '@/shared/ui';

const {
  notes,
  loading,
  error,
  search,
  page,
  total,
  totalPages,
  setPage,
  deleteTarget,
  promptDelete,
  confirmDelete,
} = useBrainNotesList();

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
