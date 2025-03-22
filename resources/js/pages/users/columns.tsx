'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    },
    {
        accessorKey: 'name',
        header: 'Fullname',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        id: 'Last update',
        accessorKey: 'updated_at',
        header: 'Last update',
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
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View user details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableHiding: false,
    },
];
