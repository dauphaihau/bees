import { VNode } from 'vue';

export type ParamsCallbackCell<T = Record<string, unknown>> = {
  row: T & {
    getIsSelected: () => boolean;
    toggleSelection: (value: boolean) => void;
  }
}

export type ParamsCallbackHeader = {
  table: {
    getIsSomePageRowsSelected: () => boolean;
    getIsAllPageRowsSelected: () => boolean;
    toggleAllPageRowsSelected: (value: boolean | 'indeterminate') => void;
  }
}

export type TableColumn<T = Record<string, unknown>> = {
  id: string;
  header?: string | ((params: ParamsCallbackHeader) => VNode);
  cell?: (params: ParamsCallbackCell<T>) => string | VNode;
  renderType?: 'vNode',
}

export type TableSorting = {
  id: string;
  direction: 'asc' | 'desc' | 'none';
}

