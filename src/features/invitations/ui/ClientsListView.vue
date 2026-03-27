<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Клієнти</h1>
      <p class="mt-1 text-zinc-600">Клієнти з підтвердженим статусом запрошення</p>
    </div>

    <TableCard
      :loading="loading"
      :error="error"
      :empty="clients.length === 0"
      empty-message="Немає клієнтів з підтвердженим запрошенням"
    >
      <Table>
        <TableHead>
          <tr>
            <TableHeadCell>ПІБ</TableHeadCell>
            <TableHeadCell>Пошта</TableHeadCell>
            <TableHeadCell>Підтверджено</TableHeadCell>
          </tr>
        </TableHead>
        <TableBody>
          <TableRow v-for="client in clients" :key="client.id">
            <TableCell nowrap>{{ client.fullName || '—' }}</TableCell>
            <TableCell nowrap tone="muted">{{ client.email }}</TableCell>
            <TableCell nowrap tone="muted">{{ formatDate(client.confirmedAt) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableCard>
  </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';
import { useClientsList } from '@/features/invitations/model/useClientsList';

const { clients, loading, error, formatDate } = useClientsList();
</script>
