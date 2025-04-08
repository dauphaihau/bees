<script setup lang="ts">
import Table from './ui/table/index.vue';
import Pagination from './ui/Pagination.vue';
import { h, ref, watch, onMounted } from 'vue';
import { TUserServer, TUserApiResponse } from '../types/user.ts';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Checkbox from './ui/Checkbox.vue';
import SearchBar from './SearchBar.vue';
import { TableColumn, TableSorting } from './ui/table/types.ts';

const pageSizeOptions = ref([10, 20, 50]);
const searchQuery = ref('');
const virtualMode = ref(false);
// const virtualMode = ref(true);
const users = ref<TUserServer[]>([]);
const rowSelection = ref<Record<string, boolean>>({});
const isLoading = ref(false);
const errorMsg = ref<string>();
const isFetchingNextPage = ref(false);
const tableRef = ref();

const pagination = ref({
  currentPage: 1,
  pageSize: pageSizeOptions.value[0],
  totalItems: 0,
});

const sorting = ref<TableSorting>({
  id: '',
  direction: 'none',
});

const columns: TableColumn<TUserServer>[] = [
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
    cell: ({ row }) => `${row.firstName} ${row.lastName}`,
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
    id: 'age',
    header: 'Age',
  },
  {
    id: 'birthDate',
    header: 'Birth Date',
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
            // Handle edit
          },
        }, [
          h(PencilIcon, { class: 'size-5' }),
        ]),
        h('button', {
          class: 'edit-button',
          onClick: () => {
            // Handle delete
          },
        }, [
          h(TrashIcon, { class: 'size-5' }),
        ]),
      ]);
    },
  },
];

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    // Build API URL with query parameters
    const limit = pagination.value.pageSize;
    const skip = (pagination.value.currentPage - 1) * pagination.value.pageSize;

    // Build the API URL with search, sort, pagination
    let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

    // Add search if provided
    if (searchQuery.value) {
      url = `https://dummyjson.com/users/search?limit=${limit}&skip=${skip}`;
      url += `&q=${encodeURIComponent(searchQuery.value)}`;
    }

    // Add sorting if provided
    if (sorting.value.id && sorting.value.direction) {
      url += `&sortBy=${sorting.value.id}&order=${sorting.value.direction}`;
    }

    const response = await fetch(url);

    // for test delay
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: TUserApiResponse = await response.json();

    pagination.value.totalItems = data.total;
    if (virtualMode.value) {
      users.value = [...users.value, ...data.users];
    }
    else {
      users.value = data.users;
    }
  }
  catch (error) {
    console.error('Error fetching users:', error);
    errorMsg.value = 'Error fetching users';
  }
  finally {
    isLoading.value = false;
  }
};

const changeRowsPerPage = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  pagination.value.pageSize = parseInt(select.value);
  pagination.value.currentPage = 1;
  // Reset scroll position when changing rows per page
  tableRef.value?.resetScroll();
  fetchUsers();
};

const handleLoadMore = () => {
  if (pagination.value.currentPage >= Math.ceil(pagination.value.totalItems / pagination.value.pageSize)) {
    return;
  }
  isFetchingNextPage.value = true;
  pagination.value.currentPage += 1;
};

watch([searchQuery, sorting], () => {
  pagination.value.currentPage = 1;
  users.value = [];
  fetchUsers();
}, { deep: true, immediate: true });

watch(() => pagination.value.currentPage, () => {
  if (!virtualMode.value || pagination.value.currentPage === 1) {
    fetchUsers();
  }
  else {
    fetchUsers().finally(() => {
      isFetchingNextPage.value = false;
    });
  }
});

watch(virtualMode, () => {
  pagination.value.currentPage = 1;
  // pagination.value.pageSize = virtualMode ? 15 : 10;
  if (virtualMode.value) {
    pageSizeOptions.value = [15, 30, 50];
  }
  else {
    pageSizeOptions.value = [10, 25, 50];
  }
  pagination.value.pageSize = pageSizeOptions.value[0];
});

onMounted(() => {
  fetchUsers();
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
          class="toggle-checkbox mr-2"
        >
        <label class="toggle-label">Virtual Mode</label>
      </div>
    </div>
  </div>

  <Table
    ref="tableRef"
    :columns="columns"
    :loading="virtualMode ? (pagination.currentPage === 1 ? isLoading : false) : isLoading"
    :error="errorMsg"
    :mode="virtualMode ? 'virtual' : 'normal'"
    :data="users"
    v-model:rows-selection="rowSelection"
    v-model:pagination="pagination"
    :is-loading-more="isFetchingNextPage"
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