import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { journalEntriesApi } from '@/features/journal-entries/api/journalEntries.api';
import { useToast } from '@/shared/ui/Toast';

function dateInputFromIso(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayDateInput(): string {
  return dateInputFromIso(new Date().toISOString());
}

export function useJournalEntryForm() {
  const route = useRoute();
  const router = useRouter();
  const { success: notifySuccess, error: notifyError } = useToast();

  const isEdit = computed(() => route.name === 'journalEdit');
  const entryId = computed(() => (isEdit.value ? String(route.params.id || '') : ''));

  const entryDate = ref('');
  const title = ref('');
  const body = ref('');
  const mood = ref('');

  const saving = ref(false);
  const formError = ref('');
  const loadError = ref('');

  const backTo = computed(() => ({ name: 'journal' as const }));

  async function loadEntry() {
    if (!isEdit.value || !entryId.value) {
      entryDate.value = todayDateInput();
      title.value = '';
      body.value = '';
      mood.value = '';
      loadError.value = '';
      return;
    }
    loadError.value = '';
    try {
      const e = await journalEntriesApi.get(entryId.value);
      entryDate.value = dateInputFromIso(e.entryDate);
      title.value = e.title ?? '';
      body.value = e.body;
      mood.value = e.mood ?? '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not load entry';
      loadError.value = msg;
      notifyError(msg);
    }
  }

  watch(
    () => [isEdit.value, entryId.value] as const,
    () => {
      void loadEntry();
    },
    { immediate: true },
  );

  async function submit() {
    saving.value = true;
    formError.value = '';
    if (!entryDate.value.trim()) {
      formError.value = 'Date is required';
      saving.value = false;
      return;
    }
    try {
      if (isEdit.value && entryId.value) {
        await journalEntriesApi.update(entryId.value, {
          entryDate: entryDate.value.trim(),
          title: title.value.trim() ? title.value.trim() : null,
          body: body.value,
          mood: mood.value.trim() ? mood.value.trim() : null,
        });
        notifySuccess('Entry saved');
      } else {
        await journalEntriesApi.create({
          entryDate: entryDate.value.trim(),
          title: title.value.trim() || undefined,
          body: body.value,
          mood: mood.value.trim() || undefined,
        });
        notifySuccess('Entry created');
      }
      await router.push({ name: 'journal' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save';
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
    entryDate,
    title,
    body,
    mood,
    saving,
    formError,
    loadError,
    backTo,
    submit,
    cancel,
  };
}
