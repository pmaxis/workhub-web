import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { invoicesApi } from '@/features/invoices/api/invoices.api';
import { paymentsApi } from '@/features/payments/api/payments.api';
import { useToast } from '@/shared/ui/Toast';
import type { SelectOption } from '@/shared/ui';
import type { Invoice } from '@/features/invoices/api/invoices.api';

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}`;
}

export function usePaymentForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();

  const isEdit = computed(() => route.name === 'paymentEdit');
  const paymentId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const invoiceId = ref('');
  const amount = ref('');
  const currency = ref('USD');
  const receivedAt = ref('');
  const method = ref('');
  const notes = ref('');

  const invoices = ref<Invoice[]>([]);
  const invoiceOptions = computed<SelectOption[]>(() => [
    { value: '', label: 'No invoice' },
    ...invoices.value.map((inv) => ({
      value: inv.id,
      label: `${inv.number} — ${inv.amount} ${inv.currency}`,
    })),
  ]);

  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => ({ name: 'payments' as const }));

  async function loadInvoices() {
    try {
      const res = await invoicesApi.list({ limit: 100 });
      invoices.value = res.data;
    } catch {
      invoices.value = [];
    }
  }

  async function loadPayment() {
    if (!isEdit.value || !paymentId.value) {
      invoiceId.value = '';
      amount.value = '';
      currency.value = 'USD';
      receivedAt.value = toDatetimeLocal(new Date().toISOString());
      method.value = '';
      notes.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const pay = await paymentsApi.get(paymentId.value);
      invoiceId.value = pay.invoiceId ?? '';
      amount.value = pay.amount;
      currency.value = pay.currency;
      receivedAt.value = toDatetimeLocal(pay.receivedAt);
      method.value = pay.method ?? '';
      notes.value = pay.notes ?? '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load payment';
      loadError.value = msg;
      notifyError(msg);
    }
  }

  onMounted(() => {
    void loadInvoices();
  });

  watch(
    () => [isEdit.value, paymentId.value] as const,
    () => {
      void loadPayment();
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
    if (!receivedAt.value.trim()) {
      formError.value = 'Received date is required';
      saving.value = false;
      return;
    }
    const receivedIso = new Date(receivedAt.value).toISOString();
    try {
      if (isEdit.value && paymentId.value) {
        await paymentsApi.update(paymentId.value, {
          invoiceId: invoiceId.value ? invoiceId.value : null,
          amount: amountNum,
          currency: currency.value.trim().toUpperCase() || 'USD',
          receivedAt: receivedIso,
          method: method.value.trim() ? method.value.trim() : null,
          notes: notes.value.trim() ? notes.value.trim() : null,
        });
        notifySuccess('Payment saved');
      } else {
        await paymentsApi.create({
          invoiceId: invoiceId.value || undefined,
          amount: amountNum,
          currency: currency.value.trim().toUpperCase() || 'USD',
          receivedAt: receivedIso,
          method: method.value.trim() || undefined,
          notes: notes.value.trim() || undefined,
        });
        notifySuccess('Payment recorded');
      }
      await router.push({ name: 'payments' });
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
    invoiceId,
    amount,
    currency,
    receivedAt,
    method,
    notes,
    invoiceOptions,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
