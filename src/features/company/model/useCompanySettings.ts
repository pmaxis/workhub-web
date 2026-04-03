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

  const hasCompany = computed(() => companies.value.length > 0);

  async function load() {
    loading.value = true;
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
  };
}
