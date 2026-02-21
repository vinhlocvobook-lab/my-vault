import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
}) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Tạo danh sách số trang hiển thị (tối đa 5 trang quanh trang hiện tại)
    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200">
            {/* Thông tin số lượng */}
            <p className="text-sm text-slate-500">
                Hiển thị <span className="font-semibold text-slate-700">{startItem}–{endItem}</span> trong tổng số{' '}
                <span className="font-semibold text-slate-700">{totalItems}</span> mục
            </p>

            {/* Nút phân trang */}
            <div className="flex items-center gap-1">
                {/* Trang đầu */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Trang đầu"
                >
                    <ChevronsLeft size={18} />
                </button>

                {/* Trang trước */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Trang trước"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Các số trang */}
                <div className="flex items-center gap-1 mx-1">
                    {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                            <span key={`dots-${index}`} className="px-2 text-slate-400 select-none">…</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>

                {/* Trang sau */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Trang sau"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Trang cuối */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Trang cuối"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>
        </div>
    );
};
