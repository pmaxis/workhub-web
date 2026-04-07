export type NotificationType = 'SYSTEM';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: unknown | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedNotifications = {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
};

