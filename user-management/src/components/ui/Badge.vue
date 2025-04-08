<script setup lang="ts">
interface Props {
  text: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

const variantClasses = {
  success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  danger: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
};
</script>

<template>
  <span 
    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
    :class="variantClasses[variant]"
  >
    {{ text }}
  </span>
</template> 