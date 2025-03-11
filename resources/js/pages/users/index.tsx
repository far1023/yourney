import { DataTable } from '@/components/datatable';
import HeadingSmall from '@/components/heading-small';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTableResponse } from '@/types/datatable';
import { Head } from '@inertiajs/react';
import { PaginationState } from '@tanstack/react-table';
import { ShieldX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { columns, User } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User list',
        href: '/user-list',
    },
];

async function getData(page: number = 1): Promise<DataTableResponse> {
    const response = await fetch(`/users?page=${page}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export default function Index() {
    const [loading, setLoading] = useState(true);
    const { appearance } = useAppearance();

    const [data, setData] = useState<User[]>([]);
    const [pageCount, setPageCount] = useState(0);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchData = async (page: number) => {
        setLoading(true);

        try {
            const response = await getData(page);
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
        const pageIndex = pagination.pageIndex;
        fetchData(pageIndex + 1);
    }, [pagination]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User list" />
            <Toaster theme={appearance} position="bottom-right" />

            <div className="container space-y-6 p-5">
                <HeadingSmall title="User" description="Manage user data and profile" />
                {!data.length ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={data}
                        pageCount={pageCount}
                        pagination={pagination}
                        setPagination={setPagination}
                    />
                )}
                {loading ? 'loading...' : ''}
            </div>
        </AppLayout>
    );
}
