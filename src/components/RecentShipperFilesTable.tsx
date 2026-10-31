import React, { useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Eye, ArrowUpDown, ChevronDown, FileText } from "lucide-react";
import CommonCheckbox from "./common_component/CommonCheckbox";
import CommonStatusBadge from "./common_component/CommonStatusBadge";
import Button from "./common_component/Button";
import SuccessModal from "./common_component/SuccessModal";
import type { PlantDashboardRecentShipperFile } from "@/redux/api/plantDashboardApi";

interface Props {
  data: PlantDashboardRecentShipperFile[];
  isLoading?: boolean;
}

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

function formatRate(rate?: number | string): string {
  if (rate === undefined || rate === null || rate === "") return "$0";
  const num = typeof rate === "number" ? rate : parseFloat(String(rate).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(rate);
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function formatWeight(weight?: number | string): string {
  if (weight === undefined || weight === null || weight === "") return "-";
  const num = typeof weight === "number" ? weight : parseFloat(String(weight).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(weight);
  return `${num.toLocaleString("en-US", { maximumFractionDigits: 1 })} lbs`;
}

function formatStatusText(status?: string): string {
  if (!status) return "Received";
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const RecentShipperFilesTable: React.FC<Props> = ({ data = [], isLoading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, projectId } = useParams();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isQuotationPage = location.pathname.includes("load_planning/shipper-quotation");

  const statusOptions = [
    { label: "Approved", variant: "green" as const },
    { label: "Rejected", variant: "red" as const },
    { label: "File Received", variant: "yellow" as const },
    { label: "Compared", variant: "green" as const },
    { label: "Order Sent", variant: "blue" as const },
    { label: "Revision Sent", variant: "cyan" as const },
  ];

  const handleStatusChange = (idx: number, newStatus: string) => {
    console.log(`Row ${idx} status changed to ${newStatus}`);
    setOpenDropdown(null);
    setShowSuccessModal(true);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const list = [...data];
    if (sortConfig.key) {
      list.sort((a: any, b: any) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "uploadDate") {
          valA = new Date(valA || 0).getTime();
          valB = new Date(valB || 0).getTime();
        }
        if (["items", "rate", "rates", "weight"].includes(sortConfig.key)) {
          valA = typeof valA === "number" ? valA : parseFloat(String(valA || 0).replace(/[^0-9.]/g, "")) || 0;
          valB = typeof valB === "number" ? valB : parseFloat(String(valB || 0).replace(/[^0-9.]/g, "")) || 0;
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [data, sortConfig]);

  const displayedData = useMemo(() => sortedData.slice(0, 10), [sortedData]);

  const handleViewDetails = (item: PlantDashboardRecentShipperFile) => {
    const cId = customerId || "ID-2025-1047";
    const pId = projectId || item.projectId || "PRJ-001";
    if (item.requestId && item.projectId) {
      navigate(`/projects/${item.projectId}/shipper-files/${item.requestId}`);
    } else {
      navigate(`/projects/shipper-file-details/${cId}/${pId}/${item.fileName}`);
    }
  };

  const getBadgeVariant = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("reject") || s.includes("fail") || s.includes("error")) return "red";
    if (s.includes("received") || s.includes("pending") || s.includes("wait")) return "yellow";
    if (
      s.includes("compared") ||
      s.includes("approved") ||
      s.includes("pass") ||
      s.includes("success")
    )
      return "green";
    if (s.includes("sent") || s.includes("revision") || s.includes("order")) return "blue";
    return "gray";
  };

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#E2E4E6] text-nowrap">
              <th className="py-4 px-6 w-12">
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
                Project Name
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("vendorName")}
                >
                  Shipper / Vendor
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "vendorName"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                File Name
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("uploadDate")}
                >
                  Upload Date
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "uploadDate"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("items")}
                >
                  Items
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "items"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("rate")}
                >
                  Rates
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "rate"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("weight")}
                >
                  Weight
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "weight"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                File Status
              </th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E4E6]">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#155DFC] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Loading shipper files...</span>
                  </div>
                </td>
              </tr>
            ) : displayedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText size={32} className="text-gray-300" />
                    <span className="text-sm font-medium">No recent shipper files found</span>
                  </div>
                </td>
              </tr>
            ) : (
              displayedData.map((item, idx) => (
                <tr
                  key={item.requestId || idx}
                  className="hover:bg-gray-50 transition-colors group/row"
                >
                  <td className="py-3 px-6">
                    <CommonCheckbox
                      size="xs"
                      checked={selectedRows.includes(idx)}
                      onChange={(checked) => {
                        if (checked) setSelectedRows([...selectedRows, idx]);
                        else
                          setSelectedRows(selectedRows.filter((i) => i !== idx));
                      }}
                    />
                  </td>
                  <td className="py-4 px-4 text-sm text-[#212B36] font-medium">
                    <div>{item.projectName}</div>
                    {item.projectId && (
                      <span className="text-xs text-[#919EAB] font-normal">
                        {item.projectId}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#637381]">
                    {item.vendorName || "Vendor"}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#637381] max-w-[220px] truncate" title={item.fileName}>
                    {item.fileName}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#637381]">
                    {formatTableDate(item.uploadDate)}
                  </td>
                  <td className="py-4 px-4 text-sm text-black font-medium">
                    {item.items ?? "-"}
                  </td>
                  <td className="py-4 px-4 text-sm text-black font-medium">
                    {formatRate(item.rate)}
                  </td>
                  <td className="py-4 px-4 text-sm text-black font-medium">
                    {formatWeight(item.weight)}
                  </td>
                  <td className="py-4 px-4">
                    {isQuotationPage ? (
                      <div className="relative w-fit">
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === idx ? null : idx)
                          }
                          className="flex items-center gap-1 bg-white hover:bg-gray-50 transition-colors rounded-sm"
                        >
                          <CommonStatusBadge
                            text={formatStatusText(item.status)}
                            variant={getBadgeVariant(item.status)}
                          />
                          <ChevronDown
                            size={14}
                            className="text-(--text-color-gray-3) shrink-0 -ml-4.5 opacity-70"
                          />
                        </button>

                        {openDropdown === idx && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E2E4E6] rounded-[10px] shadow-lg z-50 p-2 space-y-1">
                            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-gray-50">
                              <span className="text-xs font-normal text-black flex items-center gap-1.5">
                                <ChevronDown
                                  size={14}
                                  className="rotate-90 cursor-pointer"
                                  onClick={() => setOpenDropdown(null)}
                                />{" "}
                                Select Status
                              </span>
                            </div>
                            {statusOptions.map((opt) => (
                              <button
                                key={opt.label}
                                onClick={() => handleStatusChange(idx, opt.label)}
                                className="w-full"
                              >
                                <CommonStatusBadge
                                  text={opt.label}
                                  variant={opt.variant}
                                  className="w-full justify-center py-1 hover:opacity-80 transition-opacity"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-fit">
                        <CommonStatusBadge
                          text={formatStatusText(item.status)}
                          variant={getBadgeVariant(item.status)}
                        />
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <Button
                      onClick={() => handleViewDetails(item)}
                      variant="gradient"
                      size="sm"
                    >
                      <Eye size={18} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="File Status Changed"
        subTitle="Successfully"
      />
    </div>
  );
};

export default RecentShipperFilesTable;
