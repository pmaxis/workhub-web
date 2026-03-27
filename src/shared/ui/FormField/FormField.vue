<template>
  <div>
    <FieldLabel :for-input="fieldId" :class="labelClass">
      <slot name="label">{{ label }}</slot>
    </FieldLabel>
    <Input v-if="as === 'input'" :id="fieldId" v-model="model" v-bind="controlAttrs" />
    <Textarea v-else-if="as === 'textarea'" :id="fieldId" v-model="model" v-bind="controlAttrs" />
    <Select
      v-else
      :id="fieldId"
      v-model="model"
      :options="selectOptions"
      :placeholder="selectPlaceholder"
      v-bind="controlAttrs"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';
import FieldLabel from '@/shared/ui/FieldLabel/FieldLabel.vue';
import Input from '@/shared/ui/Input/Input.vue';
import Select, { type SelectOption } from '@/shared/ui/Select/Select.vue';
import Textarea from '@/shared/ui/Textarea/Textarea.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    label?: string;
    as?: 'input' | 'textarea' | 'select';
    id?: string;
    labelClass?: string;
    options?: SelectOption[];
    selectPlaceholder?: string;
  }>(),
  { as: 'input' },
);

const model = defineModel<string | number | null>({ default: '' });

const selectOptions = computed(() => props.options ?? []);
const selectPlaceholder = computed(() => props.selectPlaceholder);

const attrs = useAttrs();
const autoId = useId();

const fieldId = computed(() => props.id ?? autoId);

const controlAttrs = computed(() => attrs);
</script>
