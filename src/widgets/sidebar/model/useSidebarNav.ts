import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { useAuth } from '@/features/auth';

export type NavLink = {
  type: 'link';
  name: string;
  label: string;
  to: RouteLocationRaw;
  routeNames?: string[];
};

export type NavChild = {
  name: string;
  label: string;
  to: RouteLocationRaw;
  routeNames: string[];
};

export type NavGroup = {
  type: 'group';
  id: string;
  label: string;
  children: NavChild[];
};

export type NavItem = NavLink | NavGroup;

const homeLink: NavLink = {
  type: 'link',
  name: 'home',
  label: 'Головна',
  to: { name: 'home' },
};

const financeGroup: NavGroup = {
  type: 'group',
  id: 'finance',
  label: 'Фінанси',
  children: [
    {
      name: 'invoices',
      label: 'Інвойси',
      to: { name: 'invoices' },
      routeNames: ['invoices', 'invoiceCreate', 'invoiceEdit'],
    },
    {
      name: 'payments',
      label: 'Платежі',
      to: { name: 'payments' },
      routeNames: ['payments'],
    },
    {
      name: 'expenses',
      label: 'Витрати',
      to: { name: 'expenses' },
      routeNames: ['expenses'],
    },
    {
      name: 'financeAnalytics',
      label: 'Аналітика',
      to: { name: 'financeAnalytics' },
      routeNames: ['financeAnalytics'],
    },
  ],
};

const secondBrainGroup: NavGroup = {
  type: 'group',
  id: 'secondBrain',
  label: 'Second Brain',
  children: [
    {
      name: 'notes',
      label: 'Нотатки',
      to: { name: 'notes' },
      routeNames: ['notes', 'noteCreate', 'noteEdit'],
    },
    {
      name: 'knowledgeBase',
      label: 'База знань',
      to: { name: 'knowledgeBase' },
      routeNames: ['knowledgeBase', 'knowledgeCreate', 'knowledgeEdit'],
    },
    {
      name: 'templates',
      label: 'Шаблони',
      to: { name: 'templates' },
      routeNames: ['templates', 'templateCreate', 'templateEdit'],
    },
    {
      name: 'journal',
      label: 'Журнал',
      to: { name: 'journal' },
      routeNames: ['journal'],
    },
  ],
};

const planningGroup: NavGroup = {
  type: 'group',
  id: 'planning',
  label: 'Планування',
  children: [
    {
      name: 'calendar',
      label: 'Календар',
      to: { name: 'calendar' },
      routeNames: ['calendar'],
    },
    {
      name: 'deadlines',
      label: 'Дедлайни',
      to: { name: 'deadlines' },
      routeNames: ['deadlines'],
    },
    {
      name: 'reminders',
      label: 'Нагадування',
      to: { name: 'reminders' },
      routeNames: ['reminders'],
    },
  ],
};

const projectRoutes = ['projects', 'projectCreate', 'projectEdit', 'projectDetail'] as const;
const taskRoutes = ['tasks', 'taskCreate', 'taskEdit'] as const;

const freelancerNavStructure: NavItem[] = [
  homeLink,
  {
    type: 'group',
    id: 'work',
    label: 'Робота',
    children: [
      {
        name: 'tasks',
        label: 'Задачі',
        to: { name: 'tasks' },
        routeNames: [...taskRoutes],
      },
      {
        name: 'projects',
        label: 'Проєкти',
        to: { name: 'projects' },
        routeNames: [...projectRoutes],
      },
      {
        name: 'timeTracker',
        label: 'Тайм-трекер',
        to: { name: 'timeTracker' },
        routeNames: ['timeTracker'],
      },
    ],
  },
  {
    type: 'group',
    id: 'clients',
    label: 'Клієнти',
    children: [
      {
        name: 'invitations',
        label: 'Запрошення',
        to: { name: 'invitations' },
        routeNames: ['invitations', 'invitationCreate'],
      },
      {
        name: 'clients',
        label: 'Клієнти',
        to: { name: 'clients' },
        routeNames: ['clients', 'clientCreate', 'clientEdit'],
      },
      {
        name: 'clientProjects',
        label: 'Їхні проєкти',
        to: { name: 'clientProjects' },
        routeNames: ['clientProjects'],
      },
      {
        name: 'clientNotes',
        label: 'Нотатки',
        to: { name: 'clientNotes' },
        routeNames: ['clientNotes'],
      },
    ],
  },
  financeGroup,
  secondBrainGroup,
  planningGroup,
];

function buildCompanyMemberNav(hasCompany: boolean): NavItem[] {
  const workBlocks: NavItem[] = [
    {
      type: 'link',
      name: 'projects',
      label: 'Проєкти',
      to: { name: 'projects' },
      routeNames: [...projectRoutes],
    },
    {
      type: 'link',
      name: 'tasks',
      label: 'Задачі',
      to: { name: 'tasks' },
      routeNames: [...taskRoutes],
    },
  ];

  if (hasCompany) {
    workBlocks.push({
      type: 'group',
      id: 'employees',
      label: 'Співробітники',
      children: [
        {
          name: 'invitations',
          label: 'Запрошення',
          to: { name: 'invitations' },
          routeNames: ['invitations', 'invitationCreate'],
        },
        {
          name: 'clients',
          label: 'Співробітники',
          to: { name: 'clients' },
          routeNames: ['clients', 'clientCreate', 'clientEdit'],
        },
      ],
    });
  }

  return [homeLink, ...workBlocks];
}

export function useSidebarNav() {
  const auth = useAuth();
  const route = useRoute();
  const router = useRouter();

  const navStructure = computed(() => {
    const u = auth.user;
    if (!u) {
      return freelancerNavStructure;
    }
    if (u.hasFreelancerProfile === true) {
      return freelancerNavStructure;
    }
    return buildCompanyMemberNav(u.hasCompanyMembership === true);
  });

  const openFlyoutId = ref<string | null>(null);

  const openFlyoutGroup = computed(() => {
    if (!openFlyoutId.value) return null;
    const found = navStructure.value.find(
      (i) => i.type === 'group' && i.id === openFlyoutId.value,
    );
    return found && found.type === 'group' ? found : null;
  });

  function isLinkActive(item: NavLink): boolean {
    const name = route.name as string;
    if (!name) return false;
    if (item.routeNames) return item.routeNames.includes(name);
    return route.name === item.name;
  }

  function isChildActive(child: NavChild): boolean {
    const name = route.name as string;
    return Boolean(name && child.routeNames.includes(name));
  }

  function isGroupActive(group: NavGroup): boolean {
    return group.children.some((child) => isChildActive(child));
  }

  function toggleGroup(group: NavGroup) {
    const firstChild = group.children[0];
    if (openFlyoutId.value === group.id) {
      openFlyoutId.value = null;
    } else if (firstChild) {
      openFlyoutId.value = group.id;
      router.push(firstChild.to);
    }
  }

  function closeFlyout() {
    const firstLink = navStructure.value.find((i) => i.type === 'link');
    if (firstLink?.type === 'link') {
      router.push(firstLink.to);
    }
    openFlyoutId.value = null;
  }

  watch(
    () => route.name,
    (name) => {
      if (!name) return;
      for (const item of navStructure.value) {
        if (
          item.type === 'group' &&
          item.children.some((c) => c.routeNames.includes(name as string))
        ) {
          openFlyoutId.value = item.id;
          return;
        }
      }
    },
    { immediate: true },
  );

  return {
    navStructure,
    openFlyoutId,
    openFlyoutGroup,
    isLinkActive,
    isChildActive,
    isGroupActive,
    toggleGroup,
    closeFlyout,
  };
}
