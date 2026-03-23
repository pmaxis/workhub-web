<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-zinc-900">Клієнти</h1>
      <p class="mt-1 text-zinc-600">
        Клієнти з підтвердженим статусом запрошення
      </p>
    </div>

    <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div v-if="loading" class="py-12 text-center text-sm text-zinc-500">
        Завантаження...
      </div>
      <div v-else-if="error" class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ error }}
      </div>
      <div v-else-if="clients.length === 0" class="py-12 text-center text-sm text-zinc-600">
        Немає клієнтів з підтвердженим запрошенням
      </div>
      <table v-else class="min-w-full divide-y divide-zinc-200">
        <thead class="bg-zinc-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              ПІБ
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Пошта
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600"
            >
              Підтверджено
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 bg-white">
          <tr
            v-for="client in clients"
            :key="client.id"
            class="hover:bg-zinc-50"
          >
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-900">
              {{ client.fullName || '—' }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
              {{ client.email }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-zinc-600">
              {{ formatDate(client.confirmedAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invitationsApi, type ClientItem } from '@/features/invitations';

const clients = ref<ClientItem[]>([]);
const loading = ref(false);
const error = ref('');

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

async function loadClients() {
  loading.value = true;
  error.value = '';
  try {
    clients.value = await invitationsApi.listClients();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Не вдалося завантажити клієнтів';
    clients.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadClients();
});
</script>
