import React from "react";
import { ArrowUpDown } from "lucide-react";
import Button from "../common_component/Button";

interface SmdtRow {
  _id?: string;
  id?: string | number;
  category?: string;
  partName: string;
  partColor?: string;
  partColour?: string;
  costUnit: string;
  mbsCost?: number;
  cost?: string;
  currentMarketCost: number | string | null;
  laborCost?: number;
  additionalCost?: number;
  materialCost?: number;
  description: string;
  isFrameType?: boolean | string;
  isActive?: boolean | string;
}

interface CostingTableProps {
  data: SmdtRow[];
  selectedRows: (string | number)[];
  onToggleRow: (id: string | number) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  handleColSort: (key: string) => void;
  sortKey: string | null;
  sortDir: "asc" | "desc" | null;
  onActionClick: (row: SmdtRow) => void;
  actionLabel: string;
  isMissingView?: boolean;
}

const SortIcon = ({ col, sortKey }: { col: string; sortKey: string | null }) => {
  if (sortKey !== col) return <ArrowUpDown size={13} className="text-[#919EAB] ml-1 inline" />;
  return <ArrowUpDown size={13} className="text-[#1E51A4] ml-1 inline" />;
};

const CostingTable: React.FC<CostingTableProps> = ({
  data,
  selectedRows,
  onToggleRow,
  onToggleAll,
  allSelected,
  handleColSort,
  sortKey,
  sortDir,
  onActionClick,
  actionLabel,
  isMissingView = false,
}) => {
  const thClass = "px-3 md:px-4 py-2 md:py-2 text-xs font-semibold text-[#364153] tracking-wider cursor-pointer select-none whitespace-nowrap";
  console.log(sortDir)

  return (
    <div className="bg-white rounded-[14px]  border border-[#0000001A] overflow-hidden shadow-sm mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-nowrap">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#0000001A]">
              <th className="p-3 md:p-4 w-10">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleAll}
                    className="w-4 h-4 rounded border-gray-300 accent-[#155DFC] cursor-pointer"
                />
              </th>
              {!isMissingView && (
                <th className={thClass} onClick={() => handleColSort("category")}>
                  Category <SortIcon col="category" sortKey={sortKey} />
                </th>
              )}
              <th className={thClass} onClick={() => handleColSort("partName")}>
                Part Name <SortIcon col="partName" sortKey={sortKey} />
              </th>
              <th className={thClass} onClick={() => handleColSort("partColor")}>
                Part Colour <SortIcon col="partColor" sortKey={sortKey} />
              </th>
              <th className={thClass} onClick={() => handleColSort("costUnit")}>
                Cost Unit <SortIcon col="costUnit" sortKey={sortKey} />
              </th>
              <th className={thClass} onClick={() => handleColSort(isMissingView ? "cost" : "mbsCost")}>
                {isMissingView ? "Cost" : "MBS Cost"} <SortIcon col={isMissingView ? "cost" : "mbsCost"} sortKey={sortKey} />
              </th>
              <th className={thClass} onClick={() => handleColSort("currentMarketCost")}>
                Current Market Cost <SortIcon col="currentMarketCost" sortKey={sortKey} />
              </th>
              {!isMissingView && (
                <>
                  <th className={thClass} onClick={() => handleColSort("laborCost")}>
                    Labor Cost <SortIcon col="laborCost" sortKey={sortKey} />
                  </th>
                  <th className={thClass} onClick={() => handleColSort("additionalCost")}>
                    Additional Cost <SortIcon col="additionalCost" sortKey={sortKey} />
                  </th>
                  <th className={thClass} onClick={() => handleColSort("materialCost")}>
                    Material Cost <SortIcon col="materialCost" sortKey={sortKey} />
                  </th>
                </>
              )}
              <th className={thClass} onClick={() => handleColSort("description")}>
                Description <SortIcon col="description" sortKey={sortKey} />
              </th>
              {!isMissingView && (
                <>
                  <th className={thClass} onClick={() => handleColSort("isFrameType")}>
                    Is Frame Type <SortIcon col="isFrameType" sortKey={sortKey} />
                  </th>
                  <th className={thClass} onClick={() => handleColSort("isActive")}>
                    Status <SortIcon col="isActive" sortKey={sortKey} />
                  </th>
                </>
              )}
              <th className="p-3 md:p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => {
              const rowId = row._id ?? row.id ?? "";
              const partColor = row.partColor ?? row.partColour;
              const isSelected = selectedRows.includes(rowId);
              return (
                <tr
                  key={rowId}
                  className={`hover:bg-gray-50/70 transition-colors ${isSelected ? "bg-blue-50/30" : ""}`}
                >
                  <td className="p-3 md:p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleRow(rowId)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#155DFC] cursor-pointer"
                    />
                  </td>
                  {!isMissingView && (
                    <td className="p-3 md:p-4 text-sm text-[#637381]">
                      {row.category}
                    </td>
                  )}
                  <td className="p-3 md:p-4 text-sm font-medium text-[#212B36]">
                    {row.partName}
                  </td>
                  <td className="p-3 md:p-4 text-sm text-[#637381]">
                    {partColor}
                  </td>
                  <td className="p-3 md:p-4 text-sm text-[#637381]">
                    {row.costUnit}
                  </td>
                  <td className={`p-3 md:p-4 text-sm text-[#5D6772] font-normal ${isMissingView ? "bg-[#FFE4E4]" : "bg-transparent"}`}>
                    {isMissingView ? (
                      <span className="inline-block px-3 py-1 text-xs rounded">
                        {row.cost}
                      </span>
                    ) : (
                      row.mbsCost
                    )}
                  </td>
                  <td className="p-3 md:p-4 text-sm text-[#637381]">
                    {row.currentMarketCost === "-" || row.currentMarketCost === null ? (
                      <span className="text-[#919EAB]">-</span>
                    ) : (
                      row.currentMarketCost
                    )}
                  </td>
                  {!isMissingView && (
                    <>
                      <td className="p-3 md:p-4 text-sm text-[#637381]">
                        {row.laborCost !== undefined ? row.laborCost : "-"}
                      </td>
                      <td className="p-3 md:p-4 text-sm text-[#637381]">
                        {row.additionalCost !== undefined ? row.additionalCost : "-"}
                      </td>
                      <td className="p-3 md:p-4 text-sm text-[#637381]">
                        {row.materialCost !== undefined ? row.materialCost : "-"}
                      </td>
                    </>
                  )}
                  <td className="p-3 md:p-4 text-sm text-[#637381] max-w-[200px] truncate">
                    {row.description}
                  </td>
                  {!isMissingView && (
                    <>
                      <td className="p-3 md:p-4 text-sm text-[#637381]">
                        {row.isFrameType ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Frame
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="p-3 md:p-4 text-sm text-[#637381]">
                        {row.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="p-3 md:p-4">
                    <Button
                      variant={"gradient"}
                      size="sm"
                      onClick={() => onActionClick(row)}
                    >
                      {actionLabel}
                    </Button>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={isMissingView ? 8 : 14} className="text-center py-16 text-[#919EAB] text-sm">
                  No parts found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostingTable;
