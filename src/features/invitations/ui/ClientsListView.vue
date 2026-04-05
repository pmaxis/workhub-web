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
            <TableHeadCell>Full name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Confirmed</TableHeadCell>
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
  isFreelancerNav.value ? 'Clients' : 'Team members',
);

const pageDescription = computed(() =>
  isFreelancerNav.value
    ? 'Clients with a confirmed invitation'
    : 'Company colleagues and users who joined via a confirmed invitation',
);

const emptyMessage = computed(() =>
  isFreelancerNav.value
    ? 'No clients with a confirmed invitation'
    : 'No team members to show',
);
</script>
