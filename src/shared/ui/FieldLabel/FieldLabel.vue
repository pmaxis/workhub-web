<template>
  <label :for="forInput" :class="mergedClass" v-bind="restAttrs">
    <slot />
  </label>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';

defineOptions({ inheritAttrs: false });

defineProps<{
  forInput?: string;
}>();

const attrs = useAttrs();

const mergedClass = computed(() => ['mb-1 block text-xs uppercase tracking-wide text-zinc-500', attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
