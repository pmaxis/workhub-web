import { apiClient } from '@/shared/api/client';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  /** ISO 8601 date-time or null when no due date is set. */
  dueAt: string | null;
  projectId: string;
  assigneeId: string;
  /** Total seconds logged by the current user on this task (includes running timer). */
  trackedDurationSeconds: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
  dueAt?: string;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueAt?: string | null;
};

function listUrl(projectId?: string, dueFrom?: string, dueTo?: string): string {
  const q = new URLSearchParams();
  if (projectId) q.set('projectId', projectId);
  if (dueFrom) q.set('dueFrom', dueFrom.slice(0, 10));
  if (dueTo) q.set('dueTo', dueTo.slice(0, 10));
  const s = q.toString();
  return s ? `/tasks?${s}` : '/tasks';
}

export const tasksApi = {
  list: (projectId?: string, dueFrom?: string, dueTo?: string) =>
    apiClient
      .get<Task[]>(listUrl(projectId, dueFrom, dueTo))
      .then((res) => (Array.isArray(res) ? res : [])),

  get: (id: string) => apiClient.get<Task>(`/tasks/${id}`),

  create: (body: CreateTaskPayload) => apiClient.post<Task>('/tasks', body),

  update: (id: string, body: UpdateTaskPayload) =>
    apiClient.patch<Task>(`/tasks/${id}`, body),

  remove: (id: string) => apiClient.delete(`/tasks/${id}`),
};
