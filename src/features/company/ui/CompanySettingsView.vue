<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Company settings</h1>
    </div>

    <div v-if="loading" class="text-sm text-zinc-500">Loading…</div>

    <template v-else>
      <div
        v-if="hasCompany"
        class="rounded-xl border border-zinc-200 bg-zinc-50 p-6"
      >
        <h2 class="text-base font-medium text-zinc-900">Your companies</h2>
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
                  label="Company name"
                  :id="`company-edit-${c.id}`"
                  type="text"
                  required
                  autocomplete="organization"
                />
                <p v-if="updateError" class="text-sm text-red-600">{{ updateError }}</p>
                <div class="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="secondary" :disabled="updating" @click="cancelEdit">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    :disabled="updating || editName.trim().length < 2"
                  >
                    {{ updating ? 'Saving…' : 'Save' }}
                  </Button>
                </div>
              </Form>
            </template>
            <div v-else class="flex items-center justify-between gap-3 py-1">
              <div class="min-w-0 flex-1 text-left">
                <span class="font-medium text-zinc-900">{{ c.name }}</span>
                <span class="mt-0.5 block text-sm text-zinc-500">{{ c.slug }}</span>
              </div>
              <Dropdown :aria-label="`Actions: ${c.name}`">
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                  @click="startEdit(c)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  @click="promptDeleteCompany(c)"
                >
                  Delete
                </button>
              </Dropdown>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 class="text-base font-medium text-zinc-900">Create company</h2>
        <Form class="mt-5" @submit.prevent="createCompany">
          <FormField
            v-model="name"
            label="Company name"
            id="company-name"
            type="text"
            required
            autocomplete="organization"
            placeholder="e.g. Acme LLC"
          />
          <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
          <div class="mt-4 flex justify-end">
            <Button type="submit" variant="primary" :disabled="creating || name.trim().length < 2">
              {{ creating ? 'Creating…' : 'Create company' }}
            </Button>
          </div>
        </Form>
      </div>
    </template>

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDeleteCompany">
      <template #message>
        company “{{ deleteTarget?.name }}” (members will be unlinked; projects will no longer be tied to it)
      </template>
    </ConfirmDeleteModal>
  </div>
</template>

<script setup lang="ts">
import { Button, ConfirmDeleteModal, Dropdown, Form, FormField } from '@/shared/ui';
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
  deleteTarget,
  startEdit,
  cancelEdit,
  saveEdit,
  promptDeleteCompany,
  confirmDeleteCompany,
} = useCompanySettings();
</script>
