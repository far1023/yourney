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
    getSortedRowModel,
    OnChangeFn,
    PaginationState,
    SortingState,
    Table as reactTable,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Search } from 'lucide-react';
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
    addButtonText = "Add User",
    onAddClick,
    onSortingChange,
    initialSorting = [],
}: DataTableProps<TData, TValue> & {
    pageCount: number;
    pagination: PaginationState;
    setPagination: OnChangeFn<PaginationState>;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    addButtonText?: string;
    onAddClick?: () => void;
    onSortingChange?: OnChangeFn<SortingState>;
    initialSorting?: SortingState;
}) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    
    // Handle sorting changes - either use external handler or local state
    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
        setSorting(newSorting);
        if (onSortingChange) {
            onSortingChange(newSorting);
        }
    };
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: !!onSortingChange, // Manual sorting if external handler is provided
        pageCount,
        state: {
            pagination,
            columnVisibility,
            sorting,
        },
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: handleSortingChange,
        enableSorting: true,
        enableMultiSort: false,
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <div>
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
                        <SelectTrigger className="w-[100px]">
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
                </div>
                
                <div className="relative max-w-sm mx-4 flex-1 flex justify-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className="w-full pl-8"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
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
                    
                    {onAddClick && (
                        <Button className="gap-1" onClick={onAddClick}>
                            <Plus className="h-4 w-4" />
                            {addButtonText}
                        </Button>
                    )}
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // Get if the column is sortable
                                    const isSortable = header.column.getCanSort();
                                    // Get the current sort direction
                                    const sorted = header.column.getIsSorted();
                                    
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: header.getSize() !== 150 ? header.getSize() : undefined,
                                            }}
                                            className={`${
                                                header.column.columnDef.meta?.align === 'right'
                                                    ? 'text-right'
                                                    : ''
                                            } ${isSortable ? 'cursor-pointer select-none' : ''}`}
                                            onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                
                                                {isSortable && (
                                                    <div className="ml-1 flex h-4 w-4 items-center justify-center">
                                                        {sorted === 'asc' ? (
                                                            <ArrowUp className="h-3 w-3" />
                                                        ) : sorted === 'desc' ? (
                                                            <ArrowDown className="h-3 w-3" />
                                                        ) : (
                                                            <div className="h-3 w-3 text-transparent">·</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
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
        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground w-[240px]">
                Showing {startRow} to {endRow} of {totalRows} results
            </div>
            
            <div className="flex-1 flex justify-center">
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
            
            {/* Empty space for future content on right side */}
            <div className="w-[240px]"></div>
        </div>
    );
}
