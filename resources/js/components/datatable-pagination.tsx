import { Table } from '@tanstack/react-table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

interface DataTablePaginationProps {
    table: Table<any>;
}

const DataTablePagination = ({ table }: DataTablePaginationProps) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();

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
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled={!table.getCanPreviousPage()}
                        className={!table.getCanPreviousPage() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        onClick={handlePreviousPage}
                    />
                </PaginationItem>

                {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink className="cursor-pointer" isActive={pageIndex + 1 === page} onClick={() => handlePageClick(page)}>
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
    );
};

export default DataTablePagination;
