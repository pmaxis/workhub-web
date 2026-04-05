import { onMounted, ref } from 'vue';
import { invitationsApi, type Invitation } from '@/features/invitations/api/invitations.api';
import { buildInviteLink } from '@/features/invitations/model/buildInviteLink';

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function useInvitationsList() {
  const invitations = ref<Invitation[]>([]);
  const loading = ref(false);
  const error = ref('');
  const resendingId = ref<string | null>(null);
  const deletingId = ref<string | null>(null);

  async function loadInvitations() {
    loading.value = true;
    error.value = '';
    try {
      invitations.value = await invitationsApi.list({ status: 'PENDING' });
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Could not load invitations';
      invitations.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function resendInvitation(id: string) {
    resendingId.value = id;
    try {
      await invitationsApi.resend(id);
      await loadInvitations();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Could not resend';
    } finally {
      resendingId.value = null;
    }
  }

  async function deleteInvitation(id: string) {
    deletingId.value = id;
    try {
      await invitationsApi.remove(id);
      invitations.value = invitations.value.filter((i) => i.id !== id);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Could not delete';
    } finally {
      deletingId.value = null;
    }
  }

  function copyInviteLink(token: string) {
    void navigator.clipboard.writeText(buildInviteLink(token));
  }

  onMounted(() => {
    void loadInvitations();
  });

  return {
    invitations,
    loading,
    error,
    resendingId,
    deletingId,
    formatDate,
    buildInviteLink,
    resendInvitation,
    deleteInvitation,
    copyInviteLink,
  };
}
