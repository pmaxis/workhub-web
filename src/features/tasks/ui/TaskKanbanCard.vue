<template>
  <article
    :data-task-id="task.id"
    class="group relative rounded-lg border border-zinc-200 bg-white p-0 shadow-sm hover:border-zinc-300 hover:shadow"
    role="listitem"
  >
    <div class="flex gap-2 p-3">
      <div class="min-w-0 flex-1">
        <router-link
          :to="{ name: 'taskEdit', params: { id: task.id } }"
          class="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          {{ task.title }}
        </router-link>
        <p v-if="task.description" class="mt-1 line-clamp-2 text-xs text-zinc-500">
          {{ task.description }}
        </p>
        <p class="mt-2 text-xs text-zinc-500">
          <span class="text-zinc-400">Project:</span>
          {{ projectName }}
        </p>
      </div>
      <div class="shrink-0 self-start" data-no-drag>
        <Dropdown>
          <router-link
            :to="{ name: 'taskEdit', params: { id: task.id } }"
            role="menuitem"
            class="block px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Edit
          </router-link>
          <button
            type="button"
            role="menuitem"
            class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            @click="emit('remove', task)"
          >
            Delete
          </button>
        </Dropdown>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Task } from '@/features/tasks';
import { Dropdown } from '@/shared/ui';

defineProps<{
  task: Task;
  projectName: string;
}>();

const emit = defineEmits<{
  remove: [task: Task];
}>();
</script>
