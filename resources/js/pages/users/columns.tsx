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
import { useState } from 'react';

export type User = {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    row_number?: number;
};

export function useUserDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const openDrawer = (user: User) => {
        setSelectedUser(user);
        setIsOpen(true);
    };

    return {
        isOpen,
        setIsOpen,
        selectedUser,
        openDrawer,
    };
}

export const tableColumns = (drawerState: ReturnType<typeof useUserDrawer>): ColumnDef<User>[] => [
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
                        <DropdownMenuItem onClick={() => drawerState.openDrawer(user)}>
                            View user details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableHiding: false,
    },
];
