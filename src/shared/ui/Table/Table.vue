<template>
  <table :class="mergedClass" v-bind="restAttrs">
    <slot />
  </table>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    fixed?: boolean;
  }>(),
  { fixed: false },
);

const attrs = useAttrs();

const baseClass = computed(() => {
  const c = ['min-w-full divide-y divide-zinc-200'];
  if (props.fixed) c.push('table-fixed');
  return c;
});

const mergedClass = computed(() => [...baseClass.value, attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
