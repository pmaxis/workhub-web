<template>
  <div ref="rootRef" class="relative inline-flex">
    <button
      ref="buttonRef"
      type="button"
      class="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-0"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-label="ariaLabel"
      @click.stop="toggle"
    >
      <Icon name="ellipsis-vertical" />
    </button>
  </div>
  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      class="fixed z-200 min-w-44 rounded-lg border border-zinc-200 bg-white py-1 text-left shadow-lg"
      :style="panelStyle"
      role="menu"
      @click="close"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/shared/ui/Icon/Icon.vue';

const props = withDefaults(
  defineProps<{
    align?: 'end' | 'start';
    ariaLabel?: string;
  }>(),
  {
    align: 'end',
    ariaLabel: 'Дії',
  },
);

const GAP_PX = 4;

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const panelStyle = ref<Record<string, string>>({});

function close() {
  open.value = false;
}

function toggle() {
  open.value = !open.value;
}

function updatePosition() {
  const btn = buttonRef.value;
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  if (props.align === 'end') {
    panelStyle.value = {
      top: `${rect.bottom + GAP_PX}px`,
      right: `${window.innerWidth - rect.right}px`,
      left: 'auto',
    };
  } else {
    panelStyle.value = {
      top: `${rect.bottom + GAP_PX}px`,
      left: `${rect.left}px`,
      right: 'auto',
    };
  }
}

function onDocumentPointerDown(e: PointerEvent) {
  const t = e.target as Node;
  if (rootRef.value?.contains(t)) return;
  if (panelRef.value?.contains(t)) return;
  close();
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
    return;
  }
  await nextTick();
  updatePosition();
  bindViewportListeners();
});

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  unbindViewportListeners();
});

defineExpose({ panelRef });
</script>
