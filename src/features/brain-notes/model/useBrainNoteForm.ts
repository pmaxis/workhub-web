import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { brainNotesApi } from '@/features/brain-notes/api/brainNotes.api';
import { tasksApi, type Task } from '@/features/tasks';
import { useToast } from '@/shared/ui/Toast';
import type { SelectOption } from '@/shared/ui';

export function useBrainNoteForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();

  const isEdit = computed(() => route.name === 'noteEdit');
  const noteId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const title = ref('');
  const body = ref('');
  const tags = ref('');
  const taskId = ref('');

  const tasks = ref<Task[]>([]);
  const taskOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'No task' },
    ...tasks.value.map((t) => ({ value: t.id, label: t.title })),
  ]);

  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => ({ name: 'notes' as const }));

  async function loadTasks() {
    try {
      tasks.value = await tasksApi.list();
    } catch {
      tasks.value = [];
    }
  }

  async function loadNote() {
    if (!isEdit.value || !noteId.value) {
      title.value = '';
      body.value = '';
      tags.value = '';
      taskId.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const n = await brainNotesApi.get(noteId.value);
      title.value = n.title;
      body.value = n.body;
      tags.value = n.tags ?? '';
      taskId.value = n.taskId ?? '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load note';
      loadError.value = msg;
      notifyError(msg);
    }
  }

  onMounted(() => {
    void loadTasks();
  });

  watch(
    () => [isEdit.value, noteId.value] as const,
    () => {
      void loadNote();
    },
    { immediate: true },
  );

  async function submit() {
    saving.value = true;
    formError.value = '';
    if (!title.value.trim()) {
      formError.value = 'Title is required';
      saving.value = false;
      return;
    }
    try {
      if (isEdit.value && noteId.value) {
        await brainNotesApi.update(noteId.value, {
          title: title.value.trim(),
          body: body.value,
          tags: tags.value.trim() ? tags.value.trim() : null,
          taskId: taskId.value ? taskId.value : null,
        });
        notifySuccess('Note saved');
      } else {
        await brainNotesApi.create({
          title: title.value.trim(),
          body: body.value,
          tags: tags.value.trim() || undefined,
          taskId: taskId.value || undefined,
        });
        notifySuccess('Note created');
      }
      await router.push({ name: 'notes' });
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
    title,
    body,
    tags,
    taskId,
    taskOptions,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
