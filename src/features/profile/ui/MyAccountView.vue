<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-base font-medium text-zinc-900">Мій акаунт</h2>
          <p class="mt-1 text-sm text-zinc-600">Перегляд та редагування профілю.</p>
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

      <p
        v-if="error"
        class="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ error }}
      </p>

      <div v-if="loading" class="text-sm text-zinc-500">Завантаження сесій...</div>
      <div v-else-if="sessions.length === 0" class="text-sm text-zinc-600">Активні сесії не знайдено.</div>
      <div v-else class="space-y-2">
        <MyAccountSessionRow
          v-for="session in sessions"
          :key="session.id"
          :session="session"
          :expires-label="formatDate(session.expiresAt)"
          :deleting="deletingSessionId === session.id"
          @remove="deleteSession(session.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMyAccount } from '@/features/profile/model/useMyAccount';
import MyAccountSessionRow from '@/features/profile/ui/MyAccountSessionRow.vue';
import { Dropdown } from '@/shared/ui';

const {
  auth,
  loading,
  error,
  sessions,
  deletingSessionId,
  fullName,
  formatDate,
  loadSessions,
  deleteSession,
} = useMyAccount();
</script>
