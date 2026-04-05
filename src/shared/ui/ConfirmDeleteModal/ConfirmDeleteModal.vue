<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-[2px]"
    @click.self="$emit('update:modelValue', null)"
  >
    <div
      class="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <p id="confirm-delete-title" class="text-base font-semibold text-zinc-900">
        Are you sure you want to delete <slot name="message" />?
      </p>
      <p class="mt-2 text-xs text-zinc-500">
        You can undo this from the notification for a few seconds after you confirm.
      </p>
      <div class="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" @click="$emit('update:modelValue', null)">
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          size="sm"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ loading ? '…' : 'Delete' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue';

withDefaults(
  defineProps<{
    modelValue: unknown;
    loading?: boolean;
  }>(),
  { loading: false },
);

defineEmits<{
  (e: 'update:modelValue', value: null): void;
  (e: 'confirm'): void;
}>();
</script>
