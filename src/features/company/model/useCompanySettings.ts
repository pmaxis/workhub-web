import { computed, onMounted, ref } from 'vue';
import { companiesApi } from '@/features/company/api/companies.api';
import type { Company } from '@/features/company/api/companies.api';
import { useAuth } from '@/features/auth';

export function useCompanySettings() {
  const auth = useAuth();
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
    } catch (e: unknown) {
      createError.value = e instanceof Error ? e.message : 'Не вдалося створити компанію';
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
    } catch (e: unknown) {
      updateError.value = e instanceof Error ? e.message : 'Не вдалося оновити компанію';
    } finally {
      updating.value = false;
    }
  }

  function confirmRemoveCompany(c: Company) {
    if (!window.confirm(`Видалити компанію «${c.name}»? Учасників буде від’єднано; проєкти залишаться без прив’язки до компанії.`)) {
      return;
    }
    void (async () => {
      deleteError.value = '';
      try {
        await companiesApi.remove(c.id);
        if (editingId.value === c.id) cancelEdit();
        await auth.fetchMe();
        await load();
      } catch (e: unknown) {
        deleteError.value = e instanceof Error ? e.message : 'Не вдалося видалити компанію';
      }
    })();
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
    startEdit,
    cancelEdit,
    saveEdit,
    confirmRemoveCompany,
  };
}
