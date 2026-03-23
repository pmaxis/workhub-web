<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <p v-if="invitationEmail" class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
      Запрошення для {{ invitationEmail }}
    </p>
    <div>
      <label for="email" class="mb-1 block text-xs uppercase tracking-wide text-zinc-600">
        Email
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        placeholder="email@example.com"
        class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none"
      />
    </div>
    <div>
      <label for="password" class="mb-1 block text-xs uppercase tracking-wide text-zinc-600">
        Пароль
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        minlength="8"
        autocomplete="new-password"
        placeholder="••••••••"
        class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none"
      />
      <p class="mt-1 text-xs text-zinc-500">8–32 символів</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="lastName" class="mb-1 block text-xs uppercase tracking-wide text-zinc-600">
          Прізвище
        </label>
        <input
          id="lastName"
          v-model="lastName"
          type="text"
          required
          autocomplete="family-name"
          class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </div>
      <div>
        <label for="firstName" class="mb-1 block text-xs uppercase tracking-wide text-zinc-600">
          Ім'я
        </label>
        <input
          id="firstName"
          v-model="firstName"
          type="text"
          required
          autocomplete="given-name"
          class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </div>
    </div>
    <div>
      <label for="thirdName" class="mb-1 block text-xs uppercase tracking-wide text-zinc-600">
        По батькові (необов'язково)
      </label>
      <input
        id="thirdName"
        v-model="thirdName"
        type="text"
        autocomplete="additional-name"
        class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
      />
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <div class="w-full">
      <Button type="submit" variant="primary" size="md" :disabled="loading" class="w-full">
        {{ loading ? 'Реєстрація...' : 'Зареєструватися' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/shared/ui';
import { useAuth } from '../model/useAuth';

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
        // ignore
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
    error.value = e instanceof Error ? e.message : 'Помилка реєстрації';
  } finally {
    loading.value = false;
  }
}
</script>
