<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-base font-medium text-zinc-900">My account</h2>
        </div>
        <router-link
          :to="{ name: 'myAccountEdit' }"
          class="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-0"
          aria-label="Edit profile"
        >
          <Icon name="pencil" />
        </router-link>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-lg border border-zinc-200 bg-white px-3 py-2">
          <p class="text-xs uppercase tracking-wide text-zinc-500">Full name</p>
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
        <h3 class="text-base font-medium text-zinc-900">My sessions</h3>
        <button
          type="button"
          class="cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-black focus:outline-none disabled:opacity-50"
          :disabled="loading"
          @click="loadSessions({ notifyOnSuccess: true })"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <p
        v-if="error"
        class="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
      >
        {{ error }}
      </p>

      <div v-if="loading" class="text-sm text-zinc-500">Loading sessions...</div>
      <div v-else-if="sessions.length === 0" class="text-sm text-zinc-600">
        No active sessions found.
      </div>
      <div v-else class="space-y-2">
        <MyAccountSessionRow
          v-for="session in sessions"
          :key="session.id"
          :session="session"
          :expires-label="formatDate(session.expiresAt)"
          @remove="promptDeleteSession(session)"
        />
      </div>
    </div>

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDeleteSession">
      <template #message>
        this session ({{ deleteTarget?.ipAddress || 'unknown IP' }})
      </template>
    </ConfirmDeleteModal>
  </div>
</template>

<script setup lang="ts">
import { useMyAccount } from '@/features/profile/model/useMyAccount';
import MyAccountSessionRow from '@/features/profile/ui/MyAccountSessionRow.vue';
import { ConfirmDeleteModal, Icon } from '@/shared/ui';

const {
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
} = useMyAccount();
</script>
