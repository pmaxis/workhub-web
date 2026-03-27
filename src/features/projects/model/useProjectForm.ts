import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projectsApi } from '@/features/projects/api/projects.api';

export function useProjectForm() {
  const route = useRoute();
  const router = useRouter();

  const isEdit = computed(() => route.name === 'projectEdit');
  const projectId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const name = ref('');
  const description = ref('');
  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => {
    if (isEdit.value && projectId.value) {
      return { name: 'projectDetail' as const, params: { id: projectId.value } };
    }
    return { name: 'projects' as const };
  });

  async function loadProject() {
    if (!isEdit.value || !projectId.value) {
      name.value = '';
      description.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const p = await projectsApi.get(projectId.value);
      name.value = p.name;
      description.value = p.description ?? '';
    } catch (e: unknown) {
      loadError.value = e instanceof Error ? e.message : 'Не вдалося завантажити проєкт';
    }
  }

  watch(
    () => [isEdit.value, projectId.value] as const,
    () => {
      void loadProject();
    },
    { immediate: true },
  );

  async function submit() {
    saving.value = true;
    formError.value = '';
    try {
      const payload = {
        name: name.value.trim(),
        description: description.value.trim() || undefined,
      };
      if (isEdit.value && projectId.value) {
        await projectsApi.update(projectId.value, {
          name: payload.name,
          description: payload.description ?? null,
        });
        await router.push({ name: 'projectDetail', params: { id: projectId.value } });
      } else {
        const created = await projectsApi.create(payload);
        await router.push({ name: 'projectDetail', params: { id: created.id } });
      }
    } catch (e: unknown) {
      formError.value = e instanceof Error ? e.message : 'Не вдалося зберегти';
    } finally {
      saving.value = false;
    }
  }

  function cancel() {
    void router.push(backTo.value);
  }

  return {
    isEdit,
    name,
    description,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
