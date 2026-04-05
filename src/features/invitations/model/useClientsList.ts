import { onMounted, ref } from 'vue';
import { invitationsApi, type ClientItem } from '@/features/invitations/api/invitations.api';

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function useClientsList() {
  const clients = ref<ClientItem[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadClients() {
    loading.value = true;
    error.value = '';
    try {
      clients.value = await invitationsApi.listClients();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Could not load clients';
      clients.value = [];
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    void loadClients();
  });

  return {
    clients,
    loading,
    error,
    formatDate,
  };
}
