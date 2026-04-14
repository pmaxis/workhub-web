<template>
  <TableCard
    :loading="loading"
    :error="error"
    :empty="templates.length === 0"
    empty-message="No templates yet. Save reusable snippets here."
  >
    <Table>
      <TableHead>
        <tr>
          <TableHeadCell>Updated</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Preview</TableHeadCell>
          <TableHeadCell>Tags</TableHeadCell>
          <TableHeadCell align="right">Actions</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-for="t in templates" :key="t.id">
          <TableCell nowrap tone="muted">
            {{ formatDate(t.updatedAt) }}
          </TableCell>
          <TableCell>
            <span class="font-medium text-zinc-900">{{ t.title }}</span>
          </TableCell>
          <TableCell tone="muted" class="max-w-xs truncate">
            {{ preview(t.body) }}
          </TableCell>
          <TableCell>{{ t.tags || '—' }}</TableCell>
          <TableCell align="right" nowrap tone="plain">
            <Dropdown>
              <router-link
                :to="{ name: 'templateEdit', params: { id: t.id } }"
                role="menuitem"
                class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </router-link>
              <button
                type="button"
                role="menuitem"
                class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                @click="emit('remove', t)"
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
import type { BrainTemplate } from '@/features/brain-templates/api/brainTemplates.api';
import { Dropdown, Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';

defineProps<{
  templates: BrainTemplate[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  remove: [template: BrainTemplate];
}>();

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function preview(text: string): string {
  const line = text.replace(/\s+/g, ' ').trim();
  if (!line) return '—';
  return line.length > 120 ? `${line.slice(0, 117)}…` : line;
}
</script>
