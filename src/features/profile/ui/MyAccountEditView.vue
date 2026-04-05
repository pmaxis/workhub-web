<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3">
      <router-link
        :to="{ name: 'myAccount' }"
        class="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <Icon name="chevron-left" />
        Back
      </router-link>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div>
        <h2 class="text-base font-medium text-zinc-900">Edit account</h2>
        <p class="mt-1 text-sm text-zinc-600">Update your name, email, and password.</p>
      </div>

      <Form class="mt-5" @submit.prevent="submitProfile">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField v-model="form.lastName" label="Last name" id="lastName" type="text" required />
          <FormField v-model="form.firstName" label="First name" id="firstName" type="text" required />
          <FormField v-model="form.thirdName" label="Middle name" id="thirdName" type="text" />
          <FormField v-model="form.email" label="Email" id="email" type="email" required />
          <div class="md:col-span-2">
            <FormField
              v-model="form.password"
              id="password"
              type="password"
              minlength="8"
              placeholder="At least 8 characters"
            >
              <template #label> New password (leave blank to keep current) </template>
            </FormField>
          </div>
        </div>
        <p v-if="profileError" class="text-sm text-red-600">{{ profileError }}</p>
        <div class="flex justify-end gap-2">
          <Button type="button" variant="ghost" :disabled="profileSaving" @click="cancel">
            Cancel
          </Button>
          <Button type="submit" variant="primary" :disabled="profileSaving">
            {{ profileSaving ? 'Saving…' : 'Save' }}
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
