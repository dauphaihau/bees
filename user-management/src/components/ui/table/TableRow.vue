<script setup lang="ts">
import { ParamsCallbackCell, TableColumn } from './types.ts';

defineProps<{
  item: ParamsCallbackCell;
  columns: TableColumn[];
}>();

</script>

<template>
  <tr class="table-row">
    <td
      v-for="(column, index) in columns"
      :key="index"
      class="cell h-8"
    >
      <template v-if="column?.cell">
        <component v-if="column?.renderType === 'vNode'" :is="column.cell(item)"/>
        <template v-else>
          {{ column.cell(item) }}
        </template>
      </template>
      <template v-else>
        {{ item.row[column.id] }}
      </template>
    </td>
  </tr>
</template>

<style scoped>
.table-row {
  @apply bg-white dark:bg-gray-800;
}

.table-row:hover {
  @apply bg-gray-50 dark:bg-gray-700;
}

.cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300;
}
</style>