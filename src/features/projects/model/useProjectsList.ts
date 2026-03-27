import { onMounted, ref } from 'vue';
import { projectsApi, type Project } from '@/features/projects/api/projects.api';

export function useProjectsList() {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      projects.value = await projectsApi.list();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося завантажити проєкти';
      projects.value = [];
    } finally {
      loading.value = false;
    }
  }

  function confirmRemove(p: Project) {
    if (!window.confirm(`Видалити проєкт «${p.name}» і всі його задачі?`)) return;
    void (async () => {
      try {
        await projectsApi.remove(p.id);
        await load();
      } catch (e: unknown) {
        error.value = e instanceof Error ? e.message : 'Не вдалося видалити';
      }
    })();
  }

  onMounted(() => {
    void load();
  });

  return {
    projects,
    loading,
    error,
    confirmRemove,
  };
}
