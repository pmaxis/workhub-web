<template>
  <TableCard
    :loading="loading"
    :error="error"
    :empty="invoices.length === 0"
    empty-message="No invoices yet. Create your first one."
  >
    <Table>
      <TableHead>
        <tr>
          <TableHeadCell>Number</TableHeadCell>
          <TableHeadCell>Title</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell align="right">Amount</TableHeadCell>
          <TableHeadCell align="right">Actions</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-for="inv in invoices" :key="inv.id">
          <TableCell nowrap class="font-medium text-zinc-900">
            {{ inv.number }}
          </TableCell>
          <TableCell>
            <span class="line-clamp-2">{{ inv.title || '—' }}</span>
          </TableCell>
          <TableCell nowrap tone="muted">
            {{ inv.status }}
          </TableCell>
          <TableCell align="right" nowrap>
            {{ inv.amount }} {{ inv.currency }}
          </TableCell>
          <TableCell align="right" nowrap tone="plain">
            <Dropdown>
              <router-link
                :to="{ name: 'invoiceEdit', params: { id: inv.id } }"
                role="menuitem"
                class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </router-link>
              <button
                type="button"
                role="menuitem"
                class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                @click="emit('remove', inv)"
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
import type { Invoice } from '@/features/invoices/api/invoices.api';
import { Dropdown, Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';

defineProps<{
  invoices: Invoice[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  remove: [invoice: Invoice];
}>();
</script>
