import { onMounted, ref } from 'vue';
import { notificationsApi } from '@/features/notifications/api/notifications.api';
import type { Notification } from '@/entities/notification/types';
import { useToast } from '@/shared/ui/Toast';
import { useNotificationsIndicator } from '@/features/notifications/model/notifications.state';

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function useNotificationsList() {
  const { error: notifyError, success: notifySuccess } = useToast();
  const notifications = ref<Notification[]>([]);
  const { unreadCount, refreshUnreadCount } = useNotificationsIndicator();
  const loading = ref(false);
  const error = ref('');

  async function load() {
    loading.value = true;
    error.value = '';
    try {
      const listRes = await notificationsApi.list({ page: 1, limit: 50 });
      notifications.value = listRes.data;
      await refreshUnreadCount();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load notifications';
      error.value = msg;
      notifyError(msg);
      notifications.value = [];
      unreadCount.value = 0;
    } finally {
      loading.value = false;
    }
  }

  async function markRead(id: string) {
    try {
      await notificationsApi.markRead(id);
      notifications.value = notifications.value.map((n) =>
        n.id === id ? { ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() } : n,
      );
      await refreshUnreadCount();
      notifySuccess('Marked as read');
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : 'Could not update notification');
    }
  }

  async function markAllRead() {
    try {
      await notificationsApi.markAllRead();
      notifications.value = notifications.value.map((n) =>
        n.isRead ? n : { ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() },
      );
      await refreshUnreadCount();
      notifySuccess('All notifications marked as read');
    } catch (e: unknown) {
      notifyError(e instanceof Error ? e.message : 'Could not update notifications');
    }
  }

  onMounted(() => {
    void load();
  });

  return {
    notifications,
    unreadCount,
    loading,
    error,
    formatDate,
    load,
    markRead,
    markAllRead,
  };
}

