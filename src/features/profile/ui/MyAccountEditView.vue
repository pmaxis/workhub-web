<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="{ name: 'myAccount' }"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <Icon name="chevron-left" />
        Назад
      </router-link>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div>
        <h2 class="text-base font-medium text-zinc-900">Редагування акаунта</h2>
        <p class="mt-1 text-sm text-zinc-600">Змініть ПІБ, email та пароль.</p>
      </div>

      <Form class="mt-5" @submit.prevent="submitProfile">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField v-model="form.lastName" label="Прізвище" id="lastName" type="text" required />
          <FormField v-model="form.firstName" label="Ім'я" id="firstName" type="text" required />
          <FormField v-model="form.thirdName" label="По батькові" id="thirdName" type="text" />
          <FormField v-model="form.email" label="Email" id="email" type="email" required />
          <div class="md:col-span-2">
            <FormField
              v-model="form.password"
              id="password"
              type="password"
              minlength="8"
              placeholder="Мінімум 8 символів"
            >
              <template #label> Новий пароль (залиште порожнім, щоб не змінювати) </template>
            </FormField>
          </div>
        </div>
        <p v-if="profileError" class="text-sm text-red-600">{{ profileError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="profileSaving" @click="cancel">
            Скасувати
          </Button>
          <Button type="submit" variant="primary" :disabled="profileSaving">
            {{ profileSaving ? 'Збереження…' : 'Зберегти' }}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Form, FormField, Icon } from '@/shared/ui';
import { useMyAccountEdit } from '@/features/profile/model/useMyAccountEdit';

const { form, profileSaving, profileError, submitProfile, cancel } = useMyAccountEdit();
</script>
