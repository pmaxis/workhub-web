<template>
  <div
    ref="panelRef"
    class="absolute bottom-full left-2 right-2 z-30 mb-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
    role="menu"
    aria-label="Notifications"
  >
    <div class="flex items-center justify-between border-b border-zinc-200 px-3 py-3">
      <div class="min-w-0">
        <div class="text-sm font-semibold text-zinc-900">Notifications</div>
      </div>
      <Dropdown no-highlight icon="gear" aria-label="Notifications menu">
        <button
          type="button"
          role="menuitem"
          class="block w-full cursor-pointer px-3 py-2 text-left text-sm text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="unreadCount === 0"
          @click="markAllRead"
        >
          Mark all read
        </button>
      </Dropdown>
    </div>

    <div v-if="loading" class="px-3 py-4 text-sm text-zinc-500">Loading…</div>
    <div v-else-if="error" class="px-3 py-3 text-sm text-red-700">{{ error }}</div>
    <div v-else-if="notifications.length === 0" class="px-3 py-4 text-sm text-zinc-500">
      No notifications yet.
    </div>
    <ul v-else class="max-h-[200px] divide-y divide-zinc-100 overflow-auto">
      <li v-for="n in notifications" :key="n.id">
        <div class="px-3 py-3 hover:bg-zinc-50">
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div v-if="n.body" class="mt-0.5">
                  <button
                    type="button"
                    class="block w-full cursor-pointer text-left focus:outline-none"
                    :aria-expanded="isExpanded(n.id)"
                    title="Click to expand/collapse"
                    @click.stop="toggleExpanded(n.id)"
                  >
                    <p
                      class="text-sm text-zinc-600"
                      :class="
                        isExpanded(n.id) ? 'whitespace-pre-wrap wrap-break-word' : 'line-clamp-1'
                      "
                    >
                      {{ n.body }}
                    </p>
                  </button>
                </div>
                <p v-else class="line-clamp-1 text-xs font-medium text-zinc-800">
                  {{ n.title }}
                </p>
                <p class="mt-1 text-xs text-zinc-500">
                  {{ formatDate(n.createdAt) }}
                </p>
              </div>

              <Dropdown no-highlight>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full cursor-pointer px-3 py-2 text-left text-sm text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="n.isRead"
                  @click="markRead(n.id)"
                >
                  Mark read
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dropdown } from '@/shared/ui';
import { useNotificationsList } from '@/features/notifications/model/useNotificationsList';

const { notifications, unreadCount, loading, error, formatDate, markRead, markAllRead } =
  useNotificationsList();

defineProps<{ userInitials: string }>();

const expandedIds = ref<Set<string>>(new Set());

function isExpanded(id: string): boolean {
  return expandedIds.value.has(id);
}

function toggleExpanded(id: string): void {
  const next = new Set(expandedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedIds.value = next;
}

const panelRef = ref<HTMLElement | null>(null);
defineExpose({ panelRef });
</script>

