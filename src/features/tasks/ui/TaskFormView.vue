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
        {{ isEdit ? 'Edit task' : 'New task' }}
      </h2>

      <Form class="mt-5" @submit.prevent="submit">
        <p v-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>
        <FormField
          v-model="selectedProjectId"
          label="Project"
          as="select"
          id="projectId"
          select-placeholder="Select a project"
          :options="projectSelectOptions"
          required
          :disabled="isEdit"
        />
        <FormField v-model="title" label="Title" id="title" type="text" required />
        <FormField v-model="description" label="Description" as="textarea" id="description" rows="3" />
        <FormField
          v-model="status"
          label="Status"
          as="select"
          id="status"
          :options="statusSelectOptions"
        />
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="saving" @click="cancel">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="saving || !!loadError || !projects.length"
          >
            {{ saving ? 'Saving…' : 'Save' }}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button, Form, FormField, Icon } from '@/shared/ui';
import { useTaskForm } from '@/features/tasks/model/useTaskForm';
import { KANBAN_COLUMNS } from '@/features/tasks/model/useTasksKanban';

const {
  isEdit,
  projects,
  selectedProjectId,
  title,
  description,
  status,
  saving,
  formError,
  loadError,
  backTo,
  submit,
  cancel,
} = useTaskForm();

const projectSelectOptions = computed(() =>
  projects.value.map((p) => ({ value: p.id, label: p.name })),
);

const statusSelectOptions = KANBAN_COLUMNS.map((c) => ({
  value: c.status,
  label: c.title,
}));
</script>
