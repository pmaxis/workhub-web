<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="backTo"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <Icon name="chevron-left" />
        Back
      </router-link>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <h2 class="text-base font-medium text-zinc-900">
        {{ isEdit ? 'Edit expense' : 'New expense' }}
      </h2>

      <Form class="mt-5 space-y-4" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>

        <FormField v-model="description" label="Description" id="ex-desc" type="text" required />
        <FormField v-model="category" label="Category" id="ex-cat" type="text" />
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField v-model="amount" label="Amount" id="ex-amount" type="number" step="0.01" min="0" required />
          <FormField v-model="currency" label="Currency" id="ex-currency" type="text" maxlength="3" />
        </div>
        <FormField
          v-model="projectId"
          label="Project"
          id="ex-project"
          as="select"
          :options="projectOptions"
        />
        <FormField v-model="spentAt" label="Spent on" id="ex-spent" type="date" required />
        <FormField v-model="notes" label="Notes" id="ex-notes" as="textarea" rows="3" />

        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="saving" @click="cancel">Cancel</Button>
          <Button type="submit" variant="primary" :disabled="saving || !!loadError">
            {{ saving ? 'Saving…' : 'Save' }}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Form, FormField, Icon } from '@/shared/ui';
import { useExpenseForm } from '@/features/expenses/model/useExpenseForm';

const {
  isEdit,
  description,
  category,
  amount,
  currency,
  projectId,
  spentAt,
  notes,
  projectOptions,
  saving,
  formError,
  loadError,
  backTo,
  submit,
  cancel,
} = useExpenseForm();
</script>
