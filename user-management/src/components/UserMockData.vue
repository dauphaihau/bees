<script setup lang="ts">
import Table from './ui/table/index.vue';
import Pagination from './ui/Pagination.vue';
import { users as usersData } from '../data/users.ts';
import { computed, h, ref, watch } from 'vue';
import { TUser } from '../types/user.ts';
import { formatCurrency } from '../utils';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Badge from './ui/Badge.vue';
import Checkbox from './ui/Checkbox.vue';
import SearchBar from './SearchBar.vue';
import { TableColumn, TableSorting } from './ui/table/types.ts';

const formatRegisterAt = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

const tableRef = ref();
const pageSizeOptions = ref([10, 20, 50]);
const searchQuery = ref('');
const virtualMode = ref(false);
const users = ref<TUser[]>(usersData);
const rowSelection = ref<Record<string, boolean>>({});

const sorting = ref<TableSorting>({
  id: '',
  direction: 'none'
});

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: users.value.length,
});

const columns: TableColumn<TUser>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return h(Checkbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
      });
    },
    renderType: 'vNode',
    cell: ({ row }) => {
      return h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean) => row.toggleSelection(value),
      });
    },
  },
  {
    id: 'name',
    header: 'Name',
  },
  {
    id: 'balance',
    header: 'Balance',
    cell: ({ row }) => {
      return formatCurrency(row.balance);
    },
  },
  {
    id: 'email',
    header: 'Email',
    renderType: 'vNode',
    cell: ({ row }) => {
      return h('a', {
        href: `mailto:${row.email}`,
        class: 'text-blue-600 dark:text-blue-400 hover:underline',
      }, row.email);
    },
  },
  {
    id: 'registerAt',
    header: 'Registration',
    renderType: 'vNode',
    cell: ({ row }) => {
      return h('span', {
        title: format(row?.registerAt, 'yyyy-MM-dd HH:mm:ss'), // hover show full date & time
      }, formatRegisterAt(row.registerAt));
    },
  },
  {
    id: 'active',
    header: 'Active',
    renderType: 'vNode',
    cell: ({ row }) => {
      return h(Badge, {
        text: row?.active ? 'Active' : 'Inactive',
        variant: row?.active ? 'success' : 'danger',
      });
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    renderType: 'vNode',
    cell: () => {
      return h('div', { class: 'flex space-x-2' }, [
        h('button', {
          class: 'edit-button',
          onClick: () => {
            // Handle click event
          },
        }, [
          h(PencilIcon, { class: 'size-5' }),
        ]),
        h('button', {
          class: 'edit-button',
          onClick: () => {
            // Handle click event
          },
        }, [
          h(TrashIcon, { class: 'size-5' }),
        ]),
      ]);
    },
  },
];

// Filtering
const filteredUsers = computed(() => {
  return users.value.filter(item => {
    const searchLower = searchQuery.value.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      formatCurrency(item.balance).includes(searchLower) ||
      formatRegisterAt(item.registerAt).includes(searchLower)
    );
  });
});

const sortedUsers = computed(() => {
  if (!sorting.value.id) return filteredUsers.value;
  return [...filteredUsers.value].sort((a, b) => {
    let aValue = a[sorting.value.id as keyof typeof a] as any;
    let bValue = b[sorting.value.id as keyof typeof b] as any;

    if (
      sorting.value.id === 'registerAt' &&
      aValue instanceof Date &&
      bValue instanceof Date
    ) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (
      (
        sorting.value.id === 'name' ||
        sorting.value.id === 'email' ||
        sorting.value.id === 'active'
      ) &&
      typeof aValue === 'string' &&
      typeof bValue === 'string'
    ) {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sorting.value.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sorting.value.direction === 'asc' ? 1 : -1;
    return 0;
  });
});

// Track loaded items for virtual scrolling
const loadedItemCount = ref(pagination.value.pageSize);

// Pagination or Virtualization
const displayedUsers = computed(() => {
  // Update total items count
  pagination.value.totalItems = sortedUsers.value.length;
  
  if (virtualMode.value) {
    // In virtual mode, display all loaded items up to the current loaded count
    return sortedUsers.value.slice(0, loadedItemCount.value);
  } else {
    // In normal pagination mode, display only the current page
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    return sortedUsers.value.slice(start, end);
  }
});

const changeRowsPerPage = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  pagination.value.pageSize = parseInt(select.value);
  pagination.value.currentPage = 1;
  
  // Reset loaded items when changing page size
  if (virtualMode.value) {
    tableRef.value?.resetScroll();
    loadedItemCount.value = pagination.value.pageSize;
  }
};

const handleLoadMore = () => {
  if (virtualMode.value) {
    // In virtual mode, increase the number of loaded items
    loadedItemCount.value += pagination.value.pageSize;
    console.log('Loading more items, total loaded:', loadedItemCount.value);
  } else {
    // In normal mode, increase page number
    pagination.value.currentPage += 1;
  }
}

watch(searchQuery, () => {
  pagination.value.currentPage = 1;
  // Reset loaded items when search query changes
  if (virtualMode.value) {
    loadedItemCount.value = pagination.value.pageSize;
  }
});

// Reset loaded items when switching modes
watch(virtualMode, () => {
  if (virtualMode.value) {
    loadedItemCount.value = pagination.value.pageSize;
    pageSizeOptions.value = [15, 30, 50];
  }
  else {
    pageSizeOptions.value = [10, 25, 50];
  }
  pagination.value.pageSize = pageSizeOptions.value[0];
});

</script>

<template>
  <div class="header-container">
    <div class="search-section">
      <SearchBar v-model="searchQuery"/>
      <div class="virtual-toggle">
        <input
          type="checkbox"
          v-model="virtualMode"
          class="toggle-checkbox"
        >
        <label class="toggle-label">Virtual Mode</label>
      </div>
    </div>
  </div>

  <Table
    ref="tableRef"
    :mode="virtualMode ? 'virtual' : 'normal'"
    :data="displayedUsers"
    :columns="columns"
    v-model:rows-selection="rowSelection"
    v-model:pagination="pagination"
    @load-more="handleLoadMore"
    v-model:sorting="sorting"

  />

  <div class="flex justify-between items-center mt-4">
    <div class="flex items-center gap-3 text-gray-500 dark:text-gray-300">
      <span class="text">Rows per page:</span>
      <select
        :value="pagination.pageSize"
        class="select"
        @change="changeRowsPerPage"
      >
        <option
          v-for="pageSize in pageSizeOptions"
          :value="pageSize"
          :label="pageSize.toString()"
        />
      </select>
      <span class="results-count">
        {{ pagination.totalItems }} results
      </span>
    </div>

    <Pagination
      v-if="!virtualMode"
      class="mt-4"
      v-model:pagination="pagination"
    />
  </div>
</template>

<style scoped>

.select {
  @apply ml-2 border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white;
}

.virtual-toggle {
  @apply flex items-center space-x-2;
}

.header-container {
  @apply bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center;
}

.toggle-label {
  @apply text-sm text-gray-600 dark:text-gray-300;
}

.search-section {
  @apply flex items-center space-x-8;
}
</style>