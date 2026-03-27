<template>
  <Form @submit.prevent="handleSubmit">
    <FormField
      v-model="email"
      label="Email"
      id="email"
      label-class="text-zinc-600"
      type="email"
      required
      autocomplete="email"
      placeholder="admin@example.com"
    />
    <FormField
      v-model="password"
      label="Пароль"
      id="password"
      label-class="text-zinc-600"
      type="password"
      required
      autocomplete="current-password"
      placeholder="••••••••"
    />
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <div class="w-full">
      <Button type="submit" variant="primary" size="md" :disabled="loading" class="w-full">
        {{ loading ? 'Вхід...' : 'Увійти' }}
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Form, FormField } from '@/shared/ui';
import { useAuth } from '@/features/auth/model/useAuth';

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
