import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { expensesApi } from '@/features/expenses/api/expenses.api';
import { projectsApi, type Project } from '@/features/projects';
import { useToast } from '@/shared/ui/Toast';
import type { SelectOption } from '@/shared/ui';

function dateInputFromIso(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isoFromDateInput(value: string): string {
  return new Date(`${value}T12:00:00`).toISOString();
}

export function useExpenseForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();

  const isEdit = computed(() => route.name === 'expenseEdit');
  const expenseId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const description = ref('');
  const category = ref('');
  const amount = ref('');
  const currency = ref('USD');
  const projectId = ref('');
  const spentAt = ref('');
  const notes = ref('');

  const projects = ref<Project[]>([]);
  const projectOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'No project' },
    ...projects.value.map((p) => ({ value: p.id, label: p.name })),
  ]);

  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => ({ name: 'expenses' as const }));

  async function loadProjects() {
    try {
      const res = await projectsApi.list({ limit: 100 });
      projects.value = res.data;
    } catch {
      projects.value = [];
    }
  }

  async function loadExpense() {
    if (!isEdit.value || !expenseId.value) {
      description.value = '';
      category.value = '';
      amount.value = '';
      currency.value = 'USD';
      projectId.value = '';
      spentAt.value = dateInputFromIso(new Date().toISOString());
      notes.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const ex = await expensesApi.get(expenseId.value);
      description.value = ex.description;
      category.value = ex.category ?? '';
      amount.value = ex.amount;
      currency.value = ex.currency;
      projectId.value = ex.projectId ?? '';
      spentAt.value = dateInputFromIso(ex.spentAt);
      notes.value = ex.notes ?? '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load expense';
      loadError.value = msg;
      notifyError(msg);
    }
  }

  onMounted(() => {
    void loadProjects();
  });

  watch(
    () => [isEdit.value, expenseId.value] as const,
    () => {
      void loadExpense();
    },
    { immediate: true },
  );

  async function submit() {
    saving.value = true;
    formError.value = '';
    const amountNum = Number.parseFloat(amount.value);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      formError.value = 'Enter a valid amount';
      saving.value = false;
      return;
    }
    if (!description.value.trim()) {
      formError.value = 'Description is required';
      saving.value = false;
      return;
    }
    if (!spentAt.value.trim()) {
      formError.value = 'Date is required';
      saving.value = false;
      return;
    }
    try {
      const spentIso = isoFromDateInput(spentAt.value);
      if (isEdit.value && expenseId.value) {
        await expensesApi.update(expenseId.value, {
          description: description.value.trim(),
          category: category.value.trim() ? category.value.trim() : null,
          amount: amountNum,
          currency: currency.value.trim().toUpperCase() || 'USD',
          projectId: projectId.value ? projectId.value : null,
          spentAt: spentIso,
          notes: notes.value.trim() ? notes.value.trim() : null,
        });
        notifySuccess('Expense saved');
      } else {
        await expensesApi.create({
          description: description.value.trim(),
          category: category.value.trim() || undefined,
          amount: amountNum,
          currency: currency.value.trim().toUpperCase() || 'USD',
          projectId: projectId.value || undefined,
          spentAt: spentIso,
          notes: notes.value.trim() || undefined,
        });
        notifySuccess('Expense created');
      }
      await router.push({ name: 'expenses' });
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
    description,
    category,
    amount,
    currency,
    projectId,
    spentAt,
    notes,
    projectOptions,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
