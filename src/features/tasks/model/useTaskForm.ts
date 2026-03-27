import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type TaskStatus } from '@/features/tasks/api/tasks.api';

export function useTaskForm() {
  const route = useRoute();
  const router = useRouter();

  const isEdit = computed(() => route.name === 'taskEdit');
  const taskId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const projects = ref<Project[]>([]);
  const selectedProjectId = ref('');
  const title = ref('');
  const description = ref('');
  const status = ref<TaskStatus>('PENDING');

  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => {
    if (selectedProjectId.value) {
      return { name: 'projectDetail' as const, params: { id: selectedProjectId.value } };
    }
    return { name: 'tasks' as const };
  });

  async function loadProjects(): Promise<void> {
    loadError.value = '';
    try {
      projects.value = await projectsApi.list();
    } catch {
      projects.value = [];
      loadError.value = 'Не вдалося завантажити проєкти';
    }
  }

  async function loadTask(): Promise<void> {
    if (!isEdit.value || !taskId.value) return;
    try {
      const t = await tasksApi.get(taskId.value);
      selectedProjectId.value = t.projectId;
      title.value = t.title;
      description.value = t.description ?? '';
      status.value = t.status;
    } catch (e: unknown) {
      loadError.value = e instanceof Error ? e.message : 'Не вдалося завантажити задачу';
    }
  }

  watch(
    () =>
      [String(route.name), String(route.params.id ?? ''), String(route.query.projectId ?? '')] as const,
    async () => {
      loadError.value = '';
      await loadProjects();
      if (isEdit.value && taskId.value) {
        await loadTask();
        return;
      }
      title.value = '';
      description.value = '';
      status.value = 'PENDING';
      const fromQuery = String(route.query.projectId || '');
      if (fromQuery && projects.value.some((p) => p.id === fromQuery)) {
        selectedProjectId.value = fromQuery;
      } else {
        selectedProjectId.value = '';
      }
    },
    { immediate: true },
  );

  async function submit() {
    saving.value = true;
    formError.value = '';
    try {
      if (isEdit.value && taskId.value) {
        await tasksApi.update(taskId.value, {
          title: title.value.trim(),
          description: description.value.trim() || null,
          status: status.value,
        });
        await router.push(backTo.value);
      } else {
        if (!selectedProjectId.value) {
          formError.value = 'Оберіть проєкт';
          return;
        }
        await tasksApi.create({
          title: title.value.trim(),
          description: description.value.trim() || undefined,
          status: status.value,
          projectId: selectedProjectId.value,
        });
        await router.push({ name: 'tasks' });
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
    projects,
    selectedProjectId,
    title,
    description,
    status,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
