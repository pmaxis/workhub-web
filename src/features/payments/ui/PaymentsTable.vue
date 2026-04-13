<template>
  <TableCard
    :loading="loading"
    :error="error"
    :empty="payments.length === 0"
    empty-message="No payments yet. Record your first payment."
  >
    <Table>
      <TableHead>
        <tr>
          <TableHeadCell>Received</TableHeadCell>
          <TableHeadCell>Invoice</TableHeadCell>
          <TableHeadCell>Method</TableHeadCell>
          <TableHeadCell align="right">Amount</TableHeadCell>
          <TableHeadCell align="right">Actions</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-for="p in payments" :key="p.id">
          <TableCell nowrap tone="muted">
            {{ formatDate(p.receivedAt) }}
          </TableCell>
          <TableCell nowrap>
            {{ p.invoiceId ? p.invoiceId.slice(0, 8) + '…' : '—' }}
          </TableCell>
          <TableCell>{{ p.method || '—' }}</TableCell>
          <TableCell align="right" nowrap>
            {{ p.amount }} {{ p.currency }}
          </TableCell>
          <TableCell align="right" nowrap tone="plain">
            <Dropdown>
              <router-link
                :to="{ name: 'paymentEdit', params: { id: p.id } }"
                role="menuitem"
                class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </router-link>
              <button
                type="button"
                role="menuitem"
                class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                @click="emit('remove', p)"
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
import type { Payment } from '@/features/payments/api/payments.api';
import { Dropdown, Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';

defineProps<{
  payments: Payment[];
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  remove: [payment: Payment];
}>();

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
</script>
