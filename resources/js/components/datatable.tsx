'use client';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableProps } from '@/types/datatable';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    OnChangeFn,
    PaginationState,
    Table as reactTable,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

interface DataTablePaginationProps {
    table: reactTable<any>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
}: DataTableProps<TData, TValue> & {
    pageCount: number;
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount,
        state: {
            pagination,
            columnVisibility,
        },
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex items-center gap-2">
                    <Select 
                        value={pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            const size = parseInt(value);
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 0, // Reset to first page when changing page size
                                pageSize: size,
                            }));
                        }}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Page size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 items</SelectItem>
                            <SelectItem value="10">10 items</SelectItem>
                            <SelectItem value="20">20 items</SelectItem>
                            <SelectItem value="30">30 items</SelectItem>
                            <SelectItem value="40">40 items</SelectItem>
                            <SelectItem value="50">50 items</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-sm">items per page</span>
                </div>
                <div className="relative max-w-sm ml-auto">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="max-w-sm pl-8"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-3">
                            Show columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: header.getSize() !== 150 ? header.getSize() : undefined,
                                            }}
                                            className={
                                                header.column.columnDef.meta?.align === 'right'
                                                    ? 'text-right'
                                                    : undefined
                                            }
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                cell.column.columnDef.meta?.align === 'right'
                                                    ? 'text-right'
                                                    : undefined
                                            }
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

function DataTablePagination({ table }: DataTablePaginationProps) {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();
    // Since we're using manual pagination, we need to access the table's original data length
    // from the props if available, otherwise use an estimate from page count
    const totalRows = pageCount * pageSize; // This is an estimate
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

    const handlePreviousPage = () => {
        if (table.getCanPreviousPage()) {
            table.previousPage();
        }
    };

    const handleNextPage = () => {
        if (table.getCanNextPage()) {
            table.nextPage();
        }
    };

    const handlePageClick = (page: number) => {
        table.setPageIndex(page - 1);
    };

    return (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
                Showing {startRow} to {endRow} of {totalRows} results
            </div>
            
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            aria-disabled={!table.getCanPreviousPage()}
                            className={
                                !table.getCanPreviousPage() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }
                            onClick={handlePreviousPage}
                        />
                    </PaginationItem>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                className="cursor-pointer"
                                isActive={pageIndex + 1 === page}
                                onClick={() => handlePageClick(page)}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            aria-disabled={!table.getCanNextPage()}
                            className={!table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                            onClick={handleNextPage}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
