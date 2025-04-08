<script setup lang="ts">

import { ParamsCallbackHeader, TableColumn, TableSorting } from './types.ts';

defineOptions({
  name: 'Table',
});

import { Pagination } from '../Pagination.vue';
import { ref, computed, onMounted } from 'vue';
import { useDark } from '@vueuse/core';
import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

// data: Array<{ id: string } & Record<string, any>>;

const props = defineProps<{
  data: unknown[]
  columns: TableColumn<any>[];
  mode?: 'normal' | 'virtual';
  virtualItemSize?: number;
  virtualBufferSize?: number;
  loading?: boolean;
  isLoadingMore?: boolean;
  initialLoading?: boolean;
  error?: string;
}>();

const paginationModel = defineModel<Pagination>('pagination', {
  default: () => {},
});

const sortingModel = defineModel<TableSorting>('sorting', {
  default: () => ({
    id: '',
    direction: 'none',
  }),
});

const rowsSelectionModel = defineModel<Record<string, boolean>>('rows-selection', {
  default: () => {},
});

const emits = defineEmits(['loadMore']);

const isDark = useDark();

// Virtual scrolling and pagination handling
const tableContainerRef = ref<HTMLElement | null>(null);
const isScrolledToBottom = ref(false);

const isVirtualMode = computed(() => props.mode === 'virtual');

const dataComputed = computed(() => {
  if (!props.data) return [];

  return props.data.map((item: any) => {
    return {
      row: {
        ...item,
        getIsSelected: () => rowsSelectionModel.value[item.id],
        toggleSelection: (value: boolean) => {
          rowsSelectionModel.value[item.id] = value;
        },
      },
    };
  });
});

// Calculate loading cell height based on pagination page size
const loadingCellHeight = computed(() => {
  const rowHeight = 53; // Each TableRow is 53px (h-8 + py-4)
  const pageSize = paginationModel.value?.pageSize || 10;
  return `${pageSize * rowHeight}px`;
});

// Calculate empty rows needed to fill the table to match page size
const emptyRowsCount = computed(() => {
  if (dataComputed.value.length === 0) return 0;
  const pageSize = paginationModel.value?.pageSize || 10;
  return Math.max(0, pageSize - dataComputed.value.length);
});

const toggleAllPageRowsSelected = (value: boolean | 'indeterminate') => {
  if (value === true) {
    dataComputed.value.forEach(item => {
      rowsSelectionModel.value[item.row.id] = true;
    });
  }
  else {
    dataComputed.value.forEach(item => {
      rowsSelectionModel.value[item.row.id] = false;
    });
  }
};

const getIsSomePageRowsSelected = () => {
  return dataComputed.value.some(item => rowsSelectionModel.value[item.row.id]) &&
    !dataComputed.value.every(item => rowsSelectionModel.value[item.row.id]);
};

const getIsAllPageRowsSelected = () => {
  return dataComputed.value.length > 0 &&
    dataComputed.value.every(item => rowsSelectionModel.value[item.row.id]);
};

const tableMethods: ParamsCallbackHeader['table'] = {
  getIsSomePageRowsSelected,
  getIsAllPageRowsSelected,
  toggleAllPageRowsSelected,
};

// Add method to reset scroll position
const resetScroll = () => {
  if (tableContainerRef.value) {
    tableContainerRef.value.scrollTop = 0;
  }
};

// Expose methods via template ref
defineExpose({
  resetScroll
});

// Handle scroll events for virtual mode
const handleScroll = () => {
  if (!isVirtualMode.value || !tableContainerRef.value) return;

  const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.value;
  const threshold = 30; // pixels from bottom to trigger loading

  // Check if scrolled near bottom
  if (scrollHeight - scrollTop - clientHeight < threshold) {
    if (!isScrolledToBottom.value && !props.isLoadingMore && !props.loading && !props.error) {
      isScrolledToBottom.value = true;
      handleEndReached();
    }
  }
  else {
    isScrolledToBottom.value = false;
  }
};

const handleEndReached = () => {
  if (props.isLoadingMore || props.loading) return;
  emits('loadMore');
};

// Set up scroll listener when component is mounted
onMounted(() => {
  if (isVirtualMode.value && tableContainerRef.value) {
    tableContainerRef.value.addEventListener('scroll', handleScroll);
  }
});

</script>

<template>
  <div :class="{ 'dark': isDark }">
    <div
      class="table-container"
      :class="{'h-[550px]': isVirtualMode}"
      ref="tableContainerRef"
      @scroll="isVirtualMode ? handleScroll() : null"
    >
      <table class="data-table w-full h-full">
        <TableHeader
          class="sticky top-0"
          :columns="columns"
          :table-methods="tableMethods"
          v-model:sorting="sortingModel"
        />
        <tbody class="table-body">
          <tr v-if="props.loading" class="h-full">
            <td
              :colspan="columns.length"
              class="table-loading-container"
              :style="{ height: loadingCellHeight }"
            >
              <div class="initial-loading-indicator">
                <div class="loading-spinner"></div>
                <span class="text-gray-500 dark:text-gray-300">Loading data...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="props.error" class="h-full">
            <td
              :colspan="columns.length"
              class="table-loading-container"
              :style="{ height: loadingCellHeight }"
            >
              <div class="error-indicator">
                <span class="error-icon">!</span>
                <span>{{ props.error || 'Something went wrong' }}</span>
                <button @click="" class="retry-button">Retry</button>
              </div>
            </td>
          </tr>
          <tr v-else-if="dataComputed.length === 0" class="h-full">
            <td
              :colspan="columns.length"
              class="table-empty-container"
              :style="{ height: loadingCellHeight }"
            >
              <div class="empty-indicator">
                <span class='text-gray-500 dark:text-gray-300'>No data to display</span>
              </div>
            </td>
          </tr>
          <template v-else-if="!props.loading">
            <TableRow
              v-for="(item, idx) in dataComputed"
              :key="idx"
              :item="item"
              :columns="columns"
            />
            <!-- Empty rows to maintain consistent height -->
            <tr 
              v-for="i in emptyRowsCount" 
              :key="`empty-${i}`"
              class="empty-row"
            >
              <td :colspan="columns.length" class="h-[53px]"></td>
            </tr>
          </template>

          <!-- Loading indicator row -->
          <tr
            v-if="isVirtualMode && props.isLoadingMore"
            class="loading-row"
          >
            <td :colspan="columns.length" class="loading-cell">
              <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <span class="text-gray-500 dark:text-gray-300">Loading more data...</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  @apply overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow;
  overflow-y: auto; /* Ensure vertical scrolling is enabled */
}

.data-table {
  @apply min-w-full divide-y divide-gray-200 dark:divide-gray-700;
}

.table-body {
  @apply bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700;
}

/* Loading indicator styles */
.loading-row {
  @apply bg-gray-50 dark:bg-gray-700;
}

.loading-cell {
  @apply py-4 text-center;
}

.loading-indicator {
  @apply flex items-center justify-center space-x-2;
}

.loading-spinner {
  @apply w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin;
}

.error-indicator {
  @apply flex flex-col items-center justify-center space-y-3 text-red-600 dark:text-red-400;
}

.error-icon {
  @apply inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold dark:bg-red-800 dark:text-red-400;
}

.retry-button {
  @apply ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600;
}

.table-loading-container, .table-empty-container {
  @apply text-center;
  display: table-cell;
  vertical-align: middle;
}

.initial-loading-indicator, .empty-indicator {
  @apply flex flex-col items-center justify-center space-y-3;
}

.empty-row {
  @apply bg-white dark:bg-gray-800;
}
</style>