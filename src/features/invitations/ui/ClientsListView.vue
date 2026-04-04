<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">{{ pageTitle }}</h1>
      <p class="mt-1 text-zinc-600">{{ pageDescription }}</p>
    </div>

    <TableCard
      :loading="loading"
      :error="error"
      :empty="clients.length === 0"
      :empty-message="emptyMessage"
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
import { computed } from 'vue';
import { Table, TableBody, TableCard, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';
import { useAuth } from '@/features/auth';
import { useClientsList } from '@/features/invitations/model/useClientsList';

const auth = useAuth();
const { clients, loading, error, formatDate } = useClientsList();

const isFreelancerNav = computed(() => auth.user?.accountType === 'freelancer');

const pageTitle = computed(() =>
  isFreelancerNav.value ? 'Клієнти' : 'Співробітники',
);

const pageDescription = computed(() =>
  isFreelancerNav.value
    ? 'Клієнти з підтвердженим статусом запрошення'
    : 'Колеги з компанії та запрошені за підтвердженим запрошенням',
);

const emptyMessage = computed(() =>
  isFreelancerNav.value
    ? 'Немає клієнтів з підтвердженим запрошенням'
    : 'Немає співробітників для відображення',
);
</script>
