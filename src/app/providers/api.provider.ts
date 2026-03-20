import { setAuthGetter } from '@/shared/api/client';
import { useAuth } from '@/features/auth';

export function initApiProvider(): void {
  setAuthGetter(() => useAuth().getToken());
}
