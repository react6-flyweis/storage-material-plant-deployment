import React from "react";

export interface TableColumn {
  header: string;
  key: string;
  render?: (item: any) => React.ReactNode;
  align?: "left" | "center";
  width?: string;
}

interface PackingListTableProps {
  columns: TableColumn[];
  data: any[];
}

const PackingListTable: React.FC<PackingListTableProps> = ({ columns, data }) => (
  <div className="rounded-sm overflow-x-auto border border-gray-100">
    <table className="w-full text-left border-collapse text-nowrap">
      <thead>
        <tr className="bg-[#262626] text-white">
          <th className="p-4 font-inter font-semibold text-sm w-16">#</th>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`p-4 font-inter font-semibold text-sm ${
                col.align === "center" ? "text-center" : ""
              } ${col.width || ""}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {data.map((item, rowIdx) => (
          <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
            <td className="p-4 text-sm font-inter text-(--text-color-gray-4)">
              {rowIdx + 1}
            </td>
            {columns.map((col, colIdx) => (
              <td
                key={colIdx}
                className={`p-4 text-sm font-inter ${
                  col.align === "center" ? "text-center" : ""
                }`}
              >
                {col.render ? col.render(item) : item[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PackingListTable;
