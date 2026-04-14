<template>
  <TableCard
    :loading="loading"
    :error="error"
    :empty="entries.length === 0"
    empty-message="No journal entries yet. Log your first day."
  >
    <Table>
      <TableHead>
        <tr>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Mood</TableHeadCell>
          <TableHeadCell>Preview</TableHeadCell>
          <TableHeadCell align="right">Actions</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-for="e in entries" :key="e.id">
          <TableCell nowrap tone="muted">
            {{ formatEntryDate(e.entryDate) }}
          </TableCell>
          <TableCell>
            <span class="font-medium text-zinc-900">{{ e.title?.trim() || '—' }}</span>
          </TableCell>
          <TableCell>{{ e.mood || '—' }}</TableCell>
          <TableCell tone="muted" class="max-w-xs truncate">
            {{ preview(e.body) }}
          </TableCell>
          <TableCell align="right" nowrap tone="plain">
            <Dropdown>
              <router-link
                :to="{ name: 'journalEdit', params: { id: e.id } }"
                role="menuitem"
                class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </router-link>
              <button
                type="button"
                role="menuitem"
                class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                @click="emit('remove', e)"
              >
                Delete
              </button>
            </Dropdown>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableCard>
</template>

<script setup lang="ts">
import type { JournalEntry } from '@/features/journal-entries/api/journalEntries.api';
import { Dropdown, Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';

defineProps<{
  entries: JournalEntry[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  remove: [entry: JournalEntry];
}>();

function formatEntryDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function preview(text: string): string {
  const line = text.replace(/\s+/g, ' ').trim();
  if (!line) return '—';
  return line.length > 100 ? `${line.slice(0, 97)}…` : line;
}
</script>
