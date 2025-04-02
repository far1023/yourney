import { DataTable } from '@/components/datatable';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';
import HeadingSmall from '@/components/heading-small';
import { UserFormModal } from '@/components/user-form-modal';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTableResponse } from '@/types/datatable';
import { Head, router } from '@inertiajs/react';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { LoaderCircle, ShieldX } from 'lucide-react';
import { useMemo, useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useDebounce } from '../../hooks/use-debounce';
import { columns as baseColumns, User } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User list',
        href: '/user-list',
    },
];

async function getData(
    page: number = 1, 
    search: string = '', 
    pageSize: number = 10,
    sortField: string = 'updated_at',
    sortDirection: string = 'desc'
): Promise<DataTableResponse> {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const pageSizeParam = `&per_page=${pageSize}`;
    const sortParam = `&sort=${sortField}&direction=${sortDirection}`;
    const response = await fetch(`/api/users?page=${page}${searchParam}${pageSizeParam}${sortParam}`);
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
    const [searchQuery, setSearchQuery] = useState('');
    const prevSearchRef = useRef(searchQuery);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // User form modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [formModalTitle, setFormModalTitle] = useState('Add User');
    
    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Default page size that matches one of our dropdown options
    });
    
    // Sorting state - default to updated_at desc
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'Last update', desc: true }
    ]);
    
    // Row selection state
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const fetchData = async (page: number, search: string, pageSize: number) => {
        setLoading(true);

        try {
            // Get the current sort column and direction
            const sortColumn = sorting.length > 0 ? sorting[0].id : 'updated_at';
            const sortDirection = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : 'desc';
            
            // Map column id to database field if needed
            let sortField = sortColumn;
            if (sortColumn === 'Last update') {
                sortField = 'updated_at';
            }
            
            const response = await getData(page, search, pageSize, sortField, sortDirection);
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
        const pageSize = pagination.pageSize;
        fetchData(pageIndex + 1, debouncedSearchQuery, pageSize);
    }, [pagination, debouncedSearchQuery, sorting]); // Added sorting as dependency
    
    // Handle opening modal for adding a new user
    const handleAddUser = () => {
        setCurrentUser(undefined);
        setFormModalTitle('Add User');
        setIsFormModalOpen(true);
    };

    // Handle opening modal for editing a user
    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setFormModalTitle('Edit User');
        setIsFormModalOpen(true);
    };

    // Handle opening delete confirmation modal
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // Handle actual user deletion with Inertia
    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        
        return new Promise<void>((resolve) => {
            router.delete(`/api/users/${userToDelete.id}`, {
                onSuccess: () => {
                    toast.success(`User ${userToDelete.name} has been deleted.`, {
                        description: 'The user has been removed from the system.',
                        duration: 3000,
                    });
                    
                    // Refresh the data
                    const pageIndex = pagination.pageIndex;
                    fetchData(pageIndex + 1, debouncedSearchQuery, pagination.pageSize);
                    
                    resolve();
                },
                onError: (errors) => {
                    toast.error('Failed to delete user', {
                        description: Object.values(errors).join('\n'),
                        duration: 5000,
                    });
                    
                    resolve();
                }
            });
        });
    };

    // Handle success toast
    const handleOperationSuccess = (message: string) => {
        toast.success(message, { duration: 3000 });
        
        // Refresh the data
        const pageIndex = pagination.pageIndex;
        fetchData(pageIndex + 1, debouncedSearchQuery, pagination.pageSize);
    };
    
    // Handle error toast
    const handleOperationError = (message: string) => {
        toast.error('Operation failed', {
            description: message,
            duration: 5000,
        });
    };

    // Memoize columns to avoid unnecessary re-renders
    const columns = useMemo(() => {
        // Add handlers to the actions column
        return baseColumns.map(column => {
            if (column.id === 'actions') {
                return {
                    ...column,
                    meta: {
                        ...column.meta,
                        onEdit: handleEditUser,
                        onDelete: handleDeleteClick // Changed to show the delete modal
                    }
                };
            }
            return column;
        });
    }, []);

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
                        addButtonText="Add User"
                        onAddClick={handleAddUser}
                        initialSorting={sorting}
                        onSortingChange={setSorting}
                        initialRowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                    />

                    {/* User Form Modal */}
                    <UserFormModal
                        isOpen={isFormModalOpen}
                        onClose={() => setIsFormModalOpen(false)}
                        onSuccess={handleOperationSuccess}
                        onError={handleOperationError}
                        user={currentUser}
                        title={formModalTitle}
                    />
                    
                    {/* Delete Confirmation Modal */}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete User"
                        description={
                            userToDelete 
                                ? `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.` 
                                : "Are you sure you want to delete this user? This action cannot be undone."
                        }
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
        </AppLayout>
    );
}
