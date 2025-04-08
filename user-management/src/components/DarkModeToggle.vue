<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <button
    @click="toggleDark()"
    class="toggle-button"
  >
    {{ isDark ? '🌞 Light' : '🌙 Dark' }}
  </button>
</template>

<style scoped>
.toggle-button {
  @apply px-4 py-2 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white;;
}
</style>