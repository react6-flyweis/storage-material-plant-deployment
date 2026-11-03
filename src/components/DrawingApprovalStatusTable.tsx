import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ArrowUpDown, CircleCheck, RotateCcw, Clock, FileCheck } from "lucide-react";
import Button from "./common_component/Button";
import CommonCheckbox from "./common_component/CommonCheckbox";
import type { PlantDashboardDrawingApproval } from "@/redux/api/plantDashboardApi";

interface Props {
  data: PlantDashboardDrawingApproval[];
  isLoading?: boolean;
}

type SortKey = "client" | "projectName" | "sentDate" | "status";
type SortDirection = "asc" | "desc";

function formatTableDate(dateString?: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function formatStatusText(status?: string): string {
  if (!status) return "Pending Review";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const DrawingApprovalStatusTable: React.FC<Props> = ({ data = [], isLoading = false }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a: PlantDashboardDrawingApproval, b: PlantDashboardDrawingApproval) => {
      const aValue = (a as Record<string, any>)[sortConfig.key] || "";
      const bValue = (b as Record<string, any>)[sortConfig.key] || "";

      if (sortConfig.key === "sentDate") {
        const aDate = new Date(aValue).getTime() || 0;
        const bDate = new Date(bValue).getTime() || 0;
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

  const displayedData = useMemo(() => sortedData.slice(0, 10), [sortedData]);

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    const formatted = formatStatusText(status);

    if (s.includes("approve") || s === "approved") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap bg-[#ECF6F1] text-[#00C853]">
          {formatted}
          <CircleCheck size={14} />
        </span>
      );
    }
    if (s.includes("revision") || s === "revision_sent") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap bg-[#E0F2FE] text-[#0369A1]">
          {formatted}
          <RotateCcw size={14} />
        </span>
      );
    }
    if (s.includes("reject") || s === "rejected") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap bg-[#FEE2E2] text-[#EF4444]">
          {formatted}
        </span>
      );
    }
    // pending or default
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap bg-[#FFF6D0] text-[#B78B00]">
        {formatted}
        <Clock size={14} />
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#F4F6F8] text-nowrap">
              <th className="py-4 px-4 pl-6 w-12">
                <CommonCheckbox
                  size="xs"
                  checked={
                    selectedRows.length === displayedData.length &&
                    displayedData.length > 0
                  }
                  onChange={(checked) => {
                    if (checked) setSelectedRows(displayedData.map((_, i) => i));
                    else setSelectedRows([]);
                  }}
                />
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button
                  onClick={() => handleSort("client")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Client{" "}
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig?.key === "client"
                        ? "text-blue-600"
                        : "text-[#5D6772]"
                    }
                  />
                </button>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button
                  onClick={() => handleSort("projectName")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Project Name{" "}
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig?.key === "projectName"
                        ? "text-blue-600"
                        : "text-[#5D6772]"
                    }
                  />
                </button>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                File Name
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button
                  onClick={() => handleSort("sentDate")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Sent Date{" "}
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig?.key === "sentDate"
                        ? "text-blue-600"
                        : "text-[#5D6772]"
                    }
                  />
                </button>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  Status{" "}
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig?.key === "status"
                        ? "text-blue-600"
                        : "text-[#5D6772]"
                    }
                  />
                </button>
              </th>
              <th className="py-4 px-4 pr-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F8]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#155DFC] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Loading drawing statuses...</span>
                  </div>
                </td>
              </tr>
            ) : displayedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileCheck size={32} className="text-gray-300" />
                    <span className="text-sm font-medium">No drawing approval records found</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedData.map((item, idx) => {
                const clientInitials = (item.client || "C")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <tr key={item.buildingId || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 pl-6">
                      <CommonCheckbox
                        size="xs"
                        checked={selectedRows.includes(idx)}
                        onChange={(checked) => {
                          if (checked) setSelectedRows([...selectedRows, idx]);
                          else setSelectedRows(selectedRows.filter((i) => i !== idx));
                        }}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                          {clientInitials}
                        </div>
                        <span className="text-sm font-medium text-black">
                          {item.client}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#637381]">
                      {item.projectName}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#637381] max-w-[240px] truncate" title={item.fileName}>
                      {item.fileName}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#637381]">
                      {formatTableDate(item.sentDate)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-4 pr-6 text-right">
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => {
                          const targetId = item.projectId || item.projectName || item.buildingId;
                          navigate(`/projects/${targetId}/view-drawings`);
                        }}
                      >
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrawingApprovalStatusTable;
