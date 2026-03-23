import { apiClient } from '@/shared/api/client';
import type { LoginPayload, LoginResponse, RegisterPayload } from '../model/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.postWithCredentials<LoginResponse>('/auth/login', payload),
  register: (payload: RegisterPayload) =>
    apiClient.postWithCredentials<LoginResponse>('/auth/register', payload),
  refresh: () => apiClient.postWithCredentials<LoginResponse>('/auth/refresh'),
  logout: () => apiClient.postWithCredentials('/auth/logout'),
};
