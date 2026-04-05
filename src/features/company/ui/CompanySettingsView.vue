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
        <p v-if="deleteError" class="mt-2 text-sm text-red-600">{{ deleteError }}</p>
        <ul class="mt-3 space-y-3">
          <li
            v-for="c in companies"
            :key="c.id"
            class="rounded-lg border border-zinc-200 bg-white px-4 py-3"
          >
            <template v-if="editingId === c.id">
              <Form class="space-y-3" @submit.prevent="saveEdit">
                <FormField
                  v-model="editName"
                  label="Назва компанії"
                  :id="`company-edit-${c.id}`"
                  type="text"
                  required
                  autocomplete="organization"
                />
                <p v-if="updateError" class="text-sm text-red-600">{{ updateError }}</p>
                <div class="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="secondary" :disabled="updating" @click="cancelEdit">
                    Скасувати
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    :disabled="updating || editName.trim().length < 2"
                  >
                    {{ updating ? 'Збереження…' : 'Зберегти' }}
                  </Button>
                </div>
              </Form>
            </template>
            <div v-else class="flex items-center justify-between gap-3 py-1">
              <div class="min-w-0 flex-1 text-left">
                <span class="font-medium text-zinc-900">{{ c.name }}</span>
                <span class="mt-0.5 block text-sm text-zinc-500">{{ c.slug }}</span>
              </div>
              <Dropdown :aria-label="`Дії: ${c.name}`">
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  @click="startEdit(c)"
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  @click="confirmRemoveCompany(c)"
                >
                  Видалити
                </button>
              </Dropdown>
            </div>
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
import { Button, Dropdown, Form, FormField } from '@/shared/ui';
import { useCompanySettings } from '@/features/company/model/useCompanySettings';

const {
  companies,
  loading,
  name,
  creating,
  createError,
  hasCompany,
  createCompany,
  editingId,
  editName,
  updating,
  updateError,
  deleteError,
  startEdit,
  cancelEdit,
  saveEdit,
  confirmRemoveCompany,
} = useCompanySettings();
</script>
