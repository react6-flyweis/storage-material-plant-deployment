import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  totalItems=5,
  itemsPerPage=5,
  currentPage=1,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between mt-6 p-4 border-t border-gray-100">
      <p className="lg:text-sm text-xs text-gray-500">
        Showing {startItem} to {endItem} of {totalItems} results
      </p>

      <div className="flex items-center gap-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-gray-600 bg-transparent shadow-none hover:bg-gray-50 hover:text-gray-900"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={`h-8 w-8 rounded-full p-0 ${
                page === currentPage
                  ? "bg-[#FF885B] hover:bg-[#FF885B] text-white"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-gray-60 bg-transparent shadow-none hover:bg-gray-50 hover:text-gray-900"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
