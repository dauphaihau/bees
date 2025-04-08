<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid';

export type Pagination = {
  currentPage: number
  pageSize: number
  totalItems: number
}

const paginationModel = defineModel<Pagination>('pagination', {
  default: {
    currentPage: 1,
    pageSize: 10
  },
});

const props = withDefaults(defineProps<{
  siblingsCount?: number
}>(), {
  siblingsCount: 2
});

const totalPages = computed(() => {
  return Math.ceil(paginationModel.value.totalItems / paginationModel.value.pageSize)
});

const canGoPrevious = computed(() => paginationModel.value.currentPage > 1);
const canGoNext = computed(() => paginationModel.value.currentPage < totalPages.value);

const setPage = (page: number) => {
  paginationModel.value.currentPage = page
};

const goToPreviousPage = () => {
  if (canGoPrevious.value) {
    setPage(paginationModel.value.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (canGoNext.value) {
    setPage(paginationModel.value.currentPage + 1);
  }
};

const paginationRange = computed(() => {
  const currentPage = paginationModel.value.currentPage;
  const range: (number | string)[] = [];
  
  // Always add first page
  range.push(1);
  
  // Calculate range start and end
  const rangeStart = Math.max(2, currentPage - props.siblingsCount);
  const rangeEnd = Math.min(totalPages.value - 1, currentPage + props.siblingsCount);
  
  // Add left ellipsis if needed
  if (rangeStart > 2) {
    range.push('...');
  }
  
  // Add page numbers
  for (let i = rangeStart; i <= rangeEnd; i++) {
    range.push(i);
  }
  
  // Add right ellipsis if needed
  if (rangeEnd < totalPages.value - 1) {
    range.push('...');
  }
  
  // Add last page if it's not the first page
  if (totalPages.value > 1) {
    range.push(totalPages.value);
  }
  
  return range;
});

</script>

<template>
  <div class="pagination-container">
    <div class="page-buttons">
      <!-- Previous button -->
      <button 
        @click="goToPreviousPage" 
        :disabled="!canGoPrevious"
        class="page-button nav-button"
        :class="{ disabled: !canGoPrevious }"
      >
        <ChevronLeftIcon class="size-4"/>
      </button>
      
      <!-- Page buttons -->
      <template v-for="(item) in paginationRange" :key="index">
        <button
          v-if="typeof item === 'number'"
          @click="setPage(item)"
          class="page-button"
          :class="{ active: paginationModel.currentPage === item }"
        >
          {{ item }}
        </button>
        <span v-else class="ellipsis">{{ item }}</span>
      </template>
      
      <!-- Next button -->
      <button 
        @click="goToNextPage" 
        :disabled="!canGoNext"
        class="page-button nav-button"
        :class="{ disabled: !canGoNext }"
      >
        <ChevronRightIcon class="size-4"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination-container {
  @apply bg-white dark:bg-gray-800 dark:border-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6;
}

.page-buttons {
  @apply flex items-center space-x-2;
}

.page-button {
  @apply px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-50;
}

.page-button.active {
  @apply bg-blue-600 text-white;
}

.page-button.disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-transparent;
}

.page-button:not(.active) {
  @apply dark:text-gray-300;
}

.nav-button {
  @apply font-bold;
}

.ellipsis {
  @apply px-3 py-1 text-sm text-gray-500 dark:text-gray-400;
}

.page-button:hover:not(.active):not(.disabled) {
  @apply dark:bg-gray-700;
}
</style>