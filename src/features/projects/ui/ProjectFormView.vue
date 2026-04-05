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
        {{ isEdit ? 'Edit project' : 'New project' }}
      </h2>
      <p class="mt-1 text-sm text-zinc-600">Name and description for your project.</p>

      <Form class="mt-5" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>
        <FormField v-model="name" label="Name" id="name" type="text" required />
        <FormField v-model="description" label="Description" as="textarea" id="description" rows="4" />
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="saving" @click="cancel">
            Cancel
          </Button>
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
import { useProjectForm } from '@/features/projects/model/useProjectForm';

const { isEdit, name, description, saving, formError, loadError, backTo, submit, cancel } =
  useProjectForm();
</script>
