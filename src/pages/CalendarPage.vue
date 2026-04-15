<template>
  <div class="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-auto">
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-900">Calendar</h1>
        <p class="mt-1 text-sm text-zinc-600">Tasks with a due date and active reminders in this month.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          @click="shiftMonth(-1)"
        >
          Previous
        </button>
        <span class="min-w-[10rem] text-center text-sm font-medium text-zinc-900">{{ titleLabel }}</span>
        <button
          type="button"
          class="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          @click="shiftMonth(1)"
        >
          Next
        </button>
      </div>
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="loading" class="text-sm text-zinc-600">Loading…</p>

    <div v-else class="min-h-0 flex-1 overflow-auto rounded-xl border border-zinc-200 bg-white p-4">
      <div class="grid grid-cols-7 gap-px bg-zinc-200 text-center text-xs font-medium text-zinc-600">
        <div v-for="w in weekdayLabels" :key="w" class="bg-zinc-50 py-2">{{ w }}</div>
      </div>
      <div class="grid grid-cols-7 gap-px bg-zinc-200">
        <div
          v-for="(cell, idx) in cells"
          :key="idx"
          class="min-h-[6.5rem] bg-white p-1.5 text-left align-top"
          :class="cell.inMonth ? '' : 'bg-zinc-50/80'"
        >
          <span
            class="text-xs font-medium"
            :class="cell.inMonth ? 'text-zinc-900' : 'text-zinc-400'"
          >
            {{ cell.day }}
          </span>
          <ul v-if="cell.inMonth" class="mt-1 space-y-1">
            <li v-for="t in cell.tasks" :key="`t-${t.id}`" class="truncate text-[11px]">
              <router-link
                :to="{ name: 'taskEdit', params: { id: t.id } }"
                class="text-zinc-800 underline-offset-2 hover:underline"
              >
                {{ t.title }}
              </router-link>
            </li>
            <li v-for="r in cell.reminders" :key="`r-${r.id}`" class="truncate text-[11px] text-violet-800">
              <span class="font-medium">⏰</span>
              {{ r.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  planningApi,
  type PlanningCalendarReminder,
  type PlanningCalendarTask,
} from '@/features/planning';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const loading = ref(true);
const error = ref('');
const calendarTasks = ref<PlanningCalendarTask[]>([]);
const calendarReminders = ref<PlanningCalendarReminder[]>([]);

const anchor = ref<{ y: number; m0: number }>({
  y: new Date().getUTCFullYear(),
  m0: new Date().getUTCMonth(),
});

const titleLabel = computed(() => {
  const { y, m0 } = anchor.value;
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m0, 1)),
  );
});

type Cell = {
  day: number;
  inMonth: boolean;
  key: string | null;
  tasks: PlanningCalendarTask[];
  reminders: PlanningCalendarReminder[];
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function monthUtcRange(y: number, m0: number): { from: string; to: string } {
  const from = `${y}-${pad2(m0 + 1)}-01`;
  const lastDay = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
  const to = `${y}-${pad2(m0 + 1)}-${pad2(lastDay)}`;
  return { from, to };
}

const cells = computed((): Cell[] => {
  const { y, m0 } = anchor.value;
  const { from } = monthUtcRange(y, m0);
  const first = new Date(`${from}T00:00:00.000Z`);
  const pad = (first.getUTCDay() + 6) % 7;
  const lastDay = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();

  const taskMap = new Map<string, PlanningCalendarTask[]>();
  for (const t of calendarTasks.value) {
    const k = t.dueAt.slice(0, 10);
    const arr = taskMap.get(k) ?? [];
    arr.push(t);
    taskMap.set(k, arr);
  }

  const remMap = new Map<string, PlanningCalendarReminder[]>();
  for (const r of calendarReminders.value) {
    const k = r.remindAt.slice(0, 10);
    const arr = remMap.get(k) ?? [];
    arr.push(r);
    remMap.set(k, arr);
  }

  const out: Cell[] = [];

  const prevMonth = m0 === 0 ? 11 : m0 - 1;
  const prevYear = m0 === 0 ? y - 1 : y;
  const prevLast = new Date(Date.UTC(prevYear, prevMonth + 1, 0)).getUTCDate();

  for (let i = 0; i < pad; i += 1) {
    const day = prevLast - pad + i + 1;
    out.push({ day, inMonth: false, key: null, tasks: [], reminders: [] });
  }

  for (let d = 1; d <= lastDay; d += 1) {
    const key = `${y}-${pad2(m0 + 1)}-${pad2(d)}`;
    out.push({
      day: d,
      inMonth: true,
      key,
      tasks: taskMap.get(key) ?? [],
      reminders: remMap.get(key) ?? [],
    });
  }

  const tail = 42 - out.length;
  for (let i = 1; i <= tail && tail > 0; i += 1) {
    out.push({ day: i, inMonth: false, key: null, tasks: [], reminders: [] });
  }

  return out;
});

function shiftMonth(delta: number): void {
  const { y, m0 } = anchor.value;
  const d = new Date(Date.UTC(y, m0 + delta, 1));
  anchor.value = { y: d.getUTCFullYear(), m0: d.getUTCMonth() };
}

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  const { y, m0 } = anchor.value;
  const { from, to } = monthUtcRange(y, m0);
  try {
    const res = await planningApi.getCalendar(from, to);
    calendarTasks.value = res.tasks;
    calendarReminders.value = res.reminders;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Could not load calendar';
    calendarTasks.value = [];
    calendarReminders.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => [anchor.value.y, anchor.value.m0] as const,
  () => {
    void load();
  },
  { immediate: true },
);
</script>
