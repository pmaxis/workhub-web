<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Invitations</h1>
      </div>
      <router-link
        :to="{ name: 'invitationCreate' }"
        class="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black focus:outline-none"
      >
        New invitation
      </router-link>
    </div>

    <TableCard
      :loading="loading"
      :error="error"
      :empty="invitations.length === 0"
      empty-message="No active invitations"
    >
      <Table fixed>
        <TableHead>
          <tr>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Link</TableHeadCell>
            <TableHeadCell>Valid until</TableHeadCell>
            <TableHeadCell align="right">Actions</TableHeadCell>
          </tr>
        </TableHead>
        <TableBody>
          <TableRow v-for="inv in invitations" :key="inv.id">
            <TableCell nowrap>{{ inv.email }}</TableCell>
            <TableCell tone="plain">
              <div v-if="inv.token" class="flex items-center gap-2">
                <code
                  class="min-w-0 w-50 truncate rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700"
                >
                  {{ buildInviteLink(inv.token) }}
                </code>
                <button
                  type="button"
                  class="shrink-0 cursor-pointer rounded p-0.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 focus:outline-none"
                  title="Copy link"
                  @click="inv.token && copyInviteLink(inv.token)"
                >
                  <Icon name="copy" />
                </button>
              </div>
              <span v-else class="text-zinc-400">—</span>
            </TableCell>
            <TableCell nowrap tone="muted">{{ formatDate(inv.expiresAt) }}</TableCell>
            <TableCell align="right" nowrap tone="plain">
              <Dropdown>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="resendingId === inv.id"
                  @click="resendInvitation(inv.id)"
                >
                  {{ resendingId === inv.id ? 'Sending…' : 'Resend' }}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="resendingId === inv.id"
                  @click="promptDelete(inv)"
                >
                  Delete
                </button>
              </Dropdown>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableCard>

    <ConfirmDeleteModal v-model="deleteTarget" @confirm="confirmDelete">
      <template #message>
        invitation for {{ deleteTarget?.email }}
      </template>
    </ConfirmDeleteModal>
  </div>
</template>

<script setup lang="ts">
import {
  ConfirmDeleteModal,
  Dropdown,
  Icon,
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from '@/shared/ui';
import { useInvitationsList } from '@/features/invitations/model/useInvitationsList';

const {
  invitations,
  loading,
  error,
  resendingId,
  deleteTarget,
  formatDate,
  buildInviteLink,
  resendInvitation,
  promptDelete,
  confirmDelete,
  copyInviteLink,
} = useInvitationsList();
</script>
