import { computed, onMounted, ref, watch } from 'vue';
import { projectsApi, type Project } from '@/features/projects/api/projects.api';
import { useToast } from '@/shared/ui/Toast';

const DEFAULT_LIMIT = 20;
const UNDO_MS = 5000;

export function useProjectsList() {
  const { successWithUndo, error: notifyError } = useToast();
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref('');
  const deleteTarget = ref<Project | null>(null);

  const search = ref('');
  const page = ref(1);
  const total = ref(0);
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / DEFAULT_LIMIT)));

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const result = await projectsApi.list({
        page: page.value,
        limit: DEFAULT_LIMIT,
        search: search.value || undefined,
      });
      projects.value = result.data;
      total.value = result.total;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load projects';
      error.value = msg;
      notifyError(msg);
      projects.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function setPage(p: number) {
    page.value = p;
    void load();
  }

  function promptDelete(p: Project) {
    deleteTarget.value = p;
  }

  function confirmDelete() {
    const p = deleteTarget.value;
    if (!p) return;
    const index = projects.value.findIndex((x) => x.id === p.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = projects.value[index];
    projects.value.splice(index, 1);
    total.value = Math.max(0, total.value - 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await projectsApi.remove(removed.id);
          if (projects.value.length === 0 && page.value > 1) {
            page.value -= 1;
          }
          await load();
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          projects.value.splice(index, 0, removed);
          total.value += 1;
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Project “${removed.name}” deleted`, () => {
      clearTimeout(timeoutId);
      projects.value.splice(index, 0, removed);
      total.value += 1;
    });
  }

  watch(search, () => {
    page.value = 1;
    void load();
  });

  onMounted(() => {
    void load();
  });

  return {
    projects,
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
