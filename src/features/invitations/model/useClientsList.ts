import { onMounted, ref } from 'vue';
import { invitationsApi, type ClientItem } from '@/features/invitations/api/invitations.api';
import { useToast } from '@/shared/ui/Toast';

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
  const { error: notifyError } = useToast();
  const clients = ref<ClientItem[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function loadClients() {
    loading.value = true;
    error.value = '';
    try {
      clients.value = await invitationsApi.listClients();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load clients';
      error.value = msg;
      notifyError(msg);
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
