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
          path: 'company/settings',
          name: 'companySettings',
          component: () => import('@/pages/CompanySettingsPage.vue'),
          meta: { pageTitle: 'Company settings' },
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('@/pages/ProjectsPage.vue'),
          meta: { pageTitle: 'Projects' },
        },
        {
          path: 'projects/new',
          name: 'projectCreate',
          component: () => import('@/pages/ProjectFormPage.vue'),
          meta: { pageTitle: 'New project' },
        },
        {
          path: 'projects/:id/edit',
          name: 'projectEdit',
          component: () => import('@/pages/ProjectFormPage.vue'),
          meta: { pageTitle: 'Edit project' },
        },
        {
          path: 'projects/:id',
          name: 'projectDetail',
          component: () => import('@/pages/ProjectDetailPage.vue'),
          meta: { pageTitle: 'Project' },
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('@/pages/TasksPage.vue'),
          meta: { pageTitle: 'Tasks' },
        },
        {
          path: 'tasks/new',
          name: 'taskCreate',
          component: () => import('@/pages/TaskFormPage.vue'),
          meta: { pageTitle: 'New task' },
        },
        {
          path: 'tasks/:id/edit',
          name: 'taskEdit',
          component: () => import('@/pages/TaskFormPage.vue'),
          meta: { pageTitle: 'Edit task' },
        },
        {
          path: 'time-tracker',
          name: 'timeTracker',
          component: () => import('@/pages/TimeTrackerPage.vue'),
          meta: { pageTitle: 'Time tracker' },
        },
        {
          path: 'clients',
          name: 'clients',
          component: () => import('@/pages/ClientsPage.vue'),
          meta: { pageTitle: 'Clients' },
        },
        {
          path: 'invitations',
          name: 'invitations',
          component: () => import('@/pages/InvitationsPage.vue'),
          meta: { pageTitle: 'Invitations' },
        },
        {
          path: 'invitations/new',
          name: 'invitationCreate',
          component: () => import('@/pages/InvitationCreatePage.vue'),
          meta: { pageTitle: 'New invitation' },
        },
        {
          path: 'clients/new',
          name: 'clientCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'New client' },
        },
        {
          path: 'clients/:id/edit',
          name: 'clientEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Edit client' },
        },
        {
          path: 'client-notes',
          name: 'clientNotes',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Client notes' },
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import('@/pages/InvoicesPage.vue'),
          meta: { pageTitle: 'Invoices' },
        },
        {
          path: 'invoices/new',
          name: 'invoiceCreate',
          component: () => import('@/pages/InvoiceFormPage.vue'),
          meta: { pageTitle: 'New invoice' },
        },
        {
          path: 'invoices/:id/edit',
          name: 'invoiceEdit',
          component: () => import('@/pages/InvoiceFormPage.vue'),
          meta: { pageTitle: 'Edit invoice' },
        },
        {
          path: 'payments',
          name: 'payments',
          component: () => import('@/pages/PaymentsPage.vue'),
          meta: { pageTitle: 'Payments' },
        },
        {
          path: 'payments/new',
          name: 'paymentCreate',
          component: () => import('@/pages/PaymentFormPage.vue'),
          meta: { pageTitle: 'Record payment' },
        },
        {
          path: 'payments/:id/edit',
          name: 'paymentEdit',
          component: () => import('@/pages/PaymentFormPage.vue'),
          meta: { pageTitle: 'Edit payment' },
        },
        {
          path: 'expenses',
          name: 'expenses',
          component: () => import('@/pages/ExpensesPage.vue'),
          meta: { pageTitle: 'Expenses' },
        },
        {
          path: 'expenses/new',
          name: 'expenseCreate',
          component: () => import('@/pages/ExpenseFormPage.vue'),
          meta: { pageTitle: 'New expense' },
        },
        {
          path: 'expenses/:id/edit',
          name: 'expenseEdit',
          component: () => import('@/pages/ExpenseFormPage.vue'),
          meta: { pageTitle: 'Edit expense' },
        },
        {
          path: 'finance-analytics',
          name: 'financeAnalytics',
          component: () => import('@/pages/FinanceAnalyticsPage.vue'),
          meta: { pageTitle: 'Revenue analytics' },
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Calendar' },
        },
        {
          path: 'deadlines',
          name: 'deadlines',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Deadlines' },
        },
        {
          path: 'reminders',
          name: 'reminders',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Reminders' },
        },
        {
          path: 'notes',
          name: 'notes',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Notes' },
        },
        {
          path: 'notes/new',
          name: 'noteCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'New note' },
        },
        {
          path: 'notes/:id/edit',
          name: 'noteEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Edit note' },
        },
        {
          path: 'knowledge',
          name: 'knowledgeBase',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Knowledge base' },
        },
        {
          path: 'knowledge/new',
          name: 'knowledgeCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'New article' },
        },
        {
          path: 'knowledge/:id/edit',
          name: 'knowledgeEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Edit article' },
        },
        {
          path: 'templates',
          name: 'templates',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Templates' },
        },
        {
          path: 'templates/new',
          name: 'templateCreate',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'New template' },
        },
        {
          path: 'templates/:id/edit',
          name: 'templateEdit',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Edit template' },
        },
        {
          path: 'journal',
          name: 'journal',
          component: () => import('@/pages/PlaceholderPage.vue'),
          meta: { pageTitle: 'Journal' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  void from;
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
