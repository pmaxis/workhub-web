import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type Expense = {
  id: string;
  userId: string;
  projectId: string | null;
  description: string;
  category: string | null;
  amount: string;
  currency: string;
  spentAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListExpensesParams = {
  page?: number;
  limit?: number;
  projectId?: string;
  category?: string;
  from?: string;
  to?: string;
};

export type CreateExpensePayload = {
  description: string;
  category?: string;
  amount: number;
  currency?: string;
  projectId?: string;
  spentAt: string;
  notes?: string;
};

export type UpdateExpensePayload = {
  description?: string;
  category?: string | null;
  amount?: number;
  currency?: string;
  projectId?: string | null;
  spentAt?: string;
  notes?: string | null;
};

function listQuery(params?: ListExpensesParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.projectId) q.set('projectId', params.projectId);
  if (params?.category) q.set('category', params.category);
  if (params?.from) q.set('from', params.from);
  if (params?.to) q.set('to', params.to);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const expensesApi = {
  list: (params?: ListExpensesParams) =>
    apiClient.get<PaginatedResponse<Expense>>(`/expenses${listQuery(params)}`),

  get: (id: string) => apiClient.get<Expense>(`/expenses/${id}`),

  create: (body: CreateExpensePayload) => apiClient.post<Expense>('/expenses', body),

  update: (id: string, body: UpdateExpensePayload) =>
    apiClient.patch<Expense>(`/expenses/${id}`, body),

  remove: (id: string) => apiClient.delete(`/expenses/${id}`),
};
