<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="{ name: 'myAccount' }"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Назад
      </router-link>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div>
        <h2 class="text-base font-medium text-zinc-900">Редагування акаунта</h2>
        <p class="mt-1 text-sm text-zinc-600">
          Змініть ПІБ, email та пароль.
        </p>
      </div>

      <form class="mt-5 space-y-4" @submit.prevent="submitProfile">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Прізвище</label>
            <input
              v-model="form.lastName"
              type="text"
              class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Ім'я</label>
            <input
              v-model="form.firstName"
              type="text"
              class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">По батькові</label>
            <input
              v-model="form.thirdName"
              type="text"
              class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
              required
            />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">
              Новий пароль (залиште порожнім, щоб не змінювати)
            </label>
            <input
              v-model="form.password"
              type="password"
              minlength="8"
              class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none placeholder-zinc-400"
              placeholder="Мінімум 8 символів"
            />
          </div>
        </div>
        <p v-if="profileError" class="text-sm text-red-600">{{ profileError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="profileSaving" @click="router.push({ name: 'myAccount' })">
            Скасувати
          </Button>
          <Button type="submit" variant="primary" :disabled="profileSaving">
            {{ profileSaving ? 'Збереження…' : 'Зберегти' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/features/auth';
import { profileApi } from '@/features/profile';
import { Button } from '@/shared/ui';

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
    router.push({ name: 'myAccount' });
  } catch (e: unknown) {
    profileError.value = e instanceof Error ? e.message : 'Не вдалося зберегти';
  } finally {
    profileSaving.value = false;
  }
}

onMounted(() => {
  initForm();
});
</script>
