import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ShipperRequestEntry } from "@/redux/api/projectApi";
import { Eye, ArrowUpDown, ChevronDown } from "lucide-react";
import CommonCheckbox from "./common_component/CommonCheckbox";
import CommonStatusBadge from "./common_component/CommonStatusBadge";
import Button from "./common_component/Button";
import SuccessModal from "./common_component/SuccessModal";

interface Props {
  data: ShipperRequestEntry[];
}

const ProjectShipperFilesTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { customerId, projectId } = useParams();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isQuotationPage = location.pathname.includes("load_planning/shipper-quotation");

  const statusOptions = [
    { value: "sent" as const, label: "Sent", variant: "blue" as const },
    { value: "submitted" as const, label: "File Received", variant: "yellow" as const },
    { value: "comparison_processing" as const, label: "Comparison Processing", variant: "yellow" as const },
    { value: "comparison_completed" as const, label: "Comparison Completed", variant: "green" as const },
    { value: "comparison_failed" as const, label: "Comparison Failed", variant: "red" as const },
    { value: "approved" as const, label: "Approved", variant: "green" as const },
    { value: "rejected" as const, label: "Rejected", variant: "red" as const },
    { value: "resubmit_requested" as const, label: "Resubmit Requested", variant: "cyan" as const },
  ];

  const handleStatusChange = (idx: number, newStatus: string) => {
    console.log(`Row ${idx} status changed to ${newStatus}`);
    setOpenDropdown(null);
    setShowSuccessModal(true);
  };

  const [sortConfig, setSortConfig] = React.useState<{
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

  const sortedData = React.useMemo(() => {
    const list = [...data];
    if (sortConfig.key) {
      list.sort((a: ShipperRequestEntry, b: ShipperRequestEntry) => {
        let valA: string | number | undefined = a[sortConfig.key as keyof ShipperRequestEntry] as unknown as string | number | undefined;
        let valB: string | number | undefined = b[sortConfig.key as keyof ShipperRequestEntry] as unknown as string | number | undefined;

        if (sortConfig.key === "uploadedDate") {
          valA = valA ? new Date(valA as string).getTime() : 0;
          valB = valB ? new Date(valB as string).getTime() : 0;
        }

        const compA = valA ?? "";
        const compB = valB ?? "";

        if (compA < compB) return sortConfig.direction === "asc" ? -1 : 1;
        if (compA > compB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [data, sortConfig]);

  const handleViewDetails = (item: ShipperRequestEntry) => {
    navigate(`${item.requestId}`);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
      case "comparison_completed":
        return "green";
      case "rejected":
      case "comparison_failed":
        return "red";
      case "submitted":
      case "comparison_processing":
        return "yellow";
      case "sent":
        return "blue";
      case "resubmit_requested":
        return "cyan";
      default: {
        const s = status.toLowerCase();
        if (s.includes("received") || s.includes("pending") || s.includes("submitted")) return "yellow";
        if (
          s.includes("compared") ||
          s.includes("approved") ||
          s.includes("sent") ||
          s.includes("revision")
        )
          return "green";
        return "gray";
      }
    }
  };


  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "sent":
        return "Sent";
      case "submitted":
        return "File Received";
      case "comparison_processing":
        return "Comparison Processing";
      case "comparison_completed":
        return "Comparison Completed";
      case "comparison_failed":
        return "Comparison Failed";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "resubmit_requested":
        return "Resubmit Requested";
      default:
        return status;
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
                    selectedRows.length === sortedData.length &&
                    sortedData.length > 0
                  }
                  onChange={(checked) => {
                    if (checked) setSelectedRows(sortedData.map((_, i) => i));
                    else setSelectedRows([]);
                  }}
                />
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("vendorName")}
                >
                  Shipper
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
                  onClick={() => handleSort("uploadedDate")}
                >
                  Upload Date
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "uploadedDate"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("rates")}
                >
                  Rate
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "rates"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-semibold text-black">
                File Status
              </th>
              <th className="py-4 px-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E4E6]">
            {sortedData.map((item, idx) => (
              <tr
                key={idx}
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
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {/* <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shrink-0">
                      <img
                        src={`https://i.pravatar.cc/150?u=${item.vendorId || item.requestId}`}
                        alt={item.vendorName}
                        className="w-full h-full object-cover"
                      />
                    </div> */}
                    <span className="text-sm font-normal text-black text-nowrap">
                      {item.vendorName}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-[#637381]">
                  {item.fileName}
                </td>
                <td className="py-4 px-4 text-sm text-[#637381]">
                  {item.uploadedDate ? formatDate(item.uploadedDate) : "-"}
                </td>
                <td className="py-4 px-4 text-sm text-black font-medium">
                  {item.rates !== null ? `$${item.rates?.toLocaleString()}` : "-"}
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
                          text={getDisplayStatus(item.fileStatus)}
                          variant={getBadgeVariant(item.fileStatus)}
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
                              <ChevronDown size={14} className="rotate-90 cursor-pointer" onClick={() => setOpenDropdown(null)} />{" "}
                              Select Status
                            </span>
                          </div>
                          {statusOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => handleStatusChange(idx, opt.value)}
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
                        text={getDisplayStatus(item.fileStatus)}
                        variant={getBadgeVariant(item.fileStatus)}
                      />
                    </div>
                  )}
                </td>
                <td className="py-3 px-6 text-right">
                  {item.fileName && (
                    <Button
                      onClick={() => handleViewDetails(item)}
                      variant="gradient"
                      size="sm"
                    >
                      <Eye size={18} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
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

export default ProjectShipperFilesTable;
