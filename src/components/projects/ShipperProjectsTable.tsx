import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { ShipperProject } from "@/redux/api/shipperApi";
import { Eye, ArrowUpDown } from "lucide-react";
import CommonCheckbox from "../common_component/CommonCheckbox";

interface Props {
  data: ShipperProject[];
}

const ShipperProjectsTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: "latestSubmittedAt" | "totalShipperFiles" | "";
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  const handleSort = (key: "latestSubmittedAt" | "totalShipperFiles") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const sortedData = useMemo(() => {
    const list = [...data];
    const { key, direction } = sortConfig;
    if (key && direction) {
      list.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (key === "latestSubmittedAt") {
          const timeA = valA ? new Date(valA as string).getTime() : 0;
          const timeB = valB ? new Date(valB as string).getTime() : 0;
          return direction === "asc" ? timeA - timeB : timeB - timeA;
        }

        if (key === "totalShipperFiles") {
          const numA = Number(valA) || 0;
          const numB = Number(valB) || 0;
          return direction === "asc" ? numA - numB : numB - numA;
        }

        return 0;
      });
    }
    return list;
  }, [data, sortConfig]);

  const handleViewDetails = (item: ShipperProject) => {
    // Navigate to /projects/:projectId/shipper-files where leadId is used as projectId
    navigate(`/projects/${item.leadId}/shipper-files`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData.map((item) => item.leadId));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, leadId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== leadId));
    }
  };

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#E2E4E6] text-nowrap">
              <th className="py-4 px-6 w-12">
                <CommonCheckbox
                  size="xs"
                  checked={
                    sortedData.length > 0 &&
                    selectedRows.length === sortedData.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                Project ID
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                Project Name
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button
                  className="flex items-center gap-1 cursor-pointer group hover:text-black/80 focus:outline-none"
                  onClick={() => handleSort("latestSubmittedAt")}
                >
                  File Received
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "latestSubmittedAt"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </button>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <button
                  className="flex items-center gap-1 cursor-pointer group hover:text-black/80 focus:outline-none"
                  onClick={() => handleSort("totalShipperFiles")}
                >
                  Total Shippers Files
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "totalShipperFiles"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </button>
              </th>
              <th className="py-4 px-6 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E4E6]">
            {sortedData.map((item, idx) => {
              // Highlight Project Name when not all shipper files are received or status is partial/none
              const isPending =
                item.fileReceivedStatus === "partial" ||
                item.fileReceivedStatus === "none" ||
                item.receivedShipperFiles < item.totalShipperFiles;

              return (
                <tr
                  key={item.leadId || idx}
                  className="hover:bg-gray-50 transition-colors group/row"
                >
                  <td className="py-3 px-6">
                    <CommonCheckbox
                      size="xs"
                      checked={selectedRows.includes(item.leadId)}
                      onChange={(checked) => handleSelectRow(item.leadId, checked)}
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-[#637381]">
                    {item.projectId || item.jobId || "-"}
                  </td>
                  <td
                    className={`py-4 px-4 text-sm transition-all ${
                      isPending
                        ? "font-semibold text-[#212B36]"
                        : "font-normal text-[#637381]"
                    }`}
                  >
                    {item.projectName}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#637381]">
                    {formatDate(item.latestSubmittedAt)}
                  </td>
                  <td className="py-4 px-4 text-sm text-black font-semibold">
                    {item.totalShipperFiles}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="p-2 hover:bg-gray-100 rounded-full text-black transition-colors"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {sortedData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm text-[#637381]">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipperProjectsTable;
