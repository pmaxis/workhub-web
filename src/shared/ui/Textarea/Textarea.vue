<template>
  <textarea v-model="model" :class="mergedClass" v-bind="restAttrs" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';

defineOptions({ inheritAttrs: false });

const model = defineModel<string | number | null>({ default: '' });

const attrs = useAttrs();

const baseClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors duration-200 focus:border-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100';

const mergedClass = computed(() => [baseClass, attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
