import { apiClient } from '@/shared/api/client';

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
  tasksCount?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type ListProjectsParams = {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
  companyId?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string | null;
};

export const projectsApi = {
  list: (params?: ListProjectsParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.companyId) query.set('companyId', params.companyId);
    const qs = query.toString();
    return apiClient.get<PaginatedResponse<Project>>(`/projects${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (body: CreateProjectPayload) => apiClient.post<Project>('/projects', body),

  update: (id: string, body: UpdateProjectPayload) =>
    apiClient.patch<Project>(`/projects/${id}`, body),

  remove: (id: string) => apiClient.delete(`/projects/${id}`),
};
