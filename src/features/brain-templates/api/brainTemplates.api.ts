import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type BrainTemplate = {
  id: string;
  userId: string;
  taskId: string | null;
  title: string;
  body: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListBrainTemplatesParams = {
  page?: number;
  limit?: number;
  taskId?: string;
  q?: string;
};

export type CreateBrainTemplatePayload = {
  title: string;
  body: string;
  tags?: string;
  taskId?: string;
};

export type UpdateBrainTemplatePayload = {
  title?: string;
  body?: string;
  tags?: string | null;
  taskId?: string | null;
};

function listQuery(params?: ListBrainTemplatesParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.taskId) q.set('taskId', params.taskId);
  if (params?.q?.trim()) q.set('q', params.q.trim());
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const brainTemplatesApi = {
  list: (params?: ListBrainTemplatesParams) =>
    apiClient.get<PaginatedResponse<BrainTemplate>>(`/brain-templates${listQuery(params)}`),

  get: (id: string) => apiClient.get<BrainTemplate>(`/brain-templates/${id}`),

  create: (body: CreateBrainTemplatePayload) => apiClient.post<BrainTemplate>('/brain-templates', body),

  update: (id: string, body: UpdateBrainTemplatePayload) =>
    apiClient.patch<BrainTemplate>(`/brain-templates/${id}`, body),

  remove: (id: string) => apiClient.delete(`/brain-templates/${id}`),
};
