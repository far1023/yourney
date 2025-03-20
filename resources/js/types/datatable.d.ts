import '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';

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
};

export type DataTablePaginationProps = {
    table: Table<any>;
};

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends unknown, TValue> {
        align?: 'left' | 'center' | 'right';
    }
}
