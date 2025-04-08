<script setup lang="ts">

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import { TableColumn, TableSorting } from './types.ts';

defineProps<{
  columns: TableColumn[];
  tableMethods: any
}>();

const disabledIds = ['select', 'actions'];

const sortingModel = defineModel<TableSorting>('sorting', {
  default: () => ({
    id: '',
    direction: 'none',
  }),
});

const cycleSortingDirection = (column: TableColumn['id']) => {
  if (sortingModel.value.id === column) {
    // Cycle through: none -> asc -> desc -> none
    if (sortingModel.value.direction === 'none') {
      sortingModel.value.direction = 'asc';
    }
    else if (sortingModel.value.direction === 'asc') {
      sortingModel.value.direction = 'desc';
    }
    else {
      sortingModel.value.direction = 'none';
      sortingModel.value.id = '';
    }
  }
  else {
    sortingModel.value.id = column;
    sortingModel.value.direction = 'asc';
  }
};
</script>

<template>
  <thead class="table-header">
    <tr>
      <th
        v-for="column in columns"
        :key="column.id"
        scope="col"
        class="column-header"
        @click="disabledIds.includes(column.id) ? undefined : cycleSortingDirection(column.id)"
      >
        <template v-if="column?.header">
          <div class="header-content">
            <template v-if="typeof column.header === 'string'">
              {{ column.header }}
            </template>

            <component v-else :is="column.header({ table: tableMethods})"/>

            <div v-if="sortingModel.id === column.id && sortingModel.direction !== 'none'" class="inline-block">
              <ChevronUpIcon v-if="sortingModel.direction === 'asc'" class="sort-icon"/>
              <ChevronDownIcon v-else class="sort-icon"/>
            </div>
          </div>
        </template>
      </th>
    </tr>
  </thead>
</template>

<style scoped>
.table-header {
  @apply bg-gray-50 dark:bg-gray-700;
}

.column-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer;
}

.header-content {
  @apply flex items-center space-x-1;
}

.sort-icon {
  @apply h-4 w-4;
}

</style>