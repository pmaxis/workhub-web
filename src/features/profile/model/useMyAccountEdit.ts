import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/features/auth';
import { profileApi } from '@/features/profile/api/profile.api';

export function useMyAccountEdit() {
  const router = useRouter();
  const auth = useAuth();

  const profileSaving = ref(false);
  const profileError = ref('');
  const form = ref({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    thirdName: '',
  });

  function initForm() {
    const u = auth.user;
    if (!u) return;
    form.value = {
      email: u.email ?? '',
      password: '',
      firstName: u.firstName ?? '',
      lastName: u.lastName ?? '',
      thirdName: u.thirdName ?? '',
    };
  }

  async function submitProfile() {
    profileError.value = '';
    profileSaving.value = true;
    try {
      const payload: Record<string, string> = {
        email: form.value.email,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
      };
      if (form.value.thirdName !== undefined) payload.thirdName = form.value.thirdName;
      if (form.value.password.trim()) payload.password = form.value.password;
      await profileApi.updateProfile(payload);
      await auth.fetchMe();
      await router.push({ name: 'myAccount' });
    } catch (e: unknown) {
      profileError.value = e instanceof Error ? e.message : 'Could not save';
    } finally {
      profileSaving.value = false;
    }
  }

  function cancel() {
    void router.push({ name: 'myAccount' });
  }

  onMounted(() => {
    initForm();
  });

  return {
    form,
    profileSaving,
    profileError,
    submitProfile,
    cancel,
  };
}
