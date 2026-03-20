import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { config } from '@/shared/config/env';

type AuthTokenGetter = () => string | null;

type ApiRequestConfig = AxiosRequestConfig & {
  token?: string | null;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly body?: string;

  constructor(message: string, status: number, code?: string, body?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.body = body;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isServerUnavailable(): boolean {
    return this.status === 0 || this.status === 503;
  }
}

let authGetter: AuthTokenGetter | null = null;

export function setAuthGetter(fn: AuthTokenGetter): void {
  authGetter = fn;
}

const http = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

http.interceptors.request.use((cfg: InternalAxiosRequestConfig & ApiRequestConfig) => {
  const token =
    cfg.token !== undefined && cfg.token !== null ? cfg.token : (authGetter?.() ?? null);
  if (token && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    const err = error as AxiosError<unknown>;
    const status = err.response?.status ?? (err.code === 'ERR_NETWORK' ? 503 : 0);
    const data = err.response?.data;
    const body = typeof data === 'string' ? data : JSON.stringify(data ?? '');
    let message = body;
    let code: string | undefined;
    if (data && typeof data === 'object') {
      const obj = data as { message?: string; error?: string; code?: string };
      message = obj.message ?? obj.error ?? body;
      code = obj.code;
    }
    throw new ApiError(message || (err as Error).message || `HTTP ${status}`, status, code, body);
  },
);

async function request<T>(path: string, options: ApiRequestConfig = {}): Promise<T> {
  const { token, ...rest } = options;
  const requestConfig: ApiRequestConfig = { ...rest, url: path, token };
  const res = await http.request<T>(requestConfig as AxiosRequestConfig);
  if (res.status === 204 || res.data === undefined) {
    return undefined as T;
  }
  return res.data as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: 'GET', token }),

  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', data: body, token }),

  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: 'PATCH', data: body, token }),

  delete: <T>(path: string, token?: string | null) => request<T>(path, { method: 'DELETE', token }),

  postWithCredentials: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', data: body, withCredentials: true }),
};
