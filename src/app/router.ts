import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/features/auth';
import AppLayout from '@/widgets/layout/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/RegisterPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/HomePage.vue'),
        },
        {
          path: 'my-account',
          name: 'myAccount',
          component: () => import('@/pages/MyAccountPage.vue'),
        },
        {
          path: 'my-account/edit',
          name: 'myAccountEdit',
          component: () => import('@/pages/MyAccountEditPage.vue'),
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('@/pages/NotificationsPage.vue'),
        },
        // Робота
        {
          path: 'projects',
          name: 'projects',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Проєкти', pageDescription: 'Список проєктів' },
        },
        {
          path: 'projects/new',
          name: 'projectCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Новий проєкт' },
        },
        {
          path: 'projects/:id/edit',
          name: 'projectEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування проєкту' },
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Задачі', pageDescription: 'Список задач' },
        },
        {
          path: 'tasks/new',
          name: 'taskCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Нова задача' },
        },
        {
          path: 'tasks/:id/edit',
          name: 'taskEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування задачі' },
        },
        {
          path: 'time-tracker',
          name: 'timeTracker',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Тайм-трекер', pageDescription: 'Відстеження часу' },
        },
        // Клієнти
        {
          path: 'clients',
          name: 'clients',
          component: () => import('@/pages/ClientsPage.vue'),
          meta: { pageTitle: 'Клієнти', pageDescription: 'База клієнтів' },
        },
        {
          path: 'invitations',
          name: 'invitations',
          component: () => import('@/pages/InvitationsPage.vue'),
          meta: { pageTitle: 'Запрошення', pageDescription: 'Запрошення клієнтів' },
        },
        {
          path: 'invitations/new',
          name: 'invitationCreate',
          component: () => import('@/pages/InvitationCreatePage.vue'),
          meta: { pageTitle: 'Нове запрошення' },
        },
        {
          path: 'clients/new',
          name: 'clientCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Новий клієнт' },
        },
        {
          path: 'clients/:id/edit',
          name: 'clientEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування клієнта' },
        },
        {
          path: 'client-projects',
          name: 'clientProjects',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Проєкти клієнтів' },
        },
        {
          path: 'client-notes',
          name: 'clientNotes',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Нотатки по клієнтах' },
        },
        // Фінанси
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Інвойси', pageDescription: 'Список інвойсів' },
        },
        {
          path: 'invoices/new',
          name: 'invoiceCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Новий інвойс' },
        },
        {
          path: 'invoices/:id/edit',
          name: 'invoiceEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування інвойсу' },
        },
        {
          path: 'payments',
          name: 'payments',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Платежі', pageDescription: 'Історія платежів' },
        },
        {
          path: 'expenses',
          name: 'expenses',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Витрати', pageDescription: 'Облік витрат' },
        },
        {
          path: 'finance-analytics',
          name: 'financeAnalytics',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Аналітика доходів' },
        },
        // Планування
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Календар', pageDescription: 'Планування подій' },
        },
        {
          path: 'deadlines',
          name: 'deadlines',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Дедлайни', pageDescription: 'Найближчі дедлайни' },
        },
        {
          path: 'reminders',
          name: 'reminders',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Нагадування', pageDescription: 'Список нагадувань' },
        },
        // Second Brain
        {
          path: 'notes',
          name: 'notes',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: {
            pageTitle: 'Нотатки',
            pageDescription: 'Ідеї, думки, спостереження',
          },
        },
        {
          path: 'notes/new',
          name: 'noteCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Нова нотатка' },
        },
        {
          path: 'notes/:id/edit',
          name: 'noteEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування нотатки' },
        },
        {
          path: 'knowledge',
          name: 'knowledgeBase',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: {
            pageTitle: 'База знань',
            pageDescription: 'Корисні матеріали, статті, ресурси',
          },
        },
        {
          path: 'knowledge/new',
          name: 'knowledgeCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Новий матеріал' },
        },
        {
          path: 'knowledge/:id/edit',
          name: 'knowledgeEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування матеріалу' },
        },
        {
          path: 'templates',
          name: 'templates',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: {
            pageTitle: 'Шаблони',
            pageDescription: 'Повторювані структури: бриф, КП, інвойс',
          },
        },
        {
          path: 'templates/new',
          name: 'templateCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Новий шаблон' },
        },
        {
          path: 'templates/:id/edit',
          name: 'templateEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Редагування шаблону' },
        },
        {
          path: 'journal',
          name: 'journal',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: {
            pageTitle: 'Журнал',
            pageDescription: 'Щоденні та тижневі рефлексії та підсумки',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
});

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = useAuth();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    await auth.init();
  }
  const isAuth = auth.isAuthenticated;
  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }
  if (to.meta.guest && isAuth) {
    next({ name: 'home' });
    return;
  }
  next();
});

export default router;
