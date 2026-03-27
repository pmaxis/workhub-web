import { computed, onMounted, ref } from 'vue';
import { useAuth } from '@/features/auth';
import { apiClient } from '@/shared/api/client';

export type AccountSessionItem = {
  id: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt?: string;
};

type RawSessionItem = {
  id: string;
  userId?: string;
  user_id?: string;
  ipAddress?: string | null;
  ip_address?: string | null;
  userAgent?: string | null;
  user_agent?: string | null;
  expiresAt?: string;
  expires_at?: string;
};

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function normalizeSession(raw: RawSessionItem): AccountSessionItem {
  return {
    id: raw.id,
    userId: raw.userId ?? raw.user_id ?? '',
    ipAddress: raw.ipAddress ?? raw.ip_address ?? null,
    userAgent: raw.userAgent ?? raw.user_agent ?? null,
    expiresAt: raw.expiresAt ?? raw.expires_at,
  };
}

export function useMyAccount() {
  const auth = useAuth();
  const loading = ref(false);
  const error = ref('');
  const sessions = ref<AccountSessionItem[]>([]);
  const deletingSessionId = ref<string | null>(null);

  const fullName = computed(() => {
    const u = auth.user;
    if (!u) return '';
    return [u.lastName, u.firstName, u.thirdName].filter(Boolean).join(' ');
  });

  async function loadSessions() {
    if (!auth.user?.id) return;
    loading.value = true;
    error.value = '';
    try {
      const allRaw = await apiClient.get<RawSessionItem[]>('/sessions');
      const normalized = allRaw.map(normalizeSession);
      sessions.value = normalized.filter((item) => item.userId === auth.user?.id);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося завантажити сесії';
      sessions.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function deleteSession(sessionId: string) {
    deletingSessionId.value = sessionId;
    error.value = '';
    try {
      await apiClient.delete(`/sessions/${sessionId}`);
      sessions.value = sessions.value.filter((session) => session.id !== sessionId);
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Не вдалося видалити сесію';
    } finally {
      deletingSessionId.value = null;
    }
  }

  onMounted(() => {
    void loadSessions();
  });

  return {
    auth,
    loading,
    error,
    sessions,
    deletingSessionId,
    fullName,
    formatDate,
    loadSessions,
    deleteSession,
  };
}
