import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { invoicesApi, type InvoiceStatus } from '@/features/invoices/api/invoices.api';
import { projectsApi, type Project } from '@/features/projects';
import { useToast } from '@/shared/ui/Toast';
import type { SelectOption } from '@/shared/ui';

function dateInputFromIso(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isoFromDateInput(value: string): string | undefined {
  if (!value.trim()) return undefined;
  return new Date(`${value}T12:00:00`).toISOString();
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function useInvoiceForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();

  const isEdit = computed(() => route.name === 'invoiceEdit');
  const invoiceId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const number = ref('');
  const title = ref('');
  const amount = ref('');
  const currency = ref('USD');
  const status = ref<string>('DRAFT');
  const projectId = ref<string>('');
  const issuedAt = ref('');
  const dueAt = ref('');
  const notes = ref('');

  const projects = ref<Project[]>([]);
  const projectOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'No project' },
    ...projects.value.map((p) => ({ value: p.id, label: p.name })),
  ]);

  const statusOptions = STATUS_OPTIONS;

  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => ({ name: 'invoices' as const }));

  async function loadProjects() {
    try {
      const res = await projectsApi.list({ limit: 100 });
      projects.value = res.data;
    } catch {
      projects.value = [];
    }
  }

  async function loadInvoice() {
    if (!isEdit.value || !invoiceId.value) {
      number.value = '';
      title.value = '';
      amount.value = '';
      currency.value = 'USD';
      status.value = 'DRAFT';
      projectId.value = '';
      issuedAt.value = '';
      dueAt.value = '';
      notes.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const inv = await invoicesApi.get(invoiceId.value);
      number.value = inv.number;
      title.value = inv.title ?? '';
      amount.value = inv.amount;
      currency.value = inv.currency;
      status.value = inv.status as string;
      projectId.value = inv.projectId ?? '';
      issuedAt.value = dateInputFromIso(inv.issuedAt);
      dueAt.value = dateInputFromIso(inv.dueAt);
      notes.value = inv.notes ?? '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load invoice';
      loadError.value = msg;
      notifyError(msg);
    }
  }

  onMounted(() => {
    void loadProjects();
  });

  watch(
    () => [isEdit.value, invoiceId.value] as const,
    () => {
      void loadInvoice();
    },
    { immediate: true },
  );

  async function submit() {
    saving.value = true;
    formError.value = '';
    const amountNum = Number.parseFloat(amount.value);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      formError.value = 'Enter a valid amount';
      saving.value = false;
      return;
    }
    try {
      const payloadBase = {
        title: title.value.trim() || undefined,
        amount: amountNum,
        currency: currency.value.trim().toUpperCase() || 'USD',
        status: status.value as InvoiceStatus,
        projectId: projectId.value || undefined,
        issuedAt: isoFromDateInput(issuedAt.value),
        dueAt: isoFromDateInput(dueAt.value),
        notes: notes.value.trim() || undefined,
      };
      if (isEdit.value && invoiceId.value) {
        await invoicesApi.update(invoiceId.value, {
          number: number.value.trim() || undefined,
          title: title.value.trim() ? title.value.trim() : null,
          amount: payloadBase.amount,
          currency: payloadBase.currency,
          status: payloadBase.status,
          projectId: projectId.value ? projectId.value : null,
          issuedAt: issuedAt.value ? isoFromDateInput(issuedAt.value) ?? null : null,
          dueAt: dueAt.value ? isoFromDateInput(dueAt.value) ?? null : null,
          notes: notes.value.trim() ? notes.value.trim() : null,
        });
        notifySuccess('Invoice saved');
        await router.push({ name: 'invoices' });
      } else {
        await invoicesApi.create({
          ...payloadBase,
          number: number.value.trim() || undefined,
        });
        notifySuccess('Invoice created');
        await router.push({ name: 'invoices' });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not save';
      formError.value = msg;
      notifyError(msg);
    } finally {
      saving.value = false;
    }
  }

  function cancel() {
    void router.push(backTo.value);
  }

  return {
    isEdit,
    number,
    title,
    amount,
    currency,
    status,
    projectId,
    issuedAt,
    dueAt,
    notes,
    projectOptions,
    statusOptions,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
