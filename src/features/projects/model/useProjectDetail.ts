import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { projectsApi, type Project } from '@/features/projects/api/projects.api';
import { useToast } from '@/shared/ui/Toast';

export function useProjectDetail() {
  const route = useRoute();
  const { error: notifyError } = useToast();
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
      const msg = e instanceof Error ? e.message : 'Could not load';
      error.value = msg;
      notifyError(msg);
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
