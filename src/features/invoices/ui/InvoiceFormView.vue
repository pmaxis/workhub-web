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
        {{ isEdit ? 'Edit invoice' : 'New invoice' }}
      </h2>

      <Form class="mt-5 space-y-4" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>

        <FormField
          v-model="number"
          label="Number (optional — auto if empty)"
          id="inv-number"
          type="text"
          autocomplete="off"
        />
        <FormField v-model="title" label="Title" id="inv-title" type="text" />
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField v-model="amount" label="Amount" id="inv-amount" type="number" step="0.01" min="0" required />
          <FormField v-model="currency" label="Currency" id="inv-currency" type="text" maxlength="3" />
        </div>
        <FormField
          v-model="status"
          label="Status"
          id="inv-status"
          as="select"
          :options="statusOptions"
        />
        <FormField
          v-model="projectId"
          label="Project"
          id="inv-project"
          as="select"
          :options="projectOptions"
        />
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField v-model="issuedAt" label="Issued date" id="inv-issued" type="date" />
          <FormField v-model="dueAt" label="Due date" id="inv-due" type="date" />
        </div>
        <FormField v-model="notes" label="Notes" id="inv-notes" as="textarea" rows="3" />

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
import { useInvoiceForm } from '@/features/invoices/model/useInvoiceForm';

const {
  isEdit,
  number,
  title,
  amount,
  currency,
  status,
  projectId,
  issuedAt,
  dueAt,
  notes,
  projectOptions,
  statusOptions,
  saving,
  formError,
  loadError,
  backTo,
  submit,
  cancel,
} = useInvoiceForm();
</script>
