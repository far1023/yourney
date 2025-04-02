'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import moment from 'moment';
import { IndeterminateCheckbox } from '@/components/ui/indeterminate-checkbox';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type User = {
    id: string;
    name: string;
    email: string;
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
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: 'name',
        header: 'Fullname',
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
    },
    {
        id: 'Last update',
        accessorKey: 'updated_at',
        header: 'Last update',
        enableSorting: true,
        sortingFn: 'datetime',
        cell: ({ row }) => {
            const date = row.getValue<string | Date>('Last update');
            return moment(date).format('DD MMMM YYYY');
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
                <div className="flex justify-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => onEdit?.(user)}
                                >
                                    <span className="sr-only">Edit user</span>
                                    <Edit className="h-4 w-4 text-blue-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit user</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => onDelete?.(user)}
                                >
                                    <span className="sr-only">Delete user</span>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete user</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
        enableHiding: false,
    },
];
