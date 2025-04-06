'use client';

import { IndeterminateCheckbox } from '@/components/ui/indeterminate-checkbox';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export type User = {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
    row_number?: number;
};

export const columns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex h-full w-full items-center justify-center">
                <IndeterminateCheckbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        // If checkbox is currently checked (all rows selected)
                        // or has indeterminate state (some rows selected)
                        // then clicking it should deselect all rows
                        if (table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()) {
                            table.toggleAllPageRowsSelected(false);
                        } else {
                            // If no rows are selected, select all rows
                            table.toggleAllPageRowsSelected(true);
                        }
                    }}
                    aria-label="Select all"
                    indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex h-full w-full items-center justify-center">
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false, // Cannot hide the select column
        size: 40,
    },
    // ID column - hidden by default
    {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: true,
        enableHiding: true,
        size: 80,
        // Initially hidden
        enableColumnFilter: true,
    },
    // Name column - visible by default
    {
        accessorKey: 'name',
        header: 'Name',
        enableSorting: true,
        enableHiding: true, // Can be hidden from column selector
        cell: ({ row, getValue, column, table }) => {
            // Access the cell's value
            const initialValue = getValue() as string;

            // For inline editing, we can use the meta property to store edit state
            return (
                <div
                    className="focus-within:ring-primary/20 h-full w-full rounded px-1 py-1 focus-within:ring-2"
                    data-editable-cell
                >
                    <input
                        className="w-full bg-transparent focus:outline-none"
                        value={initialValue}
                        onChange={(e) => {
                            // Get column meta info for the update handler
                            const updateData = column.columnDef.meta?.updateData;

                            // If an update handler is provided, call it with row ID and new value
                            if (updateData) {
                                updateData(row.original.id, e.target.value);
                            }
                        }}
                        onBlur={(e) => {
                            // Similar handling for blur event (when user is done editing)
                            const onCellBlur = column.columnDef.meta?.onCellBlur;
                            if (onCellBlur && e.target.value !== initialValue) {
                                onCellBlur(row.original.id, e.target.value);
                            }
                        }}
                    />
                </div>
            );
        },
    },
    // Email column - visible by default
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
        enableHiding: true, // Can be hidden from column selector
    },
    // Email Verified At column - hidden by default
    {
        accessorKey: 'email_verified_at',
        header: 'Verified at',
        enableSorting: true,
        enableHiding: true,
        sortingFn: 'datetime',
        cell: ({ row }) => {
            const date = row.getValue<string | Date | null>('email_verified_at');
            return date ? moment(date).format('DD MMMM YYYY HH:mm') : 'Not verified';
        },
    },

    // Password column (hashed) - hidden by default, limited display
    {
        accessorKey: 'password',
        header: 'Password Hash',
        enableSorting: false,
        enableHiding: true,
        cell: () => {
            return '••••••••'; // Always show dots for security
        },
    },

    // Remember Token column - hidden by default
    {
        accessorKey: 'remember_token',
        header: 'Remember Token',
        enableSorting: false,
        enableHiding: true,
        cell: ({ row }) => {
            const token = row.getValue<string | null>('remember_token');
            return token ? '••••••••' : 'None'; // Always show dots for security if exists
        },
    },

    // Created At column - hidden by default
    {
        id: 'Created at',
        accessorKey: 'created_at',
        header: 'Created at',
        enableSorting: true,
        enableHiding: true, // Can be hidden from column selector
        sortingFn: 'datetime',
        cell: ({ row }) => {
            const date = row.getValue<string | Date>('Created at');
            return date ? moment(date).format('DD MMMM YYYY') : '';
        },
    },

    // Updated At column - visible by default
    {
        id: 'Updated at',
        accessorKey: 'updated_at',
        header: 'Updated at',
        enableSorting: true,
        enableHiding: true, // Can be hidden from column selector
        sortingFn: 'datetime',
        cell: ({ row }) => {
            const date = row.getValue<string | Date>('Updated at');
            return date ? moment(date).format('DD MMMM YYYY') : '';
        },
    },
    {
        id: 'actions',
        meta: {
            align: 'right',
        },
        enableSorting: false,
        cell: ({ row, column }) => {
            const user = row.original;

            // These functions will be defined in the parent component and passed via column meta
            const onEdit = column.columnDef.meta?.onEdit;
            const onDelete = column.columnDef.meta?.onDelete;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(user)}>Edit user</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(user)}>Delete user</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableHiding: false,
    },
];
