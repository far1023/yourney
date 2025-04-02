import '@tanstack/react-table';
import { ColumnDef, OnChangeFn, RowSelectionState, SortingState } from '@tanstack/react-table';

export type DataTableResponse = {
    current_page: number;
    data: User[];
    last_page: number;
    per_page: number;
    total: number;
};

export type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    addButtonText?: string; // Optional text for add button
    onAddClick?: () => void; // Optional callback for add button
    initialSorting?: SortingState; // Optional initial sorting state
    onSortingChange?: OnChangeFn<SortingState>; // Optional callback for sorting changes
    initialRowSelection?: RowSelectionState; // Optional initial row selection state
    onRowSelectionChange?: OnChangeFn<RowSelectionState>; // Optional callback for row selection changes
};

export type DataTablePaginationProps = {
    table: Table<any>;
};

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends unknown, TValue> {
        align?: 'left' | 'center' | 'right';
        onEdit?: (data: TData) => void;
        onDelete?: (data: TData) => void;
    }
}
