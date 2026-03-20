<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
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
        placeholder="admin@example.com"
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
        autocomplete="current-password"
        placeholder="••••••••"
        class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none"
      />
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <div class="w-full">
      <Button type="submit" variant="primary" size="md" :disabled="loading" class="w-full">
        {{ loading ? 'Вхід...' : 'Увійти' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/shared/ui';
import { useAuth } from '../model/useAuth';

const router = useRouter();
const auth = useAuth();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    await router.replace({ name: 'home' });
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Помилка входу';
  } finally {
    loading.value = false;
  }
}
</script>
