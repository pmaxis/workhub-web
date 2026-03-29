import { apiClient } from '@/shared/api/client';

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  tasksCount?: number;
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string | null;
};

export const projectsApi = {
  list: () =>
    apiClient.get<Project[]>('/projects').then((res) => (Array.isArray(res) ? res : [])),

  get: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (body: CreateProjectPayload) => apiClient.post<Project>('/projects', body),

  update: (id: string, body: UpdateProjectPayload) =>
    apiClient.patch<Project>(`/projects/${id}`, body),

  remove: (id: string) => apiClient.delete(`/projects/${id}`),
};
