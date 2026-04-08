import { apiClient } from '@/shared/api/client';

export type TimeEntry = {
  id: string;
  userId: string;
  projectId: string | null;
  taskId: string | null;
  description: string | null;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTimeEntryPayload = {
  startedAt: string;
  endedAt?: string | null;
  projectId?: string;
  taskId?: string;
  description?: string;
};

export type UpdateTimeEntryPayload = {
  startedAt?: string;
  endedAt?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  description?: string | null;
};

export type ListTimeEntriesParams = {
  from?: string;
  to?: string;
  runningOnly?: boolean;
};

function listQuery(params?: ListTimeEntriesParams): string {
  const q = new URLSearchParams();
  if (params?.from) q.set('from', params.from);
  if (params?.to) q.set('to', params.to);
  if (params?.runningOnly) q.set('runningOnly', 'true');
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const timeEntriesApi = {
  list: (params?: ListTimeEntriesParams) =>
    apiClient.get<TimeEntry[]>(`/time-entries${listQuery(params)}`),

  running: () => apiClient.get<TimeEntry | null>(`/time-entries/running`),

  create: (body: CreateTimeEntryPayload) => apiClient.post<TimeEntry>('/time-entries', body),

  update: (id: string, body: UpdateTimeEntryPayload) =>
    apiClient.patch<TimeEntry>(`/time-entries/${id}`, body),

  remove: (id: string) => apiClient.delete(`/time-entries/${id}`),
};
