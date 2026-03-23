<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="{ name: 'invitations' }"
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
        <h2 class="text-base font-medium text-zinc-900">Нове запрошення</h2>
        <p class="mt-1 text-sm text-zinc-600">
          Запросити клієнта на реєстрацію в системі.
        </p>
      </div>

      <form class="mt-5 space-y-4" @submit.prevent="createInvitation">
        <div>
          <label for="email" class="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Email</label>
          <input
            id="email"
            v-model="newEmail"
            type="email"
            required
            autocomplete="email"
            placeholder="email@example.com"
            class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none placeholder-zinc-400"
          />
        </div>
        <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="creating" @click="router.push({ name: 'invitations' })">
            Скасувати
          </Button>
          <Button type="submit" variant="primary" :disabled="creating">
            {{ creating ? 'Створення…' : 'Запросити' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/shared/ui';
import { invitationsApi } from '@/features/invitations';

const router = useRouter();
const newEmail = ref('');
const creating = ref(false);
const createError = ref('');

async function createInvitation() {
  creating.value = true;
  createError.value = '';
  try {
    await invitationsApi.create({ email: newEmail.value.trim() });
    router.push({ name: 'invitations' });
  } catch (e: unknown) {
    createError.value = e instanceof Error ? e.message : 'Не вдалося створити запрошення';
  } finally {
    creating.value = false;
  }
}
</script>
