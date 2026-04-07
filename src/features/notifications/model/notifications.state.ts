import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { notificationsApi } from '@/features/notifications/api/notifications.api';

const unreadCount = ref<number>(0);
const loadedOnce = ref(false);

let pollTimer: number | null = null;

export function useNotificationsIndicator() {
  async function refreshUnreadCount(): Promise<void> {
    const res = await notificationsApi.unreadCount();
    unreadCount.value = res.unreadCount;
    loadedOnce.value = true;
  }

  function startPolling(intervalMs = 30_000): void {
    if (pollTimer !== null) return;
    pollTimer = window.setInterval(() => {
      void refreshUnreadCount();
    }, intervalMs);
  }

  function stopPolling(): void {
    if (pollTimer === null) return;
    window.clearInterval(pollTimer);
    pollTimer = null;
  }

  const hasUnread = computed(() => unreadCount.value > 0);

  onMounted(() => {
    if (!loadedOnce.value) {
      void refreshUnreadCount().catch(() => {
        // ignore: indicator should never block UI
      });
    }
    startPolling();
  });

  onBeforeUnmount(() => {
    // keep polling globally; do not stop here
  });

  return {
    unreadCount,
    hasUnread,
    refreshUnreadCount,
    startPolling,
    stopPolling,
  };
}

