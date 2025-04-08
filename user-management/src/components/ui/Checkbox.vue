<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean | string;
  id?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};

const inputId = computed(() => props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="flex items-center">
    <input
      :id="inputId"
      type="checkbox"
      :checked="Boolean(modelValue)"
      @change="toggle"
      :disabled="disabled"
      class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
    />
  </div>
</template> 