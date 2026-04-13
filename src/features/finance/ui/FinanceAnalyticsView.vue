<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Revenue analytics</h1>
      <p class="mt-1 text-sm text-zinc-600">Totals for your account. Optional range filters invoices by created date.</p>
    </div>

    <div class="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div class="space-y-1">
        <FieldLabel forInput="fa-from">From</FieldLabel>
        <input
          id="fa-from"
          v-model="from"
          type="date"
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        />
      </div>
      <div class="space-y-1">
        <FieldLabel forInput="fa-to">To</FieldLabel>
        <input
          id="fa-to"
          v-model="to"
          type="date"
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        />
      </div>
      <button
        type="button"
        class="h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        :disabled="loading"
        @click="applyRange"
      >
        Apply
      </button>
      <button
        type="button"
        class="h-9 rounded-lg border border-zinc-200 bg-white px-4 text-sm text-zinc-700 hover:bg-zinc-50"
        @click="clearRange"
      >
        Clear
      </button>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div v-if="summary && !loading" class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-zinc-500">Payments in</p>
        <p class="mt-1 text-2xl font-semibold text-zinc-900">{{ summary.paymentsTotal }}</p>
      </div>
      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-zinc-500">Expenses out</p>
        <p class="mt-1 text-2xl font-semibold text-zinc-900">{{ summary.expensesTotal }}</p>
      </div>
      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wide text-zinc-500">Net (in − out)</p>
        <p class="mt-1 text-2xl font-semibold text-zinc-900">{{ summary.netCashflow }}</p>
      </div>
    </div>

    <div v-if="loading" class="text-sm text-zinc-600">Loading…</div>

    <div v-if="summary && !loading" class="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div class="border-b border-zinc-100 px-4 py-3">
        <h2 class="text-sm font-semibold text-zinc-900">Invoices by status</h2>
        <p class="text-xs text-zinc-500">Amounts summed per status (filtered period applies to created date).</p>
      </div>
      <Table>
        <TableHead>
          <tr>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell align="right">Count</TableHeadCell>
            <TableHeadCell align="right">Total</TableHeadCell>
          </tr>
        </TableHead>
        <TableBody>
          <TableRow v-for="row in summary.invoicesByStatus" :key="row.status">
            <TableCell class="font-medium">{{ row.status }}</TableCell>
            <TableCell align="right">{{ row.count }}</TableCell>
            <TableCell align="right">{{ row.totalAmount }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { financeAnalyticsApi, type FinanceSummary } from '@/features/finance/api/financeAnalytics.api';
import { FieldLabel, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/shared/ui';
import { useToast } from '@/shared/ui/Toast';

const { error: notifyError } = useToast();

const from = ref('');
const to = ref('');
const summary = ref<FinanceSummary | null>(null);
const loading = ref(false);
const error = ref('');

function toIsoDateBoundary(value: string, endOfDay: boolean): string {
  const t = endOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z';
  return new Date(`${value}${t}`).toISOString();
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const params =
      from.value && to.value
        ? { from: toIsoDateBoundary(from.value, false), to: toIsoDateBoundary(to.value, true) }
        : from.value
          ? { from: toIsoDateBoundary(from.value, false) }
          : to.value
            ? { to: toIsoDateBoundary(to.value, true) }
            : undefined;
    summary.value = await financeAnalyticsApi.summary(params);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Could not load analytics';
    error.value = msg;
    notifyError(msg);
    summary.value = null;
  } finally {
    loading.value = false;
  }
}

function applyRange() {
  void load();
}

function clearRange() {
  from.value = '';
  to.value = '';
  void load();
}

onMounted(() => {
  void load();
});
</script>
