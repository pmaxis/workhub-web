import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type BrainNote = {
  id: string;
  userId: string;
  taskId: string | null;
  title: string;
  body: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListBrainNotesParams = {
  page?: number;
  limit?: number;
  taskId?: string;
  q?: string;
};

export type CreateBrainNotePayload = {
  title: string;
  body: string;
  tags?: string;
  taskId?: string;
};

export type UpdateBrainNotePayload = {
  title?: string;
  body?: string;
  tags?: string | null;
  taskId?: string | null;
};

function listQuery(params?: ListBrainNotesParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.taskId) q.set('taskId', params.taskId);
  if (params?.q?.trim()) q.set('q', params.q.trim());
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const brainNotesApi = {
  list: (params?: ListBrainNotesParams) =>
    apiClient.get<PaginatedResponse<BrainNote>>(`/brain-notes${listQuery(params)}`),

  get: (id: string) => apiClient.get<BrainNote>(`/brain-notes/${id}`),

  create: (body: CreateBrainNotePayload) => apiClient.post<BrainNote>('/brain-notes', body),

  update: (id: string, body: UpdateBrainNotePayload) =>
    apiClient.patch<BrainNote>(`/brain-notes/${id}`, body),

  remove: (id: string) => apiClient.delete(`/brain-notes/${id}`),
};
