import React from "react";
import Pagination from "./Pagination";
import { Eye, MessageSquare, User, UserPlus } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  project: string;
  assignedTo: {
    name: string;
    image?: string;
  } | null;
  progress: number;
  status: "Proposal sent" | "Quotation Sent"; // Add other statuses as needed
  quoteValue: string;
  unreadMessages: number;
}

interface ProductionTableProps {
  data: Lead[];
  onViewDetails: (lead: Lead) => void;
}

const ProductionTable: React.FC<ProductionTableProps> = ({
  data,
  onViewDetails,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="md:w-4 md:h-4 w-3 h-3 rounded border-gray-300 text-var(--color-primary)"
              />
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm">
              Lead Info
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm">
              Assigned To
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm">
              Progress
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm">
              Status
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm">
              Quote Value
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm">
              Chat
            </th>
            <th className="p-4 text-[#6B7280] font-medium capitalize md:text-sm text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors bg-white"
            >
              <td className="p-4 text-center">
                <input
                  type="checkbox"
                  className="md:w-4 md:h-4 w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="p-4 min-w-[120px]">
                <div className="flex flex-col">
                  <span className="font-normal text-black md:text-sm text-xs">
                    {row.name}
                  </span>
                  <span className="md:text-xs text-[10px] text-gray-500 mt-0.5">
                    {row.id}
                  </span>
                  <span className="md:text-xs text-[10px] text-gray-500">
                    {row.project}
                  </span>
                </div>
              </td>
              <td className="p-4 min-w-[120px] md:text-sm text-xs">
                <div className="flex items-center gap-3">
                  {row.assignedTo ? (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <User className="w-4 h-4 text-[#36A44A]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="md:text-xs text-[10px] font-semibold text-gray-900">
                          {row.assignedTo.name}
                        </span>
                        <span className="md:text-[10px] text-[8px] text-gray-400">
                          1 person assigned
                        </span>
                      </div>
                    </>
                  ) : (
                    <button className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <UserPlus className="w-4 h-4 text-[#36A44A]" />
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        Assign
                      </span>
                    </button>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div
                        key={step}
                        className={`w-3 h-3 rounded-full ${
                          step <= row.progress
                            ? "bg-emerald-400"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-blue-600">
                    Step {row.progress}/7
                  </span>
                </div>
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    row.status === "Quotation Sent"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-purple-50 text-purple-600"
                  }
                `}
                >
                  {row.status}
                </span>
              </td>
              <td className="p-4 md:text-sm text-[10px] min-w-[120px]">
                <span className="text-sm font-bold text-gray-900">
                  {row.quoteValue}
                </span>
              </td>
              <td className="p-4">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#3C40AF] rounded-lg 
                  hover:bg-blue-100 transition-colors text-xs font-medium relative group"
                >
                  <MessageSquare
                    strokeWidth={1}
                    className="w-4 h-4 text-[#3C40AF]"
                  />
                  Chat
                  {row.unreadMessages > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white">
                      {row.unreadMessages}
                    </span>
                  )}
                </button>
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => onViewDetails(row)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                >
                  <Eye strokeWidth={2} className="w-5 h-5 text-[#3C40AF]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalItems={5}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={()=>{}}
      />
    </div>
  );
};

export default ProductionTable;
