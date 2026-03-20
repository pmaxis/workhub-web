<template>
  <div class="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 p-3">
    <button
      ref="buttonRef"
      type="button"
      class="rounded-full p-0.5 focus:outline-none hover:ring-2 hover:ring-zinc-400"
      aria-haspopup="true"
      :aria-expanded="isUserMenuOpen"
      @click="$emit('toggle-menu')"
    >
      <Avatar :initials="userInitials" size="md" />
    </button>
    <button
      type="button"
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none"
      aria-label="Вийти"
      @click="$emit('logout')"
    >
      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Avatar } from '@/shared/ui';

defineProps<{
  userInitials: string;
  isUserMenuOpen: boolean;
}>();

defineEmits<{
  'toggle-menu': [];
  logout: [];
}>();

const buttonRef = ref<HTMLElement | null>(null);

defineExpose({ buttonRef });
</script>
