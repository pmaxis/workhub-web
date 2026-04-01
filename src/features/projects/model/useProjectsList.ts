import { computed, onMounted, ref, watch } from 'vue';
import { projectsApi, type Project } from '@/features/projects/api/projects.api';

const DEFAULT_LIMIT = 20;

export function useProjectsList() {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref('');

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
      error.value = e instanceof Error ? e.message : 'Не вдалося завантажити проєкти';
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

  function confirmRemove(p: Project) {
    if (!window.confirm(`Видалити проєкт «${p.name}» і всі його задачі?`)) return;
    void (async () => {
      try {
        await projectsApi.remove(p.id);
        if (projects.value.length === 1 && page.value > 1) {
          page.value -= 1;
        }
        await load();
      } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Не вдалося видалити';
      }
    })();
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
    confirmRemove,
  };
}
