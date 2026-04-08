import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projectsApi, type Project } from '@/features/projects';
import { tasksApi, type TaskStatus } from '@/features/tasks/api/tasks.api';
import { useToast } from '@/shared/ui/Toast';

export function useTaskForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError, warning: notifyWarning } = useToast();

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
  const trackedSeconds = ref(0);

  const backTo = computed(() => {
    if (selectedProjectId.value) {
      return { name: 'projectDetail' as const, params: { id: selectedProjectId.value } };
    }
    return { name: 'tasks' as const };
  });

  async function loadProjects(): Promise<void> {
    loadError.value = '';
    try {
      const result = await projectsApi.list({ limit: 100 });
      projects.value = result.data;
    } catch {
      projects.value = [];
      const msg = 'Could not load projects';
      loadError.value = msg;
      notifyError(msg);
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
      trackedSeconds.value = t.trackedDurationSeconds ?? 0;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load task';
      loadError.value = msg;
      notifyError(msg);
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
      trackedSeconds.value = 0;
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
        notifySuccess('Task saved');
        await router.push(backTo.value);
      } else {
        if (!selectedProjectId.value) {
          const msg = 'Select a project';
          formError.value = msg;
          notifyWarning(msg);
          return;
        }
        await tasksApi.create({
          title: title.value.trim(),
          description: description.value.trim() || undefined,
          status: status.value,
          projectId: selectedProjectId.value,
        });
        notifySuccess('Task created');
        await router.push({ name: 'tasks' });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not save';
      formError.value = msg;
      notifyError(msg);
    } finally {
      saving.value = false;
    }
  }

  function cancel() {
    void router.push(backTo.value);
  }

  return {
    isEdit,
    trackedSeconds,
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
