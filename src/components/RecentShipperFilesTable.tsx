import React, { useState} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { RecentShipperFile } from "@/data/productionMockData";
import { Eye, ArrowUpDown, ChevronDown } from "lucide-react";
import CommonCheckbox from "./common_component/CommonCheckbox";
import CommonStatusBadge from "./common_component/CommonStatusBadge";
import Button from "./common_component/Button";
import SuccessModal from "./common_component/SuccessModal";

interface Props {
  data: RecentShipperFile[];
}

const RecentShipperFilesTable: React.FC<Props> = ({ data }) => {
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
    // In a real app, update the item status via API or state lifting
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
      list.sort((a: any, b: any) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "uploadDate") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (["items", "rates", "weight"].includes(sortConfig.key)) {
          valA = parseFloat(String(valA).replace(/[^0-9.]/g, "")) || 0;
          valB = parseFloat(String(valB).replace(/[^0-9.]/g, "")) || 0;
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return list;
  }, [data, sortConfig]);

  const handleViewDetails = (item: RecentShipperFile) => {
    const cId = customerId || "ID-2025-1047";
    const pId = projectId || item.projectId || "PRJ-001";
    navigate(`/projects/shipper-file-details/${cId}/${pId}/${item.fileName}`);
  };

  const getBadgeVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("received") || s.includes("pending")) return "yellow";
    if (
      s.includes("compared") ||
      s.includes("approved") ||
      s.includes("sent") ||
      s.includes("revision")
    )
      return "green";
    return "gray";
  };

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#E2E4E6] text-nowrap">
              <th className="py-4 px-6 w-12">
                <CommonCheckbox
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
              <th className="py-4 px-4 text-sm  font-semibold text-black">
                Project Name
              </th>
              <th className="py-4 px-4 text-sm  font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("shipperName")}
                >
                  Shipper
                  <ArrowUpDown
                    size={14}
                    className={
                      sortConfig.key === "shipperName"
                        ? "text-(--text-color-primary-blue)"
                        : "text-(--text-color-gray-4)"
                    }
                  />
                </div>
              </th>
              <th className="py-4 px-4 text-sm  font-semibold text-black">
                File Name
              </th>
              <th className="py-4 px-4 text-sm  font-semibold text-black">
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
              <th className="py-4 px-4 text-sm  font-semibold text-black">
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
              <th className="py-4 px-4 text-sm  font-semibold text-black">
                <div
                  className="flex items-center gap-1 cursor-pointer group"
                  onClick={() => handleSort("rates")}
                >
                  Rates
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
              <th className="py-4 px-4 text-sm  font-semibold text-black">
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
              <th className="py-4 px-4 text-sm  font-semibold text-black">
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
                    checked={selectedRows.includes(idx)}
                    onChange={(checked) => {
                      if (checked) setSelectedRows([...selectedRows, idx]);
                      else
                        setSelectedRows(selectedRows.filter((i) => i !== idx));
                    }}
                  />
                </td>
                <td className="py-3 px-4 text-[15px]  font-normal text-black">
                  {item.projectName}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shrink-0">
                      <img
                        src={item.shipperAvatar}
                        alt={item.shipperName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm  font-normal text-black">
                      {item.shipperName}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm  text-[#637381]">
                  {item.fileName}
                </td>
                <td className="py-3 px-4 text-sm  text-[#637381]">
                  {item.uploadDate}
                </td>
                <td className="py-3 px-4 text-sm  text-black font-medium">
                  {item.items}
                </td>
                <td className="py-3 px-4 text-sm  text-black font-medium">
                  {item.rates}
                </td>
                <td className="py-3 px-4 text-sm  text-black font-medium">
                  {item.weight}
                </td>
                <td className="py-3 px-4">
                  {isQuotationPage ? (
                    <div className="relative w-fit">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === idx ? null : idx)
                        }
                        className="flex items-center gap-1 bg-white hover:bg-gray-50 transition-colors rounded-sm"
                      >
                        <CommonStatusBadge
                          text={item.status}
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
                            <span className="text-xs  font-normal text-black flex items-center gap-1.5">
                              <ChevronDown size={14} className="rotate-90 cursor-pointer" onClick={() => setOpenDropdown(null)} />{" "}
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
                        text={item.status}
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

export default RecentShipperFilesTable;
