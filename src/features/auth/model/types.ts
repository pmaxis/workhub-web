import type { User } from '@/entities/user/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  thirdName?: string;
  invitationToken?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export type AuthUser = User;
