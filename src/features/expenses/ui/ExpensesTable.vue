<template>
  <TableCard
    :loading="loading"
    :error="error"
    :empty="expenses.length === 0"
    empty-message="No expenses yet. Add your first one."
  >
    <Table>
      <TableHead>
        <tr>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>Description</TableHeadCell>
          <TableHeadCell>Category</TableHeadCell>
          <TableHeadCell align="right">Amount</TableHeadCell>
          <TableHeadCell align="right">Actions</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-for="ex in expenses" :key="ex.id">
          <TableCell nowrap tone="muted">
            {{ formatDate(ex.spentAt) }}
          </TableCell>
          <TableCell>
            <span class="font-medium text-zinc-900">{{ ex.description }}</span>
          </TableCell>
          <TableCell>{{ ex.category || '—' }}</TableCell>
          <TableCell align="right" nowrap>
            {{ ex.amount }} {{ ex.currency }}
          </TableCell>
          <TableCell align="right" nowrap tone="plain">
            <Dropdown>
              <router-link
                :to="{ name: 'expenseEdit', params: { id: ex.id } }"
                role="menuitem"
                class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </router-link>
              <button
                type="button"
                role="menuitem"
                class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                @click="emit('remove', ex)"
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
import type { Expense } from '@/features/expenses/api/expenses.api';
import { Dropdown, Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';

defineProps<{
  expenses: Expense[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  remove: [expense: Expense];
}>();

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}
</script>
