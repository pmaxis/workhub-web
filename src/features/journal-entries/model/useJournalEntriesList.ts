import { computed, onMounted, ref, watch } from 'vue';
import { journalEntriesApi, type JournalEntry } from '@/features/journal-entries/api/journalEntries.api';
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function useJournalEntriesList() {
  const { successWithUndo, error: notifyError } = useToast();
  const entries = ref<JournalEntry[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<JournalEntry | null>(null);
  const search = ref('');
  const fromDate = ref('');
  const toDate = ref('');

  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await journalEntriesApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
        q: search.value.trim() || undefined,
        from: fromDate.value.trim() || undefined,
        to: toDate.value.trim() || undefined,
      });
      entries.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load journal';
      error.value = msg;
      notifyError(msg);
      entries.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(e: JournalEntry) {
    deleteTarget.value = e;
  }

  function confirmDelete() {
    const e = deleteTarget.value;
    if (!e) return;
    const index = entries.value.findIndex((x) => x.id === e.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = entries.value[index];
    entries.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await journalEntriesApi.remove(removed.id);
          if (entries.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (err: unknown) {
          notifyError(err instanceof Error ? err.message : 'Could not delete');
          entries.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    const label = removed.title?.trim() || formatEntryDate(removed.entryDate);
    successWithUndo(`Entry “${label}” deleted`, () => {
      clearTimeout(timeoutId);
      entries.value.splice(index, 0, removed);
      total.value += 1;
    });
  }

  let debounce: ReturnType<typeof setTimeout> | null = null;
  watch(
    () => [search.value, fromDate.value, toDate.value] as const,
    () => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        page.value = 1;
        void load();
      }, 300);
    },
  );

  onMounted(() => {
    void load();
  });

  return {
    entries,
    loading,
    error,
    search,
    fromDate,
    toDate,
    page,
    total,
    totalPages,
    setPage,
    deleteTarget,
    promptDelete,
    confirmDelete,
  };
}

function formatEntryDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}
