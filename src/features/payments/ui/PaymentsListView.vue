<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Payments</h1>
      </div>
      <router-link
        :to="{ name: 'paymentCreate' }"
        class="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Record payment
      </router-link>
    </div>

    <PaymentsTable :payments="payments" :loading="loading" :error="error" @remove="promptDelete" />

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDelete">
      <template #message>this payment</template>
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
import { usePaymentsList } from '@/features/payments/model/usePaymentsList';
import PaymentsTable from '@/features/payments/ui/PaymentsTable.vue';
import { ConfirmDeleteModal } from '@/shared/ui';

const {
  payments,
  loading,
  error,
  page,
  total,
  totalPages,
  setPage,
  deleteTarget,
  promptDelete,
  confirmDelete,
} = usePaymentsList();

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
