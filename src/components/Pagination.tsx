import React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  // Existing props (maintained for backward compatibility)
  totalItems?: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;

  // New optional props for advanced mode
  totalPages?: number;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  rowsPerPageOptions?: number[];
  getPageNumbers?: () => (number | "...")[];
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  totalPages: propTotalPages,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20],
  getPageNumbers: propGetPageNumbers,
}) => {
  // Calculate total pages if not explicitly provided
  const totalPages = propTotalPages ?? (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 1);

  // Helper for simple mode page numbers
  const defaultGetPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1, 2, 3);
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages - 1, totalPages);
    return [...new Set(pages)];
  };

  const pageNumbers = propGetPageNumbers ? propGetPageNumbers() : defaultGetPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 my-6">
      {/* Left side: either Rows per page OR Results info */}
      <div className="flex items-center gap-2 text-sm text-[#637381] p-3">
        {rowsPerPage !== undefined && onRowsPerPageChange ? (
          <>
            <span>Row Per Page</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                className="appearance-none font-normal border border-[#E2E8F0] rounded-[6px] px-3 py-1 pr-7 text-sm text-[#212B36] bg-white focus:outline-none cursor-pointer"
              >
                {rowsPerPageOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#637381] pointer-events-none"
              />
            </div>
            <span>Entries</span>
          </>
        ) : (
          totalItems !== undefined && itemsPerPage !== undefined && (
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </span>
          )
        )}
      </div>

      {/* Right side: Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex border border-[#E6EAED] bg-white items-center justify-center rounded-full text-[#637381] hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((pg, i) =>
          pg === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-[#637381] text-sm border border-[#E6EAED]"
            >
              …
            </span>
          ) : (
            <button
              key={pg}
              onClick={() => onPageChange(pg as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors border border-[#E6EAED] ${
                currentPage === pg
                  ? "bg-[#FE9F43] text-white shadow-sm"
                  : "text-[#637381] hover:bg-gray-100 border border-[#E6EAED]"
              }`}
            >
              {pg}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex border border-[#E6EAED] bg-white items-center justify-center rounded-full text-[#637381] hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
