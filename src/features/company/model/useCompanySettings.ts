import { computed, onMounted, ref } from 'vue';
import { companiesApi } from '@/features/company/api/companies.api';
import type { Company } from '@/features/company/api/companies.api';
import { useAuth } from '@/features/auth';
import { useToast } from '@/shared/ui/Toast';

const UNDO_MS = 5000;

export function useCompanySettings() {
  const auth = useAuth();
  const { successWithUndo, success, error: notifyError } = useToast();
  const companies = ref<Company[]>([]);
  const loading = ref(true);
  const name = ref('');
  const creating = ref(false);
  const createError = ref('');
  const editingId = ref<string | null>(null);
  const editName = ref('');
  const updating = ref(false);
  const updateError = ref('');
  const deleteError = ref('');
  const deleteTarget = ref<Company | null>(null);

  const hasCompany = computed(() => companies.value.length > 0);

  async function load() {
    loading.value = true;
    deleteError.value = '';
    try {
      companies.value = await companiesApi.list();
    } finally {
      loading.value = false;
    }
  }

  async function createCompany() {
    const trimmed = name.value.trim();
    if (trimmed.length < 2) return;
    creating.value = true;
    createError.value = '';
    try {
      await companiesApi.create({ name: trimmed });
      name.value = '';
      await auth.fetchMe();
      await load();
      success('Company created');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not create company';
      createError.value = msg;
      notifyError(msg);
    } finally {
      creating.value = false;
    }
  }

  function startEdit(c: Company) {
    editingId.value = c.id;
    editName.value = c.name;
    updateError.value = '';
  }

  function cancelEdit() {
    editingId.value = null;
    editName.value = '';
    updateError.value = '';
  }

  async function saveEdit() {
    const id = editingId.value;
    if (!id) return;
    const trimmed = editName.value.trim();
    if (trimmed.length < 2) return;
    updating.value = true;
    updateError.value = '';
    try {
      await companiesApi.update(id, { name: trimmed });
      cancelEdit();
      await auth.fetchMe();
      await load();
      success('Company updated');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not update company';
      updateError.value = msg;
      notifyError(msg);
    } finally {
      updating.value = false;
    }
  }

  function promptDeleteCompany(c: Company) {
    deleteTarget.value = c;
  }

  function confirmDeleteCompany() {
    const c = deleteTarget.value;
    if (!c) return;
    const index = companies.value.findIndex((x) => x.id === c.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = companies.value[index];
    companies.value.splice(index, 1);
    deleteError.value = '';
    if (editingId.value === removed.id) cancelEdit();

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await companiesApi.remove(removed.id);
          await auth.fetchMe();
          await load();
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Could not delete company';
          deleteError.value = msg;
          notifyError(msg);
          companies.value.splice(index, 0, removed);
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Company “${removed.name}” deleted`, () => {
      clearTimeout(timeoutId);
      companies.value.splice(index, 0, removed);
    });
  }

  onMounted(() => {
    void load();
  });

  return {
    companies,
    loading,
    name,
    creating,
    createError,
    hasCompany,
    createCompany,
    editingId,
    editName,
    updating,
    updateError,
    deleteError,
    deleteTarget,
    startEdit,
    cancelEdit,
    saveEdit,
    promptDeleteCompany,
    confirmDeleteCompany,
  };
}
