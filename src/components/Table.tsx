import React from "react";
import Pagination from "./Pagination";

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
  cellClassName?: string;
}

export interface TableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  footer?: React.ReactNode;
  onViewAll?: () => void;
  actions?: React.ReactNode;
  pagination?: boolean;
}

const Table = <T extends any>({
  title,
  columns,
  data,
  footer,
  onViewAll,
  actions,
  pagination,
}: TableProps<T>) => {
  return (
    <div className="bg-white rounded-md overflow-hidden mb-8">
      {/* Header Section */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="md:text-lg font-medium">{title}</h3>
        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-transparent text-gray-400 font-normal border-b border-[#00000033]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`md:px-5 px-4 py-4 font-medium md:text-sm text-xs text-(--text-color-gray-2) tracking-wider ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[#00000033] hover:bg-gray-50/50 last:border-0 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 ${col.cellClassName || ""}`}
                  >
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Content */}
      {footer && (
        <div className="p-4 bg-transparent border-t border-gray-100">
          {footer}
        </div>
      )}

      {/* View All Button */}
      {onViewAll && !pagination && (
        <div className="p-4 flex items-center justify-center border-t border-gray-100">
          <button
            onClick={onViewAll}
            className="text-blue-500 font-medium text-sm hover:underline"
          >
            View All
          </button>
        </div>
      )}

      <Pagination
        totalItems={5}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default Table;
