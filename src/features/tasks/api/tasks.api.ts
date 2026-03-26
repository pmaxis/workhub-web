import { apiClient } from '@/shared/api/client';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  projectId: string;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
};

function listUrl(projectId?: string): string {
  if (!projectId) return '/tasks';
  return `/tasks?projectId=${encodeURIComponent(projectId)}`;
}

export const tasksApi = {
  list: (projectId?: string) =>
    apiClient.get<Task[]>(listUrl(projectId)).then((res) => (Array.isArray(res) ? res : [])),

  get: (id: string) => apiClient.get<Task>(`/tasks/${id}`),

  create: (body: CreateTaskPayload) => apiClient.post<Task>('/tasks', body),

  update: (id: string, body: UpdateTaskPayload) =>
    apiClient.patch<Task>(`/tasks/${id}`, body),

  remove: (id: string) => apiClient.delete(`/tasks/${id}`),
};
