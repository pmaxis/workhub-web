import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type Payment = {
  id: string;
  userId: string;
  invoiceId: string | null;
  amount: string;
  currency: string;
  receivedAt: string;
  method: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListPaymentsParams = {
  page?: number;
  limit?: number;
  invoiceId?: string;
  from?: string;
  to?: string;
};

export type CreatePaymentPayload = {
  invoiceId?: string;
  amount: number;
  currency?: string;
  receivedAt: string;
  method?: string;
  notes?: string;
};

export type UpdatePaymentPayload = {
  invoiceId?: string | null;
  amount?: number;
  currency?: string;
  receivedAt?: string;
  method?: string | null;
  notes?: string | null;
};

function listQuery(params?: ListPaymentsParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.invoiceId) q.set('invoiceId', params.invoiceId);
  if (params?.from) q.set('from', params.from);
  if (params?.to) q.set('to', params.to);
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const paymentsApi = {
  list: (params?: ListPaymentsParams) =>
    apiClient.get<PaginatedResponse<Payment>>(`/payments${listQuery(params)}`),

  get: (id: string) => apiClient.get<Payment>(`/payments/${id}`),

  create: (body: CreatePaymentPayload) => apiClient.post<Payment>('/payments', body),

  update: (id: string, body: UpdatePaymentPayload) =>
    apiClient.patch<Payment>(`/payments/${id}`, body),

  remove: (id: string) => apiClient.delete(`/payments/${id}`),
};
