<template>
  <component :is="iconComponent" :class="mergedClass" v-bind="restAttrs" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';
import IconBell from '@/shared/ui/Icon/icons/IconBell.vue';
import IconChevronLeft from '@/shared/ui/Icon/icons/IconChevronLeft.vue';
import IconCopy from '@/shared/ui/Icon/icons/IconCopy.vue';
import IconEllipsisVertical from '@/shared/ui/Icon/icons/IconEllipsisVertical.vue';
import IconFunnel from '@/shared/ui/Icon/icons/IconFunnel.vue';
import IconPencil from '@/shared/ui/Icon/icons/IconPencil.vue';

defineOptions({ inheritAttrs: false });

export type IconName =
  | 'chevron-left'
  | 'copy'
  | 'ellipsis-vertical'
  | 'bell'
  | 'pencil'
  | 'funnel';

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'md' },
);

const attrs = useAttrs();

const iconMap = {
  'chevron-left': IconChevronLeft,
  copy: IconCopy,
  bell: IconBell,
  'ellipsis-vertical': IconEllipsisVertical,
  pencil: IconPencil,
  funnel: IconFunnel,
} as const;

const iconComponent = computed(() => iconMap[props.name]);

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-3.5 w-3.5 shrink-0';
    case 'lg':
      return 'h-5 w-5 shrink-0';
    default:
      return 'h-4 w-4 shrink-0';
  }
});

const mergedClass = computed(() => [sizeClass.value, attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
