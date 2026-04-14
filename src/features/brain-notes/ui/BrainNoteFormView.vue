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
        {{ isEdit ? 'Edit note' : 'New note' }}
      </h2>

      <Form class="mt-5 space-y-4" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>

        <FormField v-model="title" label="Title" id="bn-title" type="text" required />
        <FormField
          v-model="body"
          label="Content"
          id="bn-body"
          as="textarea"
          rows="12"
          placeholder="Markdown or plain text…"
        />
        <FormField v-model="tags" label="Tags" id="bn-tags" type="text" placeholder="comma-separated" />
        <FormField
          v-model="taskId"
          label="Task"
          id="bn-task"
          as="select"
          :options="taskOptions"
        />

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
import { useBrainNoteForm } from '@/features/brain-notes/model/useBrainNoteForm';

const {
  isEdit,
  title,
  body,
  tags,
  taskId,
  taskOptions,
  saving,
  formError,
  loadError,
  backTo,
  submit,
  cancel,
} = useBrainNoteForm();
</script>
