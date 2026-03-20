<template>
  <div class="flex shrink-0 items-center justify-between gap-2 p-3 shadow-[0_-1px_3px_0_rgb(0_0_0_/0.08)]">
    <button
      ref="buttonRef"
      type="button"
      class="cursor-pointer rounded-full p-0.5 focus:outline-none focus:ring-0"
      aria-haspopup="true"
      :aria-expanded="isUserMenuOpen"
      @click="$emit('toggle-menu')"
    >
      <Avatar :initials="userInitials" size="sm" />
    </button>
    <div class="flex shrink-0 items-center gap-2">
      <button
        type="button"
        :class="[
          'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors focus:outline-none',
          hasNotifications
            ? 'border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600'
            : 'border-zinc-300/40 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        ]"
        aria-label="Сповіщення"
        @click="$emit('notifications')"
      >
        <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
      <button
        type="button"
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-300/40 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none"
        aria-label="Вийти"
        @click="$emit('logout')"
      >
        <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Avatar } from '@/shared/ui';

withDefaults(
  defineProps<{
    userInitials: string;
    isUserMenuOpen: boolean;
    hasNotifications?: boolean;
  }>(),
  { hasNotifications: false },
);

defineEmits<{
  'toggle-menu': [];
  logout: [];
  notifications: [];
}>();

const buttonRef = ref<HTMLElement | null>(null);

defineExpose({ buttonRef });
</script>
