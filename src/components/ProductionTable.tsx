import React from "react";
import Pagination from "./Pagination";

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
}

const ProductionTable: React.FC<ProductionTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-var(--color-primary)"
              />
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md">
              Lead Info
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md">
              Assigned To
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md">
              Progress
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md">
              Status
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md">
              Quote Value
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md">
              Chat
            </th>
            <th className="p-4 text-black font-medium capitalize md:text-md text-center">
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
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-sm">
                    {row.name}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">{row.id}</span>
                  <span className="text-xs text-gray-500">{row.project}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {row.assignedTo ? (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        {/* Placeholder Avatar Icon if no image */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-900">
                          {row.assignedTo.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          1 person assigned
                        </span>
                      </div>
                    </>
                  ) : (
                    <button className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3.75 15a2.25 2.25 0 0 1 2.25-2.25h2.25a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V15Z"
                          />
                        </svg>
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
                        className={`w-2 h-2 rounded-full ${
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
              <td className="p-4">
                <span className="text-sm font-bold text-gray-900">
                  {row.quoteValue}
                </span>
              </td>
              <td className="p-4">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg 
                  hover:bg-blue-100 transition-colors text-xs font-medium relative group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  Chat
                  {row.unreadMessages > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white">
                      {row.unreadMessages}
                    </span>
                  )}
                </button>
              </td>
              <td className="p-4 text-center">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalItems={data.length}
        currentPage={1}
        rowsPerPage={1}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </div>
  );
};

export default ProductionTable;
