<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useDebounceFn } from '@vueuse/core';

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputValueModel = defineModel<string>();

const debouncedFn = useDebounceFn((e) => {
  const ele = e.target as HTMLInputElement;
  inputValueModel.value = ele.value;
}, 300)

</script>

<template>
  <div class="relative">
    <MagnifyingGlassIcon class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      :value="modelValue"
      @input="debouncedFn"
      placeholder="Search users..."
      class="search-input"
    >
  </div>
</template>

<style scoped>
.search-input {
  @apply pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
  dark:bg-gray-700 dark:border-gray-600 dark:text-white;;
}
</style>