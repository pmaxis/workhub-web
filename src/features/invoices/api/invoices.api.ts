import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';

export type Invoice = {
  id: string;
  userId: string;
  projectId: string | null;
  number: string;
  title: string | null;
  amount: string;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string | null;
  dueAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListInvoicesParams = {
  page?: number;
  limit?: number;
  projectId?: string;
  status?: InvoiceStatus;
};

export type CreateInvoicePayload = {
  number?: string;
  title?: string;
  amount: number;
  currency?: string;
  status?: InvoiceStatus;
  projectId?: string;
  issuedAt?: string;
  dueAt?: string;
  notes?: string;
};

export type UpdateInvoicePayload = {
  number?: string;
  title?: string | null;
  amount?: number;
  currency?: string;
  status?: InvoiceStatus;
  projectId?: string | null;
  issuedAt?: string | null;
  dueAt?: string | null;
  notes?: string | null;
};

function listQuery(params?: ListInvoicesParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.projectId) q.set('projectId', params.projectId);
  if (params?.status) q.set('status', params.status);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const invoicesApi = {
  list: (params?: ListInvoicesParams) =>
    apiClient.get<PaginatedResponse<Invoice>>(`/invoices${listQuery(params)}`),

  get: (id: string) => apiClient.get<Invoice>(`/invoices/${id}`),

  create: (body: CreateInvoicePayload) => apiClient.post<Invoice>('/invoices', body),

  update: (id: string, body: UpdateInvoicePayload) =>
    apiClient.patch<Invoice>(`/invoices/${id}`, body),

  remove: (id: string) => apiClient.delete(`/invoices/${id}`),
};
