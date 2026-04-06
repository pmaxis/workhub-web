<template>
  <div ref="rootRef" class="relative w-full">
    <button
      ref="triggerRef"
      :id="triggerId"
      type="button"
      class="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-sm leading-5 text-zinc-900 antialiased transition-colors duration-200 ease-out focus:outline-none focus-visible:border-zinc-900 aria-expanded:border-zinc-900 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400"
      :class="triggerClass"
      :disabled="isDisabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span
        class="min-w-0 flex-1 truncate font-normal"
        :class="showPlaceholder ? 'text-zinc-500' : 'text-zinc-900'"
      >
        {{ displayLabel }}
      </span>
      <svg
        class="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ease-out"
        :class="{ 'rotate-180 text-zinc-500': open }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
    <Teleport to="body">
      <ul
        v-if="open"
        ref="panelRef"
        tabindex="-1"
        class="fixed z-200 flex max-h-60 flex-col gap-1 overflow-x-hidden overflow-y-auto rounded-xl border border-zinc-200/90 bg-white p-1 shadow-[0_12px_40px_-12px_rgb(0_0_0_/0.18),0_4px_16px_-4px_rgb(0_0_0_/0.08)] outline-none select-scroll"
        role="listbox"
        :style="panelStyle"
        :aria-labelledby="triggerId"
        @keydown.stop.prevent="onListKeydown"
      >
        <li
          v-for="(opt, i) in options"
          :key="`${String(opt.value)}-${i}`"
          role="option"
          :aria-selected="isSelected(opt)"
          :aria-disabled="opt.disabled === true"
          :class="optionClass(opt, i)"
          @click="onOptionClick(opt)"
          @mouseenter="highlightedIndex = i"
        >
          <span
            class="block w-full px-2.5 py-2 text-sm leading-snug"
            :class="isSelected(opt) ? 'font-medium text-white' : 'font-normal text-zinc-700'"
          >
            {{ opt.label }}
          </span>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    options?: SelectOption[];
    placeholder?: string;
  }>(),
  { options: () => [] },
);

const model = defineModel<string | number | null>({ default: '' });

const attrs = useAttrs();
const autoId = useId();

const triggerId = computed(() => (attrs.id as string | undefined) ?? autoId);
const isDisabled = computed(() => attrs.disabled === true || attrs.disabled === '');
const triggerClass = computed(() => attrs.class);

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const open = ref(false);
const panelStyle = ref<Record<string, string>>({});
const highlightedIndex = ref(0);

const GAP_PX = 6;

const showPlaceholder = computed(() => {
  const v = model.value;
  if (v === null || v === undefined || v === '') return true;
  return !props.options.some((o) => valuesEqual(o.value, v));
});

const displayLabel = computed(() => {
  if (showPlaceholder.value) return props.placeholder ?? '';
  const found = props.options.find((o) => valuesEqual(o.value, model.value));
  return found?.label ?? String(model.value);
});

function valuesEqual(a: string | number, b: string | number | null | undefined): boolean {
  if (b === null || b === undefined) return false;
  return a === b || String(a) === String(b);
}

function isSelected(opt: SelectOption): boolean {
  if (showPlaceholder.value) return false;
  return valuesEqual(opt.value, model.value);
}

function optionClass(opt: SelectOption, index: number): string {
  const base =
    'cursor-pointer select-none rounded-md outline-none transition-colors duration-150 ease-out';
  if (opt.disabled) return `${base} cursor-not-allowed opacity-45`;
  const selected = isSelected(opt);
  const hi = highlightedIndex.value === index;
  if (selected) return `${base} bg-zinc-800`;
  if (hi) return `${base} bg-zinc-100/95`;
  return `${base} hover:bg-zinc-50/90`;
}

function updatePosition() {
  const root = rootRef.value;
  if (!root) return;
  const rect = root.getBoundingClientRect();
  panelStyle.value = {
    top: `${rect.bottom + GAP_PX}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    minWidth: `${rect.width}px`,
  };
}

function syncHighlightToSelection() {
  const idx = props.options.findIndex((o) => isSelected(o));
  highlightedIndex.value = idx >= 0 ? idx : 0;
}

function close() {
  open.value = false;
  void nextTick(() => triggerRef.value?.focus());
}

function toggle() {
  if (isDisabled.value) return;
  open.value = !open.value;
}

function onOptionClick(opt: SelectOption) {
  if (opt.disabled) return;
  model.value = opt.value;
  close();
}

function onDocumentPointerDown(e: PointerEvent) {
  if (!open.value) return;
  const t = e.target as Node;
  if (rootRef.value?.contains(t)) return;
  if (panelRef.value?.contains(t)) return;
  close();
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === 'Escape') {
    close();
    e.preventDefault();
  }
}

function moveHighlight(delta: number) {
  const len = props.options.length;
  if (len === 0) return;
  let idx = highlightedIndex.value;
  for (let step = 0; step < len; step++) {
    idx = (idx + delta + len) % len;
    if (!props.options[idx]?.disabled) {
      highlightedIndex.value = idx;
      return;
    }
  }
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    moveHighlight(1);
    return;
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    moveHighlight(-1);
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const opt = props.options[highlightedIndex.value];
    if (opt && !opt.disabled) onOptionClick(opt);
  }
}

function bindViewportListeners() {
  window.addEventListener('scroll', updatePosition, true);
  window.addEventListener('resize', updatePosition);
}

function unbindViewportListeners() {
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('resize', updatePosition);
}

watch(open, async (isOpen) => {
  if (!isOpen) {
    unbindViewportListeners();
    document.removeEventListener('keydown', onDocumentKeydown, true);
    return;
  }
  syncHighlightToSelection();
  await nextTick();
  updatePosition();
  bindViewportListeners();
  document.addEventListener('keydown', onDocumentKeydown, true);
  await nextTick();
  panelRef.value?.focus();
});

watch(
  () => props.options,
  () => syncHighlightToSelection(),
  { deep: true },
);

watch(model, () => {
  if (open.value) syncHighlightToSelection();
});

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  document.removeEventListener('keydown', onDocumentKeydown, true);
  unbindViewportListeners();
});
</script>

<style scoped>
.select-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgb(212 212 216 / 0.85) transparent;
}
.select-scroll::-webkit-scrollbar {
  width: 6px;
}
.select-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0;
}
.select-scroll::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background-color: rgb(212 212 216 / 0.9);
}
.select-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(161 161 170 / 0.95);
}
</style>
