import { DataTable } from '@/components/datatable';
import HeadingSmall from '@/components/heading-small';
import { UserDrawer } from '@/components/user/user-detail-drawer';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTableResponse } from '@/types/datatable';
import { Head } from '@inertiajs/react';
import { PaginationState } from '@tanstack/react-table';
import { LoaderCircle, ShieldX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useDebounce } from '../../hooks/use-debounce';
import { tableColumns, User, useUserDrawer } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User list',
        href: '/user-list',
    },
];

async function getData(page: number = 1, search: string = ''): Promise<DataTableResponse> {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`/users?page=${page}${searchParam}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export default function Index() {
    const [loading, setLoading] = useState(true);
    const { appearance } = useAppearance();

    const drawerState = useUserDrawer();

    const columns = tableColumns(drawerState);
    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const prevSearchRef = useRef(searchQuery);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchData = async (page: number, search: string) => {
        setLoading(true);

        try {
            const response = await getData(page, search);
            setData(response.data);
            setPageCount(response.last_page);
        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(`Failed to load data: ${errorMessage}`, {
                icon: <ShieldX className="text-red-500" size={18} />,
                cancel: {
                    label: 'close',
                    onClick: () => toast.dismiss(),
                },
                duration: Infinity,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (prevSearchRef.current !== debouncedSearchQuery) {
            prevSearchRef.current = debouncedSearchQuery;

            if (pagination.pageIndex !== 0) {
                setPagination((prev) => ({
                    ...prev,
                    pageIndex: 0,
                }));

                return;
            }
        }

        const pageIndex = pagination.pageIndex;
        fetchData(pageIndex + 1, debouncedSearchQuery);
    }, [pagination, debouncedSearchQuery]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User list" />
            <Toaster theme={appearance} position="bottom-right" />

            <div className="container space-y-6 p-5">
                <HeadingSmall title="User" description="Manage user data and profile" />

                <div className="relative">
                    <DataTable
                        columns={columns}
                        data={data}
                        pageCount={pageCount}
                        pagination={pagination}
                        setPagination={setPagination}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    {loading && data.length > 0 && (
                        <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-md">
                            <div className="flex flex-col items-center space-y-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                <p className="text-muted-foreground text-sm">Loading...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <UserDrawer
                isOpen={drawerState.isOpen}
                onOpenChange={drawerState.setIsOpen}
                user={drawerState.selectedUser}
            />
        </AppLayout>
    );
}
