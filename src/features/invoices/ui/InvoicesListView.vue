<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Invoices</h1>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border px-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:border-zinc-900"
          :class="
            filtersOpen
              ? 'border-zinc-900 bg-zinc-900 text-white'
              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
          "
          :aria-expanded="filtersOpen"
          aria-controls="invoices-filters"
          aria-label="Toggle filters"
          @click="filtersOpen = !filtersOpen"
        >
          <Icon name="funnel" size="sm" />
        </button>
        <router-link
          :to="{ name: 'invoiceCreate' }"
          class="inline-flex h-9 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New invoice
        </router-link>
      </div>
    </div>

    <div
      class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
      :class="filtersOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="min-h-0 overflow-hidden">
        <div
          id="invoices-filters"
          class="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
          :inert="!filtersOpen"
        >
          <div class="max-w-xs space-y-1">
            <FieldLabel forInput="invoice-status-filter">Status</FieldLabel>
            <FormField
              id="invoice-status-filter"
              v-model="statusFilter"
              as="select"
              :options="statusFilterOptions"
              select-placeholder="All statuses"
            />
          </div>
        </div>
      </div>
    </div>

    <InvoicesTable :invoices="invoices" :loading="loading" :error="error" @remove="promptDelete" />

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDelete">
      <template #message>invoice “{{ deleteTarget?.number }}”</template>
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
import { computed, ref } from 'vue';
import { useInvoicesList } from '@/features/invoices/model/useInvoicesList';
import InvoicesTable from '@/features/invoices/ui/InvoicesTable.vue';
import { ConfirmDeleteModal, FieldLabel, FormField, Icon } from '@/shared/ui';
import type { SelectOption } from '@/shared/ui';

const filtersOpen = ref(false);

const statusFilterOptions: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const {
  invoices,
  loading,
  error,
  statusFilter,
  page,
  total,
  totalPages,
  setPage,
  deleteTarget,
  promptDelete,
  confirmDelete,
} = useInvoicesList();

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
