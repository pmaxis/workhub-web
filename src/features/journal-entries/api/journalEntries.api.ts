import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse } from '@/features/projects';

export type JournalEntry = {
  id: string;
  userId: string;
  entryDate: string;
  title: string | null;
  body: string;
  mood: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListJournalEntriesParams = {
  page?: number;
  limit?: number;
  q?: string;
  from?: string;
  to?: string;
};

export type CreateJournalEntryPayload = {
  entryDate: string;
  title?: string;
  body: string;
  mood?: string;
};

export type UpdateJournalEntryPayload = {
  entryDate?: string;
  title?: string | null;
  body?: string;
  mood?: string | null;
};

function listQuery(params?: ListJournalEntriesParams): string {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.q?.trim()) q.set('q', params.q.trim());
  if (params?.from?.trim()) q.set('from', params.from.trim());
  if (params?.to?.trim()) q.set('to', params.to.trim());
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export const journalEntriesApi = {
  list: (params?: ListJournalEntriesParams) =>
    apiClient.get<PaginatedResponse<JournalEntry>>(`/journal-entries${listQuery(params)}`),

  get: (id: string) => apiClient.get<JournalEntry>(`/journal-entries/${id}`),

  create: (body: CreateJournalEntryPayload) => apiClient.post<JournalEntry>('/journal-entries', body),

  update: (id: string, body: UpdateJournalEntryPayload) =>
    apiClient.patch<JournalEntry>(`/journal-entries/${id}`, body),

  remove: (id: string) => apiClient.delete(`/journal-entries/${id}`),
};
