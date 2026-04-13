import { computed, onMounted, ref, watch } from 'vue';
import { invoicesApi, type Invoice, type InvoiceStatus } from '@/features/invoices/api/invoices.api';

const STATUSES: InvoiceStatus[] = ['DRAFT', 'SENT', 'PAID', 'CANCELLED'];

function parseStatus(value: string): InvoiceStatus | undefined {
  return STATUSES.includes(value as InvoiceStatus) ? (value as InvoiceStatus) : undefined;
}
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function useInvoicesList() {
  const { successWithUndo, error: notifyError } = useToast();
  const invoices = ref<Invoice[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<Invoice | null>(null);

  const statusFilter = ref('');
  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await invoicesApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
        status: parseStatus(statusFilter.value),
      });
      invoices.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load invoices';
      error.value = msg;
      notifyError(msg);
      invoices.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(inv: Invoice) {
    deleteTarget.value = inv;
  }

  function confirmDelete() {
    const inv = deleteTarget.value;
    if (!inv) return;
    const index = invoices.value.findIndex((x) => x.id === inv.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = invoices.value[index];
    invoices.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await invoicesApi.remove(removed.id);
          if (invoices.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          invoices.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Invoice “${removed.number}” deleted`, () => {
      clearTimeout(timeoutId);
      invoices.value.splice(index, 0, removed);
      total.value += 1;
    });
  }

  watch(statusFilter, () => {
    page.value = 1;
    void load();
  });

  onMounted(() => {
    void load();
  });

  return {
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
  };
}
