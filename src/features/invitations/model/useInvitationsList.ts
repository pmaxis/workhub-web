import { onMounted, ref } from 'vue';
import { invitationsApi, type Invitation } from '@/features/invitations/api/invitations.api';
import { buildInviteLink } from '@/features/invitations/model/buildInviteLink';
import { useToast } from '@/shared/ui/Toast';

const UNDO_MS = 5000;

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
  const { successWithUndo, error: notifyError, success: notifySuccess, info: notifyInfo } =
    useToast();
  const invitations = ref<Invitation[]>([]);
  const loading = ref(false);
  const error = ref('');
  const resendingId = ref<string | null>(null);
  const deleteTarget = ref<Invitation | null>(null);

  async function loadInvitations() {
    loading.value = true;
    error.value = '';
    try {
      invitations.value = await invitationsApi.list({ status: 'PENDING' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load invitations';
      error.value = msg;
      notifyError(msg);
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
      notifySuccess('Invitation email sent');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not resend';
      error.value = msg;
      notifyError(msg);
    } finally {
      resendingId.value = null;
    }
  }

  function promptDelete(inv: Invitation) {
    deleteTarget.value = inv;
  }

  function confirmDelete() {
    const inv = deleteTarget.value;
    if (!inv) return;
    const index = invitations.value.findIndex((i) => i.id === inv.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = invitations.value[index];
    invitations.value.splice(index, 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await invitationsApi.remove(removed.id);
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not delete');
          invitations.value.splice(index, 0, removed);
        }
      })();
    }, UNDO_MS);

    successWithUndo(`Invitation for ${removed.email} deleted`, () => {
      clearTimeout(timeoutId);
      invitations.value.splice(index, 0, removed);
    });
  }

  function copyInviteLink(token: string) {
    void navigator.clipboard.writeText(buildInviteLink(token));
    notifyInfo('Link copied to clipboard', 3000);
  }

  onMounted(() => {
    void loadInvitations();
  });

  return {
    invitations,
    loading,
    error,
    resendingId,
    deleteTarget,
    formatDate,
    buildInviteLink,
    resendInvitation,
    promptDelete,
    confirmDelete,
    copyInviteLink,
  };
}
