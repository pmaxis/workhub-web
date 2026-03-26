<template>
  <div
    v-if="isOpen && user"
    ref="panelRef"
    class="absolute bottom-full left-2 right-2 z-30 mb-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
    role="menu"
  >
    <div class="flex items-center gap-3 border-b border-zinc-200 p-3">
      <Avatar :initials="userInitials" size="md" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-zinc-900">
          {{ userPib || user.email }}
        </p>
        <p class="truncate text-xs text-zinc-600">
          {{ user.email }}
        </p>
      </div>
    </div>

    <div class="p-2">
      <Link
        :to="{ name: 'myAccount' }"
        class="block w-full rounded-lg px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none"
      >
        Мій акаунт
      </Link>
    </div>

    <div class="border-t border-zinc-200 p-3">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 focus:outline-none"
        @click="$emit('logout')"
      >
        Вийти
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '@/entities/user/types';
import { Avatar, Link } from '@/shared/ui';

defineProps<{
  user: User | null;
  userPib: string;
  userInitials: string;
  isOpen: boolean;
}>();

defineEmits<{
  logout: [];
}>();

const panelRef = ref<HTMLElement | null>(null);

defineExpose({ panelRef });
</script>
