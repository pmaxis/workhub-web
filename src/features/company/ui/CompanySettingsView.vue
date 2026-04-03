<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Налаштування компанії</h1>
      <p class="mt-1 text-zinc-600">Створіть компанію, щоб керувати співробітниками та запрошеннями.</p>
    </div>

    <div v-if="loading" class="text-sm text-zinc-500">Завантаження…</div>

    <template v-else>
      <div
        v-if="hasCompany"
        class="rounded-xl border border-zinc-200 bg-zinc-50 p-6"
      >
        <h2 class="text-base font-medium text-zinc-900">Ваші компанії</h2>
        <ul class="mt-3 space-y-2">
          <li
            v-for="c in companies"
            :key="c.id"
            class="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3"
          >
            <span class="font-medium text-zinc-900">{{ c.name }}</span>
            <span class="text-sm text-zinc-500">{{ c.slug }}</span>
          </li>
        </ul>
      </div>

      <div v-else class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 class="text-base font-medium text-zinc-900">Створити компанію</h2>
        <p class="mt-1 text-sm text-zinc-600">
          Після створення з’явиться розділ «Співробітники» в меню зліва.
        </p>
        <Form class="mt-5" @submit.prevent="createCompany">
          <FormField
            v-model="name"
            label="Назва компанії"
            id="company-name"
            type="text"
            required
            autocomplete="organization"
            placeholder="Наприклад, ТОВ «Ваша фірма»"
          />
          <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
          <div class="mt-4 flex justify-end">
            <Button type="submit" variant="primary" :disabled="creating || name.trim().length < 2">
              {{ creating ? 'Створення…' : 'Створити компанію' }}
            </Button>
          </div>
        </Form>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Button, Form, FormField } from '@/shared/ui';
import { useCompanySettings } from '@/features/company/model/useCompanySettings';

const {
  companies,
  loading,
  name,
  creating,
  createError,
  hasCompany,
  createCompany,
} = useCompanySettings();
</script>
