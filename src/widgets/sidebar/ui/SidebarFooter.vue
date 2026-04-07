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
    <button
      ref="notificationsButtonRef"
      type="button"
      class="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-300/40 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none"
      aria-label="Notifications"
      @click="$emit('notifications')"
    >
      <Icon name="bell" size="md" />
      <span
        v-if="unreadCount && unreadCount > 0"
        class="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white"
        aria-label="Unread notifications"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Avatar, Icon } from '@/shared/ui';

withDefaults(
  defineProps<{
    userInitials: string;
    isUserMenuOpen: boolean;
    unreadCount?: number;
  }>(),
  { unreadCount: 0 },
);

defineEmits<{
  'toggle-menu': [];
  notifications: [];
}>();

const buttonRef = ref<HTMLElement | null>(null);
const notificationsButtonRef = ref<HTMLElement | null>(null);

defineExpose({ buttonRef, notificationsButtonRef });
</script>
