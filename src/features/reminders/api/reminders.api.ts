import { apiClient } from '@/shared/api/client';

export type Reminder = {
  id: string;
  title: string;
  notes: string | null;
  remindAt: string;
  taskId: string | null;
  dismissedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedReminders = {
  data: Reminder[];
  total: number;
  page: number;
  limit: number;
};

export type CreateReminderPayload = {
  title: string;
  notes?: string;
  remindAt: string;
  taskId?: string;
};

export type UpdateReminderPayload = {
  title?: string;
  notes?: string | null;
  remindAt?: string;
  taskId?: string | null;
  dismissedAt?: string | null;
};

function encodeQuery(params: Record<string, string | boolean | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const remindersApi = {
  list: (opts?: { page?: number; limit?: number; includeDismissed?: boolean }) =>
    apiClient.get<PaginatedReminders>(
      `/reminders${encodeQuery({
        page: opts?.page,
        limit: opts?.limit,
        ...(opts?.includeDismissed ? { includeDismissed: 'true' } : {}),
      })}`,
    ),

  get: (id: string) => apiClient.get<Reminder>(`/reminders/${id}`),

  create: (body: CreateReminderPayload) => apiClient.post<Reminder>('/reminders', body),

  update: (id: string, body: UpdateReminderPayload) =>
    apiClient.patch<Reminder>(`/reminders/${id}`, body),

  remove: (id: string) => apiClient.delete(`/reminders/${id}`),
};
