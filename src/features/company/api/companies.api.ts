import { apiClient } from '@/shared/api/client';

export type Company = {
  id: string;
  name: string;
  slug: string;
};

export const companiesApi = {
  list: () => apiClient.get<Company[]>('/companies'),
  create: (payload: { name: string }) => apiClient.post<Company>('/companies', payload),
  update: (id: string, payload: { name: string }) =>
    apiClient.patch<Company>(`/companies/${encodeURIComponent(id)}`, payload),
  remove: (id: string) => apiClient.delete(`/companies/${encodeURIComponent(id)}`),
};
