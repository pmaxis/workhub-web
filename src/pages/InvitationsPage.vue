<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Запрошення</h1>
        <p class="mt-1 text-zinc-600">
          Запрошення на реєстрацію в системі
        </p>
      </div>
      <router-link
        :to="{ name: 'invitationCreate' }"
        class="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black focus:outline-none"
      >
        Нове запрошення
      </router-link>
    </div>

    <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div v-if="loading" class="py-12 text-center text-sm text-zinc-500">
        Завантаження...
      </div>
      <div v-else-if="error" class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </div>
      <div v-else-if="invitations.length === 0" class="py-12 text-center text-sm text-zinc-600">
        Немає активних запрошень
      </div>
      <table v-else class="min-w-full table-fixed divide-y divide-zinc-200">
        <thead class="bg-zinc-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Посилання
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Дійсне до
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Дії
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 bg-white">
          <tr
            v-for="inv in invitations"
            :key="inv.id"
            class="hover:bg-zinc-50"
          >
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
              {{ inv.email }}
            </td>
            <td class="px-4 py-3 text-sm">
              <div v-if="inv.token" class="flex items-center gap-2">
                <code class="min-w-0 w-50 truncate rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700">
                  {{ buildInviteLink(inv.token) }}
                </code>
                <button
                  type="button"
                  class="shrink-0 cursor-pointer rounded p-0.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 focus:outline-none"
                  title="Копіювати посилання"
                  @click="copyInviteLink(inv.token)"
                >
                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16V4a2 2 0 0 1 2-2h10" />
                  </svg>
                </button>
              </div>
              <span v-else class="text-zinc-400">—</span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
              {{ formatDate(inv.expiresAt) }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  class="cursor-pointer rounded-lg border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 focus:outline-none"
                  :disabled="resendingId === inv.id"
                  @click="resendInvitation(inv.id)"
                >
                  {{ resendingId === inv.id ? '...' : 'Надіслати знову' }}
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded-lg border border-red-300 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 focus:outline-none"
                  :disabled="deletingId === inv.id"
                  @click="deleteInvitation(inv.id)"
                >
                  {{ deletingId === inv.id ? '...' : 'Видалити' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invitationsApi, type Invitation } from '@/features/invitations';

const invitations = ref<Invitation[]>([]);
const loading = ref(false);
const error = ref('');
const resendingId = ref<string | null>(null);
const deletingId = ref<string | null>(null);

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

async function loadInvitations() {
  loading.value = true;
  error.value = '';
  try {
    invitations.value = await invitationsApi.list({ status: 'PENDING' });
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося завантажити запрошення';
    invitations.value = [];
  } finally {
    loading.value = false;
  }
}

async function resendInvitation(id: string) {
  resendingId.value = id;
  try {
    await invitationsApi.resend(id);
    await loadInvitations();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося надіслати знову';
  } finally {
    resendingId.value = null;
  }
}

async function deleteInvitation(id: string) {
  deletingId.value = id;
  try {
    await invitationsApi.remove(id);
    invitations.value = invitations.value.filter((i) => i.id !== id);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося видалити';
  } finally {
    deletingId.value = null;
  }
}

function buildInviteLink(token: string): string {
  const base = window.location.origin + import.meta.env.BASE_URL;
  return `${base}register?token=${token}`.replace(/\/+/g, '/');
}

function copyInviteLink(token: string) {
  void navigator.clipboard.writeText(buildInviteLink(token));
}

onMounted(() => {
  void loadInvitations();
});
</script>
