import { computed, onMounted, ref } from 'vue';
import { expensesApi, type Expense } from '@/features/expenses/api/expenses.api';
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function useExpensesList() {
  const { successWithUndo, error: notifyError } = useToast();
  const expenses = ref<Expense[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<Expense | null>(null);

  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await expensesApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
      });
      expenses.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load expenses';
      error.value = msg;
      notifyError(msg);
      expenses.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(x: Expense) {
    deleteTarget.value = x;
  }

  function confirmDelete() {
    const x = deleteTarget.value;
    if (!x) return;
    const index = expenses.value.findIndex((e) => e.id === x.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = expenses.value[index];
    expenses.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await expensesApi.remove(removed.id);
          if (expenses.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          expenses.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Expense “${removed.description}” deleted`, () => {
      clearTimeout(timeoutId);
      expenses.value.splice(index, 0, removed);
      total.value += 1;
    });
  }

  onMounted(() => {
    void load();
  });

  return {
    expenses,
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
