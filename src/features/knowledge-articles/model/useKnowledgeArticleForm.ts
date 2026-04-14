import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { knowledgeArticlesApi } from '@/features/knowledge-articles/api/knowledgeArticles.api';
import { tasksApi, type Task } from '@/features/tasks';
import { useToast } from '@/shared/ui/Toast';
import type { SelectOption } from '@/shared/ui';

export function useKnowledgeArticleForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();

  const isEdit = computed(() => route.name === 'knowledgeEdit');
  const articleId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

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

  const backTo = computed(() => ({ name: 'knowledgeBase' as const }));

  async function loadTasks() {
    try {
      tasks.value = await tasksApi.list();
    } catch {
      tasks.value = [];
    }
  }

  async function loadArticle() {
    if (!isEdit.value || !articleId.value) {
      title.value = '';
      body.value = '';
      tags.value = '';
      taskId.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const a = await knowledgeArticlesApi.get(articleId.value);
      title.value = a.title;
      body.value = a.body;
      tags.value = a.tags ?? '';
      taskId.value = a.taskId ?? '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load article';
      loadError.value = msg;
      notifyError(msg);
    }
  }

  onMounted(() => {
    void loadTasks();
  });

  watch(
    () => [isEdit.value, articleId.value] as const,
    () => {
      void loadArticle();
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
      if (isEdit.value && articleId.value) {
        await knowledgeArticlesApi.update(articleId.value, {
          title: title.value.trim(),
          body: body.value,
          tags: tags.value.trim() ? tags.value.trim() : null,
          taskId: taskId.value ? taskId.value : null,
        });
        notifySuccess('Article saved');
      } else {
        await knowledgeArticlesApi.create({
          title: title.value.trim(),
          body: body.value,
          tags: tags.value.trim() || undefined,
          taskId: taskId.value || undefined,
        });
        notifySuccess('Article created');
      }
      await router.push({ name: 'knowledgeBase' });
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
