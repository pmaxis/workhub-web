import { computed, onMounted, ref } from 'vue';
import { paymentsApi, type Payment } from '@/features/payments/api/payments.api';
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function usePaymentsList() {
  const { successWithUndo, error: notifyError } = useToast();
  const payments = ref<Payment[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<Payment | null>(null);

  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await paymentsApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
      });
      payments.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load payments';
      error.value = msg;
      notifyError(msg);
      payments.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(p: Payment) {
    deleteTarget.value = p;
  }

  function confirmDelete() {
    const p = deleteTarget.value;
    if (!p) return;
    const index = payments.value.findIndex((x) => x.id === p.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = payments.value[index];
    payments.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await paymentsApi.remove(removed.id);
          if (payments.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          payments.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    successWithUndo('Payment deleted', () => {
      clearTimeout(timeoutId);
      payments.value.splice(index, 0, removed);
      total.value += 1;
    });
  }

  onMounted(() => {
    void load();
  });

  return {
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
  };
}
