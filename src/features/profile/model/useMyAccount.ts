import { computed, onMounted, ref } from 'vue';
import { useAuth } from '@/features/auth';
import { apiClient } from '@/shared/api/client';
import { useToast } from '@/shared/ui/Toast';

const UNDO_MS = 5000;

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
  return new Intl.DateTimeFormat('en-US', {
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
  const { successWithUndo, error: notifyError, info: notifyInfo } = useToast();
  const loading = ref(false);
  const error = ref('');
  const sessions = ref<AccountSessionItem[]>([]);
  const deleteTarget = ref<AccountSessionItem | null>(null);

  const fullName = computed(() => {
    const u = auth.user;
    if (!u) return '';
    return [u.lastName, u.firstName, u.thirdName].filter(Boolean).join(' ');
  });

  async function loadSessions(options?: { notifyOnSuccess?: boolean }) {
    if (!auth.user?.id) return;
    loading.value = true;
    error.value = '';
    try {
      const allRaw = await apiClient.get<RawSessionItem[]>('/sessions');
      const normalized = allRaw.map(normalizeSession);
      sessions.value = normalized.filter((item) => item.userId === auth.user?.id);
      if (options?.notifyOnSuccess) {
        notifyInfo('Sessions refreshed', 3000);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load sessions';
      error.value = msg;
      notifyError(msg);
      sessions.value = [];
    } finally {
      loading.value = false;
    }
  }

  function promptDeleteSession(session: AccountSessionItem) {
    deleteTarget.value = session;
  }

  function confirmDeleteSession() {
    const session = deleteTarget.value;
    if (!session) return;
    const index = sessions.value.findIndex((s) => s.id === session.id);
    deleteTarget.value = null;
    if (index === -1) return;
    const removed = sessions.value[index];
    sessions.value.splice(index, 1);

    const timeoutId = setTimeout(() => {
      void (async () => {
        try {
          await apiClient.delete(`/sessions/${removed.id}`);
        } catch (e: unknown) {
          notifyError(e instanceof Error ? e.message : 'Could not remove session');
          sessions.value.splice(index, 0, removed);
        }
      })();
    }, UNDO_MS);

    successWithUndo('Session removed', () => {
      clearTimeout(timeoutId);
      sessions.value.splice(index, 0, removed);
    });
  }

  onMounted(() => {
    void loadSessions();
  });

  return {
    auth,
    loading,
    error,
    sessions,
    deleteTarget,
    fullName,
    formatDate,
    loadSessions,
    promptDeleteSession,
    confirmDeleteSession,
  };
}
