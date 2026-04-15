import { apiClient } from '@/shared/api/client';
import type { TaskStatus } from '@/features/tasks/api/tasks.api';

export type PlanningCalendarTask = {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  dueAt: string;
};

export type PlanningCalendarReminder = {
  id: string;
  title: string;
  remindAt: string;
  taskId: string | null;
};

export type PlanningCalendarResponse = {
  tasks: PlanningCalendarTask[];
  reminders: PlanningCalendarReminder[];
};

export type PlanningDeadlineTask = {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  dueAt: string;
};

export type PlanningDeadlinesResponse = {
  tasks: PlanningDeadlineTask[];
};

function encodeQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const planningApi = {
  getCalendar: (from: string, to: string) =>
    apiClient.get<PlanningCalendarResponse>(
      `/planning/calendar${encodeQuery({ from: from.slice(0, 10), to: to.slice(0, 10) })}`,
    ),

  getDeadlines: (horizonDays?: number, limit?: number) =>
    apiClient.get<PlanningDeadlinesResponse>(
      `/planning/deadlines${encodeQuery({ horizonDays, limit })}`,
    ),
};
