import { apiClient } from '@/shared/api/client';
import type { Notification, PaginatedNotifications } from '@/entities/notification/types';

export type QueryNotifications = {
  page?: number;
  limit?: number;
  isRead?: boolean;
};

export const notificationsApi = {
  list: (query: QueryNotifications = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.isRead !== undefined) params.set('isRead', String(query.isRead));
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<PaginatedNotifications>(`/notifications${suffix}`);
  },
  unreadCount: () => apiClient.get<{ unreadCount: number }>('/notifications/unread-count'),
  markRead: (id: string) => apiClient.patch<void>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch<{ updated: number }>('/notifications/read-all'),
  create: (payload: Pick<Notification, 'userId' | 'type' | 'title' | 'body' | 'data'>) =>
    apiClient.post<Notification>('/notifications', payload),
};

