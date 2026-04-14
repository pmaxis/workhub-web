import { computed, onMounted, ref, watch } from 'vue';
import { brainTemplatesApi, type BrainTemplate } from '@/features/brain-templates/api/brainTemplates.api';
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function useBrainTemplatesList() {
  const { successWithUndo, error: notifyError } = useToast();
  const templates = ref<BrainTemplate[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<BrainTemplate | null>(null);
  const search = ref('');

  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await brainTemplatesApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
        q: search.value.trim() || undefined,
      });
      templates.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load templates';
      error.value = msg;
      notifyError(msg);
      templates.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(t: BrainTemplate) {
    deleteTarget.value = t;
  }

  function confirmDelete() {
    const t = deleteTarget.value;
    if (!t) return;
    const index = templates.value.findIndex((x) => x.id === t.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = templates.value[index];
    templates.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await brainTemplatesApi.remove(removed.id);
          if (templates.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          templates.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Template “${removed.title}” deleted`, () => {
      clearTimeout(timeoutId);
      templates.value.splice(index, 0, removed);
      total.value += 1;
    });
  }

  let searchDebounce: ReturnType<typeof setTimeout> | null = null;
  watch(
    () => search.value,
    () => {
      if (searchDebounce) clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        page.value = 1;
        void load();
      }, 300);
    },
  );

  onMounted(() => {
    void load();
  });

  return {
    templates,
    loading,
    error,
    search,
    page,
    total,
    totalPages,
    setPage,
    deleteTarget,
    promptDelete,
    confirmDelete,
  };
}
