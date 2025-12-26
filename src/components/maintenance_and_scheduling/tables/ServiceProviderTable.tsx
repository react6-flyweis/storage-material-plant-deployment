import React from "react";
import Pagination from "../../Pagination";

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
  cellClassName?: string;
}

export interface ServiceProviderTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  footer?: React.ReactNode;
  onViewAll?: () => void;
  actions?: React.ReactNode;
  pagination?: boolean;
}

const ServiceProviderTable = <T,>({
  title,
  columns,
  data,
  footer,
  onViewAll,
  actions,
  pagination = false,
}: ServiceProviderTableProps<T>) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const totalItems = data.length;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const tableData = pagination ? data.slice(startIndex, endIndex) : data;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* Header Section */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-800 uppercase tracking-wide">
          {title}
        </h3>

        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-transparent text-gray-400 font-normal border-b border-[#00000033]">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 font-medium md:text-sm text-black tracking-wider ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              tableData.map((item, rowIndex) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Slot */}
      {footer && (
        <div className="p-4 bg-transparent border-t border-gray-100">
          {footer}
        </div>
      )}

      {/* View All (only if pagination disabled) */}
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

      {/* Pagination */}
      {pagination && (
        <Pagination
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};

export default ServiceProviderTable;
