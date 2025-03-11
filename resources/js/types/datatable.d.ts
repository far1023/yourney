import { ColumnDef } from '@tanstack/react-table';

export type DataTableResponse = {
    current_page: number;
    data: User[];
    last_page: number;
    per_page: number;
};

export type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
};

export type DataTablePaginationProps = {
    table: Table<any>;
};
