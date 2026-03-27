<template>
  <form :class="mergedClass" v-bind="restAttrs">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { omitClassFromAttrs } from '@/shared/utils/omitClassFromAttrs';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const mergedClass = computed(() => ['space-y-4', attrs.class]);

const restAttrs = computed(() => omitClassFromAttrs(attrs));
</script>
