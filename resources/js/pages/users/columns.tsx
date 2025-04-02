'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import moment from 'moment';

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
        accessorKey: 'row_number',
        header: '#',
        size: 60,
        enableResizing: false,
        enableHiding: false,
        enableSorting: false, // No sorting for row number
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
