<template>
  <td :class="mergedClass" v-bind="restAttrs">
    <slot />
  </td>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    align?: 'left' | 'right' | 'center';
    nowrap?: boolean;
    tone?: 'primary' | 'muted' | 'plain';
  }>(),
  { align: 'left', nowrap: false, tone: 'primary' },
);

const attrs = useAttrs();

const alignClass = computed(() => {
  switch (props.align) {
    case 'right':
      return 'text-right';
    case 'center':
      return 'text-center';
    default:
      return 'text-left';
  }
});

const toneClass = computed(() => {
  switch (props.tone) {
    case 'muted':
      return 'text-zinc-600';
    case 'plain':
      return '';
    default:
      return 'text-zinc-900';
  }
});

const nowrapClass = computed(() => (props.nowrap ? 'whitespace-nowrap' : ''));

const baseClass = computed(() => [
  'px-4 py-3 text-sm',
  alignClass.value,
  toneClass.value,
  nowrapClass.value,
]);

const mergedClass = computed(() => [...baseClass.value, attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
