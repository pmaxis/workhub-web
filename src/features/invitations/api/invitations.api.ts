import { apiClient } from '@/shared/api/client';

export type Invitation = {
  id: string;
  email: string;
  status: string;
  companyId: string | null;
  expiresAt: string;
  createdAt: string;
  token?: string;
};

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

export type ClientItem = {
  id: string;
  email: string;
  fullName: string;
  confirmedAt: string;
};

function buildListUrl(params?: { companyId?: string; status?: InvitationStatus }): string {
  if (!params?.companyId && !params?.status) return '/invitations';
  const search = new URLSearchParams();
  if (params.companyId) search.set('companyId', params.companyId);
  if (params.status) search.set('status', params.status);
  return `/invitations?${search.toString()}`;
}

export const invitationsApi = {
  list: (params?: { companyId?: string; status?: InvitationStatus }) =>
    apiClient.get<Invitation[]>(buildListUrl(params)).then((res) => (Array.isArray(res) ? res : [])),

  listClients: (companyId?: string) =>
    apiClient
      .get<ClientItem[]>(
        companyId ? `/invitations/clients?companyId=${encodeURIComponent(companyId)}` : '/invitations/clients',
      )
      .then((res) => (Array.isArray(res) ? res : [])),

  getByToken: (token: string) =>
    apiClient.get<Invitation | null>(`/invitations/token/${token}`),

  get: (id: string) => apiClient.get<Invitation | null>(`/invitations/${id}`),

  create: (data: { email: string; companyId?: string }) =>
    apiClient.post<Invitation>('/invitations', data),

  resend: (id: string) =>
    apiClient.post<Invitation>(`/invitations/${id}/resend`),

  accept: (id: string) =>
    apiClient.patch<Invitation>(`/invitations/${id}/accept`),

  remove: (id: string) => apiClient.delete(`/invitations/${id}`),
};
