import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { projectsApi, type Project } from '@/features/projects/api/projects.api';

export function useProjectDetail() {
  const route = useRoute();
  const project = ref<Project | null>(null);
  const loading = ref(true);
  const error = ref('');

  async function loadAll() {
    const id = String(route.params.id || '');
    if (!id) return;
    loading.value = true;
    error.value = '';
    try {
      project.value = await projectsApi.get(id);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося завантажити';
      project.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => route.params.id,
    () => {
      void loadAll();
    },
    { immediate: true },
  );

  return {
    project,
    loading,
    error,
  };
}
