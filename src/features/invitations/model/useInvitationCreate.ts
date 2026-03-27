import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { invitationsApi } from '@/features/invitations/api/invitations.api';

export function useInvitationCreate() {
  const router = useRouter();
  const newEmail = ref('');
  const creating = ref(false);
  const createError = ref('');

  async function createInvitation() {
    creating.value = true;
    createError.value = '';
    try {
      await invitationsApi.create({ email: newEmail.value.trim() });
      await router.push({ name: 'invitations' });
    } catch (e: unknown) {
      createError.value = e instanceof Error ? e.message : 'Не вдалося створити запрошення';
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
