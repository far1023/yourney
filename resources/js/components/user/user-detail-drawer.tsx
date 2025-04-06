'use client';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { User } from '@/pages/users/columns';
import { CalendarIcon, Mail, User as UserIcon } from 'lucide-react';
import moment from 'moment';

interface UserDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function UserDrawer({ isOpen, onOpenChange, user }: UserDrawerProps) {
    if (!user) return null;

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
            <DrawerContent aria-describedby={undefined}>
                <div className="mx-auto w-full max-w-md">
                    <DrawerHeader className="pt-10">
                        <DrawerTitle className="text-center">User Details</DrawerTitle>
                    </DrawerHeader>

                    <div className="p-4 pb-0">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="w-full space-y-4">
                                <div className="flex items-center space-x-2 border-b pb-2">
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium">{user.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 border-b pb-2">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 border-b pb-2">
                                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Created At</p>
                                        <p className="font-medium">
                                            {moment(user.created_at).format('DD MMMM YYYY')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 border-b pb-2">
                                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="font-medium">
                                            {moment(user.updated_at).format('DD MMMM YYYY')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
