<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="{ name: 'invitations' }"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <Icon name="chevron-left" />
        Назад
      </router-link>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div>
        <h2 class="text-base font-medium text-zinc-900">Нове запрошення</h2>
        <p class="mt-1 text-sm text-zinc-600">Запросити клієнта на реєстрацію в системі.</p>
      </div>

      <Form class="mt-5" @submit.prevent="createInvitation">
        <FormField
          v-model="newEmail"
          label="Email"
          id="email"
          type="email"
          required
          autocomplete="email"
          placeholder="email@example.com"
        />
        <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="creating" @click="cancel">
            Скасувати
          </Button>
          <Button type="submit" variant="primary" :disabled="creating">
            {{ creating ? 'Створення…' : 'Запросити' }}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Form, FormField, Icon } from '@/shared/ui';
import { useInvitationCreate } from '@/features/invitations/model/useInvitationCreate';

const { newEmail, creating, createError, createInvitation, cancel } = useInvitationCreate();
</script>
