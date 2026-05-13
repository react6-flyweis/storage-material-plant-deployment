import React, { useState, useMemo } from "react";
import type { DrawingApprovalStatus } from "@/data/productionMockData";
import { Eye, ArrowUpDown, CircleCheck, RotateCcw } from "lucide-react";

interface Props {
  data: DrawingApprovalStatus[];
}

type SortKey = "clientName" | "sentDate";
type SortDirection = "asc" | "desc";

const DrawingApprovalStatusTable: React.FC<Props> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "sentDate") {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#F4F6F8] text-nowrap">
              <th className="py-4 px-4 pl-6">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button 
                  onClick={() => handleSort("clientName")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Client <ArrowUpDown size={14} className={sortConfig?.key === "clientName" ? "text-blue-600" : "text-[#5D6772]"} />
                </button>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">Project Name</th>
              <th className="py-4 px-4 text-sm font-semibold text-black">File Name</th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button 
                  onClick={() => handleSort("sentDate")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Sent Date <ArrowUpDown size={14} className={sortConfig?.key === "sentDate" ? "text-blue-600" : "text-[#5D6772]"} />
                </button>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">Status</th>
              <th className="py-4 px-4 pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F8]">
            {sortedData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 pl-6">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <img src={item.clientAvatar} alt={item.clientName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm md:text-base font-normal text-black">{item.clientName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm md:text-base font-normal text-black">{item.projectName}</td>
                <td className="py-4 px-4 text-sm md:text-base text-[#637381]">{item.fileName}</td>
                <td className="py-4 px-4 text-sm md:text-base text-[#637381]">{item.sentDate}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-normal inline-flex items-center gap-1.5 whitespace-nowrap ${
                    item.status === "Pending" ? "bg-[#FFF6D0] text-[#B78B00]" :
                    item.status === "Approved" ? "bg-(--background-green) text-(--text-color-green-2)" :
                    "bg-[#E0F2FE] text-[#0369A1]"
                  }`}>
                    {item.status}
                    {item.status === "Approved" && <CircleCheck size={14} />}
                    {item.status === "Revision Sent" && <RotateCcw size={14} />}
                  </span>
                </td>
                <td className="py-4 px-4 pr-6 text-right">
                  <button className="p-2 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white border border-[#FCF8EB] hover:opacity-90 transition-all h-[30px] w-fit flex items-center justify-center rounded-sm">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrawingApprovalStatusTable;
