import React, { useState, useEffect, useMemo } from "react";
import {
  File,
  Truck,
  DraftingCompass,
  ChartArea,
  FileChartLine,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Icons
import pdfIcon from "@/assets/icon/dashboard/pdfIcon.svg";
import xlxsIcon from "@/assets/icon/dashboard/xlxs.svg";
import networkIcon from "@/assets/icon/dashboard/network.svg";
import gitBranchIcon from "@/assets/icon/dashboard/gitBranch.svg";

import type {
  PlantDashboardRecentShipperFile,
  PlantDashboardAlert,
  PlantDashboardFreightCarrier,
} from "@/redux/api/plantDashboardApi";

interface PlantDataGridsProps {
  shipperFiles?: PlantDashboardRecentShipperFile[];
  alerts?: PlantDashboardAlert[];
  carriers?: PlantDashboardFreightCarrier[];
  isLoading?: boolean;
}

type SectionTitleProps = {
  title: string;
  className?: string;
};

const SectionTitle = ({ title, className = "" }: SectionTitleProps) => {
  return (
    <h2
      className={`text-base md:text-lg font-semibold text-black mb-4 ${className}`}
    >
      {title}
    </h2>
  );
};

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDisplayTime(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

const PlantDataGrids: React.FC<PlantDataGridsProps> = ({
  shipperFiles = [],
  alerts = [],
  carriers = [],
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const [socketShipperFiles, setSocketShipperFiles] = useState<PlantDashboardRecentShipperFile[]>([]);
  const [socketAlerts, setSocketAlerts] = useState<PlantDashboardAlert[]>([]);

  const displayedShipperFiles = useMemo(() => {
    return [...socketShipperFiles, ...shipperFiles];
  }, [socketShipperFiles, shipperFiles]);

  const displayedAlerts = useMemo(() => {
    return [...socketAlerts, ...alerts].slice(0, 5);
  }, [socketAlerts, alerts]);

  // Listen to global socket events sent from GlobalSocketListener
  useEffect(() => {
    const handleProjectAssigned = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantDashboardAlert = {
        message: `Project assigned: ${data.projectName || "Project"} (PO: ${data.poOrderId || ""})`,
        occurredAt: new Date().toISOString(),
        type: "order",
        projectName: data.projectName,
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    const handleBomExtractionComplete = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantDashboardAlert = {
        message: `BOM extraction complete for Building ${data.buildingNumber} (${data.totalItems} items)`,
        occurredAt: new Date().toISOString(),
        type: "shipper",
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    const handleBomExtractionFailed = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantDashboardAlert = {
        message: `BOM extraction failed for Building ${data.buildingNumber}: ${data.error}`,
        occurredAt: new Date().toISOString(),
        type: "fileLine",
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    const handleShipperFileSubmitted = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newFile: PlantDashboardRecentShipperFile = {
        fileName: `Quote Request ${data.requestId}`,
        requestId: data.requestId,
        projectId: data.projectId || "PRO-000",
        projectName: data.projectName || "Project",
        vendorName: data.vendorName || "Vendor",
        uploadDate: data.submittedAt || new Date().toISOString(),
        rate: data.quoteValue || 0,
        weight: data.weight || 0,
        status: "file_received",
      };
      setSocketShipperFiles((prev) => [newFile, ...prev]);

      const newAlert: PlantDashboardAlert = {
        message: `Vendor ${data.vendorName} submitted shipper quote for request ${data.requestId} ($${data.quoteValue || 0})`,
        occurredAt: new Date().toISOString(),
        type: "shipper",
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    const handleAllShipperFilesSubmitted = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantDashboardAlert = {
        message: `All ${data.vendorCount} vendor quotes submitted for Lead ${data.leadId}`,
        occurredAt: new Date().toISOString(),
        type: "shipper",
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    const handleShipperComparisonComplete = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantDashboardAlert = {
        message: `Shipper comparison complete for request ${data.requestId}`,
        occurredAt: new Date().toISOString(),
        type: "comparison_completed",
        refId: data.requestId,
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    const handleShipperComparisonFailed = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantDashboardAlert = {
        message: `Shipper comparison failed for request ${data.requestId}: ${data.error}`,
        occurredAt: new Date().toISOString(),
        type: "fileLine",
      };
      setSocketAlerts((prev) => [newAlert, ...prev]);
    };

    window.addEventListener("socket_project_assigned", handleProjectAssigned);
    window.addEventListener("socket_bom_extraction_complete", handleBomExtractionComplete);
    window.addEventListener("socket_bom_extraction_failed", handleBomExtractionFailed);
    window.addEventListener("socket_shipper_file_submitted", handleShipperFileSubmitted);
    window.addEventListener("socket_all_shipper_files_submitted", handleAllShipperFilesSubmitted);
    window.addEventListener("socket_shipper_comparison_complete", handleShipperComparisonComplete);
    window.addEventListener("socket_shipper_comparison_failed", handleShipperComparisonFailed);

    return () => {
      window.removeEventListener("socket_project_assigned", handleProjectAssigned);
      window.removeEventListener("socket_bom_extraction_complete", handleBomExtractionComplete);
      window.removeEventListener("socket_bom_extraction_failed", handleBomExtractionFailed);
      window.removeEventListener("socket_shipper_file_submitted", handleShipperFileSubmitted);
      window.removeEventListener("socket_all_shipper_files_submitted", handleAllShipperFilesSubmitted);
      window.removeEventListener("socket_shipper_comparison_complete", handleShipperComparisonComplete);
      window.removeEventListener("socket_shipper_comparison_failed", handleShipperComparisonFailed);
    };
  }, []);

  const getAlertStyles = (type: string) => {
    switch (type?.toLowerCase()) {
      case "comparison_completed":
      case "shipper":
        return {
          bg: "bg-[#DFF4FE]",
          color: "text-[#155DFC]",
          icon: <File size={20} strokeWidth={1.5} />,
        };
      case "order":
        return {
          bg: "bg-[#ECF6F1]",
          color: "text-[#3AB449]",
          icon: <Truck size={20} strokeWidth={1.5} />,
        };
      case "drawing":
        return {
          bg: "bg-[#DDD1F6]",
          color: "text-[#7539FF]",
          icon: <DraftingCompass size={20} strokeWidth={1.5} />,
        };
      case "production":
        return {
          bg: "bg-[#FDEEDF]",
          color: "text-[#B00000]",
          icon: <ChartArea size={20} strokeWidth={1.5} />,
        };
      case "fileline":
      case "failed":
        return {
          bg: "bg-[#FFE7E4]",
          color: "text-[#EF4444]",
          icon: <FileChartLine size={20} strokeWidth={1.5} />,
        };
      default:
        return {
          bg: "bg-[#DFF4FE]",
          color: "text-[#155DFC]",
          icon: <FileChartLine size={20} strokeWidth={1.5} />,
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-4 mt-6">
      {/* Card 1: Recent Shipper Files Received */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Recent Shipper Files Received" />
        <div className="space-y-0 divide-y divide-[--border-color-secondary] max-h-[380px] overflow-y-auto pb-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-400 animate-pulse">Loading shipper files...</div>
          ) : displayedShipperFiles.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No shipper files received</div>
          ) : (
            displayedShipperFiles.slice(0, 5).map((file, idx) => {
              const fileNameLower = (file.fileName || "").toLowerCase();
              const isXls =
                fileNameLower.endsWith(".xlsx") ||
                fileNameLower.endsWith(".xls") ||
                fileNameLower.endsWith(".csv");
              const isApproved = file.status?.toLowerCase() === "approved";
              const isRejected = file.status?.toLowerCase() === "rejected";

              return (
                <div
                  key={file.requestId || idx}
                  className="flex items-center py-3.5 first:pt-0 last:pb-0 cursor-pointer hover:bg-gray-50/70 transition-colors rounded-lg px-1.5"
                  onClick={() => {
                    if (file.projectId && file.requestId) {
                      navigate(`/projects/${file.projectId}/shipper-files/${file.requestId}`);
                    }
                  }}
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 mr-3.5 ${
                      isXls ? "bg-[#F0FDF4]" : "bg-[#FFF1F0]"
                    }`}
                  >
                    <img
                      src={isXls ? xlxsIcon : pdfIcon}
                      alt="file icon"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="grow min-w-0 pr-2">
                    <h3 className="text-sm font-medium text-[#212B36] truncate">
                      {file.fileName || `Quote Request ${file.requestId}`}
                    </h3>
                    <p className="text-xs text-[#637381] mt-0.5 truncate">
                      {file.projectName || file.projectId}
                      {file.vendorName ? ` | ${file.vendorName}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block mb-1 capitalize ${
                        isApproved
                          ? "bg-[#ECF6F1] text-[#00C853]"
                          : isRejected
                          ? "bg-[#FEE2E2] text-[#EF4444]"
                          : "bg-[#FFF6D0] text-[#B78B00]"
                      }`}
                    >
                      {file.status ? file.status.replace("_", " ") : "Received"}
                    </div>
                    <p className="text-xs font-medium text-black leading-tight">
                      {formatDisplayDate(file.uploadDate)}
                    </p>
                    <p className="text-[11px] text-[#919EAB] mt-0.5">
                      {formatDisplayTime(file.uploadDate)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button
          className="w-full mt-auto pt-4 py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-sm hover:bg-blue-50 transition-colors"
          onClick={() => navigate("/load_planning/shipper-quotation")}
        >
          View All Shipper Files
        </button>
      </div>

      {/* Card 2: Plant Alerts */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Plant Alerts" />
        <div className="space-y-0 divide-y divide-[#F4F6F8] max-h-[380px] overflow-y-auto pb-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-400 animate-pulse">Loading alerts...</div>
          ) : displayedAlerts.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No plant alerts</div>
          ) : (
            displayedAlerts.map((alert, idx) => {
              const styles = getAlertStyles(alert.type);
              const isComparisonCompleted =
                alert.type?.toLowerCase() === "comparison_completed" && Boolean(alert.refId);

              return (
                <div
                  key={alert.refId || idx}
                  className={`flex items-center py-3.5 first:pt-0 last:pb-0 px-1.5 ${
                    isComparisonCompleted
                      ? "cursor-pointer hover:bg-blue-50/50 transition-colors rounded-lg"
                      : ""
                  }`}
                  onClick={() => {
                    if (isComparisonCompleted && alert.refId) {
                      navigate(`/load_planning/${alert.refId}/comparison-result`);
                    }
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mr-3.5 ${styles.bg} ${styles.color}`}
                  >
                    {styles.icon}
                  </div>
                  <div className="flex flex-col grow min-w-0">
                    <p className="text-sm font-normal text-[#212B36] leading-tight line-clamp-2">
                      {alert.message}
                    </p>
                    {alert.projectName && (
                      <span className="text-xs text-[#637381] mt-0.5 font-medium">
                        {alert.projectName}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs text-[#919EAB] block">
                      {formatDisplayDate(alert.occurredAt)}
                    </span>
                    <span className="text-[11px] text-[#919EAB]">
                      {formatDisplayTime(alert.occurredAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button
          className="w-full mt-auto pt-4 py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-sm hover:bg-blue-50 transition-colors"
          onClick={() => navigate("/notification")}
        >
          View All Alerts
        </button>
      </div>

      {/* Card 3: Freight Carriers */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Freight Carriers" />
        <div className="space-y-0 divide-y divide-[#F4F6F8] max-h-[380px] overflow-y-auto pb-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-400 animate-pulse">Loading carriers...</div>
          ) : carriers.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No freight carriers registered</div>
          ) : (
            carriers.slice(0, 5).map((carrier, idx) => {
              const isDelayed = carrier.status?.toLowerCase().includes("delay");
              const icon = idx % 2 === 0 ? networkIcon : gitBranchIcon;
              return (
                <div
                  key={carrier.carrierId || idx}
                  className="flex items-center py-3.5 first:pt-0 last:pb-0 px-1.5"
                >
                  <div className="w-10 h-10 bg-[#F4F6F8] rounded-lg flex items-center justify-center shrink-0 mr-3.5">
                    <img src={icon} alt="carrier icon" className="w-6 h-6" />
                  </div>
                  <div className="grow min-w-0">
                    <h3 className="text-sm font-medium text-[#212B36] truncate">
                      {carrier.carrierName}
                    </h3>
                    <p className="text-xs text-[#637381] mt-0.5">
                      {carrier.loadsToday ?? 0} {carrier.loadsToday === 1 ? "Load" : "Loads"} Today
                      {carrier.delayed ? ` (${carrier.delayed} delayed)` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 ml-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        isDelayed
                          ? "bg-[#FFF6D0] text-[#B78B00]"
                          : "bg-[#ECF6F1] text-[#00C853]"
                      }`}
                    >
                      {carrier.status || "On Time"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button
          className="w-full mt-auto pt-4 py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-sm hover:bg-blue-50 transition-colors"
          onClick={() => navigate("/logistics/freight-carriers")}
        >
          View All Carriers
        </button>
      </div>
    </div>
  );
};

export default PlantDataGrids;
