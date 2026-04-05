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
      label="Password"
      id="password"
      label-class="text-zinc-600"
      type="password"
      required
      autocomplete="current-password"
      placeholder="••••••••"
    />
    <div class="w-full">
      <Button type="submit" variant="primary" size="md" :disabled="loading" class="w-full">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </Button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Form, FormField } from '@/shared/ui';
import { useAuth } from '@/features/auth/model/useAuth';
import { useToast } from '@/shared/ui/Toast';

const router = useRouter();
const auth = useAuth();
const { success: notifySuccess, error: notifyError } = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await auth.login({ email: email.value, password: password.value });
    notifySuccess('Signed in');
    await router.replace({ name: 'home' });
  } catch (e) {
    notifyError(e instanceof Error ? e.message : 'Sign-in failed');
  } finally {
    loading.value = false;
  }
}
</script>
