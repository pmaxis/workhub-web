<template>
  <div class="rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate text-sm text-zinc-900">{{ session.userAgent || 'Невідомий пристрій' }}</p>
        <p class="mt-1 text-xs text-zinc-500">
          IP: {{ session.ipAddress || '—' }} | Закінчується: {{ expiresLabel }}
        </p>
      </div>
      <Dropdown aria-label="Дії з сесією">
        <button
          type="button"
          role="menuitem"
          class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="deleting"
          @click="emit('remove')"
        >
          {{ deleting ? 'Видалення…' : 'Видалити сесію' }}
        </button>
      </Dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccountSessionItem } from '@/features/profile/model/useMyAccount';
import { Dropdown } from '@/shared/ui';

defineProps<{
  session: AccountSessionItem;
  expiresLabel: string;
  deleting: boolean;
}>();

const emit = defineEmits<{
  remove: [];
}>();
</script>
