<template>
  <Form @submit.prevent="handleSubmit">
    <p v-if="invitationEmail" class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
      Invitation for {{ invitationEmail }}
    </p>
    <FormField
      v-model="email"
      label="Email"
      id="email"
      label-class="text-zinc-600"
      type="email"
      required
      autocomplete="email"
      placeholder="email@example.com"
    />
    <div>
      <FormField
        v-model="password"
        label="Password"
        id="password"
        label-class="text-zinc-600"
        type="password"
        required
        minlength="8"
        autocomplete="new-password"
        placeholder="••••••••"
      />
      <p class="mt-1 text-xs text-zinc-500">8–32 characters</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <FormField
        v-model="lastName"
        label="Last name"
        id="lastName"
        label-class="text-zinc-600"
        type="text"
        required
        autocomplete="family-name"
      />
      <FormField
        v-model="firstName"
        label="First name"
        id="firstName"
        label-class="text-zinc-600"
        type="text"
        required
        autocomplete="given-name"
      />
    </div>
    <FormField
      v-model="thirdName"
      label="Middle name (optional)"
      id="thirdName"
      label-class="text-zinc-600"
      type="text"
      autocomplete="additional-name"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <div class="w-full">
      <Button type="submit" variant="primary" size="md" :disabled="loading" class="w-full">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button, Form, FormField } from '@/shared/ui';
import { useAuth } from '@/features/auth/model/useAuth';

const route = useRoute();
const router = useRouter();
const auth = useAuth();

const email = ref('');
const password = ref('');
const lastName = ref('');
const firstName = ref('');
const thirdName = ref('');
const loading = ref(false);
const error = ref('');

const invitationToken = ref<string | null>(null);
const invitationEmail = ref<string | null>(null);

watch(
  () => route.query.token as string | undefined,
  async (token) => {
    invitationToken.value = token ?? null;
    invitationEmail.value = null;
    if (token) {
      try {
        const inv = await import('@/features/invitations').then((m) =>
          m.invitationsApi.getByToken(token),
        );
        if (inv?.email) invitationEmail.value = inv.email;
      } catch {
        void 0;
      }
    }
  },
  { immediate: true },
);

watch(invitationEmail, (em) => {
  if (em && !email.value) email.value = em;
}, { immediate: true });

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register({
      email: email.value,
      password: password.value,
      lastName: lastName.value,
      firstName: firstName.value,
      thirdName: thirdName.value || undefined,
      invitationToken: invitationToken.value ?? undefined,
    });
    await router.replace({ name: 'home' });
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>
