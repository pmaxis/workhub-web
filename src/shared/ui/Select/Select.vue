<template>
  <select v-model="model" :class="mergedClass" v-bind="restAttrs">
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option
      v-for="(opt, i) in options"
      :key="`${String(opt.value)}-${i}`"
      :value="opt.value"
      :disabled="opt.disabled"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';

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

const baseClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100';

const mergedClass = computed(() => [baseClass, attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
