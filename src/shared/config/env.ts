const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';
const apiVersion = import.meta.env.VITE_API_VERSION ?? 'v1';

function joinBasePath(base: string, segment: string): string {
  const b = base.replace(/\/+$/, '');
  const s = segment.replace(/^\/+/, '');
  return s ? `${b}/${s}` : b;
}

export const config = {
  apiBaseUrl,
  apiVersion,
  apiRequestBaseUrl: joinBasePath(apiBaseUrl, apiVersion),
} as const;
