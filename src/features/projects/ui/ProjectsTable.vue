<template>
  <TableCard
    :loading="loading"
    :error="error"
    :empty="projects.length === 0"
    empty-message="Ще немає проєктів. Створіть перший."
  >
    <Table>
      <TableHead>
        <tr>
          <TableHeadCell>Назва</TableHeadCell>
          <TableHeadCell>Задачі</TableHeadCell>
          <TableHeadCell align="right">Дії</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-for="p in projects" :key="p.id">
          <TableCell>
            <router-link
              :to="{ name: 'projectDetail', params: { id: p.id } }"
              class="font-medium text-zinc-900 hover:underline"
            >
              {{ p.name }}
            </router-link>
            <p v-if="p.description" class="mt-0.5 line-clamp-2 text-xs text-zinc-500">
              {{ p.description }}
            </p>
          </TableCell>
          <TableCell nowrap tone="muted">
            {{ p.tasksCount ?? '—' }}
          </TableCell>
          <TableCell align="right" nowrap tone="plain">
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
                @click="emit('remove', p)"
              >
                Видалити
              </button>
            </Dropdown>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableCard>
</template>

<script setup lang="ts">
import type { Project } from '@/features/projects';
import { Dropdown, Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';

defineProps<{
  projects: Project[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  remove: [project: Project];
}>();
</script>
