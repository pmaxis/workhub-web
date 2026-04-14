import { computed, onMounted, ref, watch } from 'vue';
import { knowledgeArticlesApi, type KnowledgeArticle } from '@/features/knowledge-articles/api/knowledgeArticles.api';
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function useKnowledgeArticlesList() {
  const { successWithUndo, error: notifyError } = useToast();
  const articles = ref<KnowledgeArticle[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<KnowledgeArticle | null>(null);
  const search = ref('');

  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await knowledgeArticlesApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
        q: search.value.trim() || undefined,
      });
      articles.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load articles';
      error.value = msg;
      notifyError(msg);
      articles.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(a: KnowledgeArticle) {
    deleteTarget.value = a;
  }

  function confirmDelete() {
    const a = deleteTarget.value;
    if (!a) return;
    const index = articles.value.findIndex((x) => x.id === a.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = articles.value[index];
    articles.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await knowledgeArticlesApi.remove(removed.id);
          if (articles.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          articles.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Article “${removed.title}” deleted`, () => {
      clearTimeout(timeoutId);
      articles.value.splice(index, 0, removed);
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
    articles,
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
