import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { invitationsApi } from '@/features/invitations/api/invitations.api';
import { useToast } from '@/shared/ui/Toast';

export function useInvitationCreate() {
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();
  const newEmail = ref('');
  const creating = ref(false);
  const createError = ref('');

  async function createInvitation() {
    creating.value = true;
    createError.value = '';
    try {
      await invitationsApi.create({ email: newEmail.value.trim() });
      notifySuccess('Invitation created');
      await router.push({ name: 'invitations' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not create invitation';
      createError.value = msg;
      notifyError(msg);
    } finally {
      creating.value = false;
    }
  }

  function cancel() {
    void router.push({ name: 'invitations' });
  }

  return {
    newEmail,
    creating,
    createError,
    createInvitation,
    cancel,
  };
}
