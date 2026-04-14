import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type KnowledgeArticle = {
  id: string;
  userId: string;
  taskId: string | null;
  title: string;
  body: string;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListKnowledgeArticlesParams = {
  page?: number;
  limit?: number;
  taskId?: string;
  q?: string;
};

export type CreateKnowledgeArticlePayload = {
  title: string;
  body: string;
  tags?: string;
  taskId?: string;
};

export type UpdateKnowledgeArticlePayload = {
  title?: string;
  body?: string;
  tags?: string | null;
  taskId?: string | null;
};

function listQuery(params?: ListKnowledgeArticlesParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.taskId) q.set('taskId', params.taskId);
  if (params?.q?.trim()) q.set('q', params.q.trim());
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const knowledgeArticlesApi = {
  list: (params?: ListKnowledgeArticlesParams) =>
    apiClient.get<PaginatedResponse<KnowledgeArticle>>(`/knowledge-articles${listQuery(params)}`),

  get: (id: string) => apiClient.get<KnowledgeArticle>(`/knowledge-articles/${id}`),

  create: (body: CreateKnowledgeArticlePayload) =>
    apiClient.post<KnowledgeArticle>('/knowledge-articles', body),

  update: (id: string, body: UpdateKnowledgeArticlePayload) =>
    apiClient.patch<KnowledgeArticle>(`/knowledge-articles/${id}`, body),

  remove: (id: string) => apiClient.delete(`/knowledge-articles/${id}`),
};
