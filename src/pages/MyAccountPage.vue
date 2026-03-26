<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-base font-medium text-zinc-900">Мій акаунт</h2>
          <p class="mt-1 text-sm text-zinc-600">
            Перегляд та редагування профілю.
          </p>
        </div>
        <Dropdown aria-label="Дії з профілем">
          <router-link
            :to="{ name: 'myAccountEdit' }"
            role="menuitem"
            class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Редагувати профіль
          </router-link>
        </Dropdown>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <p class="text-xs uppercase tracking-wide text-zinc-500">ПІБ</p>
          <p class="mt-1 text-sm text-zinc-900">{{ fullName || '—' }}</p>
        </div>
        <div class="rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <p class="text-xs uppercase tracking-wide text-zinc-500">Email</p>
          <p class="mt-1 text-sm text-zinc-900">{{ auth.user?.email ?? '—' }}</p>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h3 class="text-base font-medium text-zinc-900">Мої сесії</h3>
        <button
          type="button"
          class="cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-black focus:outline-none disabled:opacity-50"
          :disabled="loading"
          @click="loadSessions"
        >
          {{ loading ? 'Оновлення...' : 'Оновити' }}
        </button>
      </div>

      <p v-if="error" class="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ error }}
      </p>

      <div v-if="loading" class="text-sm text-zinc-500">Завантаження сесій...</div>
      <div v-else-if="sessions.length === 0" class="text-sm text-zinc-600">
        Активні сесії не знайдено.
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="rounded-lg border border-zinc-200 bg-white px-3 py-2"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm text-zinc-900">{{ session.userAgent || 'Невідомий пристрій' }}</p>
              <p class="mt-1 text-xs text-zinc-500">
                IP: {{ session.ipAddress || '—' }} | Закінчується: {{ formatDate(session.expiresAt) }}
              </p>
            </div>
            <Dropdown aria-label="Дії з сесією">
              <button
                type="button"
                role="menuitem"
                class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="deletingSessionId === session.id"
                @click="deleteSession(session.id)"
              >
                {{ deletingSessionId === session.id ? 'Видалення…' : 'Видалити сесію' }}
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuth } from '@/features/auth';
import { apiClient } from '@/shared/api/client';
import { Dropdown } from '@/shared/ui';

type SessionItem = {
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

const auth = useAuth();
const loading = ref(false);
const error = ref('');
const sessions = ref<SessionItem[]>([]);
const deletingSessionId = ref<string | null>(null);

const fullName = computed(() => {
  const u = auth.user;
  if (!u) return '';
  return [u.lastName, u.firstName, u.thirdName].filter(Boolean).join(' ');
});

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function normalizeSession(raw: RawSessionItem): SessionItem {
  return {
    id: raw.id,
    userId: raw.userId ?? raw.user_id ?? '',
    ipAddress: raw.ipAddress ?? raw.ip_address ?? null,
    userAgent: raw.userAgent ?? raw.user_agent ?? null,
    expiresAt: raw.expiresAt ?? raw.expires_at,
  };
}

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
</script>
