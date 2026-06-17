import { useState, useEffect } from "react";
import {
  File,
  Truck,
  DraftingCompass,
  ChartArea,
  FileChartLine,
} from "lucide-react";

// Icons
import pdfIcon from "@/assets/icon/dashboard/pdfIcon.svg";
import xlxsIcon from "@/assets/icon/dashboard/xlxs.svg";
import networkIcon from "@/assets/icon/dashboard/network.svg";
import gitBranchIcon from "@/assets/icon/dashboard/gitBranch.svg";
import { useNavigate } from "react-router-dom";

import type { ShipperFile, PlantAlert, FreightCarrier } from "@/data/productionMockData";

interface PlantDataGridsProps {
  shipperFiles?: ShipperFile[];
  alerts?: PlantAlert[];
  carriers?: FreightCarrier[];
}

type SectionTitleProps = {
  title: string;
  className?: string;
};

const SectionTitle = ({ title, className = "" }: SectionTitleProps) => {
  return (
    <h2
      className={`text-base md:text-lg  font-semibold text-black mb-4 ${className}`}
    >
      {title}
    </h2>
  );
};

const PlantDataGrids: React.FC<PlantDataGridsProps> = ({
  shipperFiles = [],
  alerts = [],
  carriers = [],
}) => {
  const navigate = useNavigate();

  const [localShipperFiles, setLocalShipperFiles] = useState<ShipperFile[]>(shipperFiles);
  const [localAlerts, setLocalAlerts] = useState<PlantAlert[]>(alerts);
  const [localCarriers, setLocalCarriers] = useState<FreightCarrier[]>(carriers);

  // Sync props to state if they change
  useEffect(() => {
    setLocalShipperFiles(shipperFiles);
  }, [shipperFiles]);

  useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    setLocalCarriers(carriers);
  }, [carriers]);

  // Listen to global socket events sent from GlobalSocketListener
  useEffect(() => {
    const handleProjectAssigned = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantAlert = {
        message: `Project assigned: ${data.projectName} (PO: ${data.poOrderId})`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "order",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
    };

    const handleBomExtractionComplete = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantAlert = {
        message: `BOM extraction complete for Building ${data.buildingNumber} (${data.totalItems} items)`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "shipper",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
    };

    const handleBomExtractionFailed = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantAlert = {
        message: `BOM extraction failed for Building ${data.buildingNumber}: ${data.error}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "fileLine",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
    };

    const handleShipperFileSubmitted = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newFile: ShipperFile = {
        name: `Quote Request ${data.requestId}`,
        shpId: data.requestId,
        company: data.vendorName,
        items: 0,
        date: new Date(data.submittedAt).toLocaleDateString(),
        time: new Date(data.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setLocalShipperFiles((prev) => [newFile, ...prev]);

      const newAlert: PlantAlert = {
        message: `Vendor ${data.vendorName} submitted shipper quote for request ${data.requestId} ($${data.quoteValue || 0})`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "shipper",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
    };

    const handleAllShipperFilesSubmitted = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantAlert = {
        message: `All ${data.vendorCount} vendor quotes submitted for Lead ${data.leadId}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "shipper",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
    };

    const handleShipperComparisonComplete = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantAlert = {
        message: `Shipper comparison complete for request ${data.requestId}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "shipper",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
    };

    const handleShipperComparisonFailed = (e: Event) => {
      const data = (e as CustomEvent).detail;
      const newAlert: PlantAlert = {
        message: `Shipper comparison failed for request ${data.requestId}: ${data.error}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "fileLine",
      };
      setLocalAlerts((prev) => [newAlert, ...prev]);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-4 mt-6">
      {/* Card 1: Recent Shipper Files Received */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Recent Shipper Files Received" />
        <div className="space-y-0 divide-y divide-[--border-color-secondary]">
          {localShipperFiles.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No shipper files received</div>
          ) : (
            localShipperFiles.map((file, idx) => {
              const isXls =
                file.name.toLowerCase().includes("tech park") ||
                idx === 1 ||
                idx === 3;
              return (
                <div
                  key={idx}
                  className="flex items-center py-4 first:pt-0 last:pb-0"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 mr-4 ${isXls ? "bg-[#F0FDF4]" : "bg-[#FFF1F0]"}`}
                  >
                    <img
                      src={isXls ? xlxsIcon : pdfIcon}
                      alt="file icon"
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm  font-medium text-black truncate">
                      {file.name}
                    </h3>
                    <p className="text-sm font-inter text-[#637381] mt-1">
                      {file.shpId} | {file.company}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`px-3 py-0.5 rounded-full text-xs font-inter font-semibold inline-block mb-1 text-black ${isXls ? "bg-[#ECF6F1]" : "bg-[#FEE2E2]"}`}
                    >
                      {file.items} Items
                    </div>
                    <p className="text-sm font-inter font-normal text-black leading-tight">
                      {file.date}
                    </p>
                    <p className="text-xs font-inter text-(--text-color-gray-3) mt-0.5">
                      {file.time}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="w-full mt-6 py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-sm md:text-base hover:bg-blue-50 transition-colors"
          onClick={() => navigate("/load_planning/shipper-quotation")}>
          View All Shipper Files
        </button>
      </div>

      {/* Card 2: Plant Alerts */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Plant Alerts" />
        <div className="space-y-0 divide-y divide-[#F4F6F8] max-h-[400px] overflow-y-auto pb-5">
          {localAlerts.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No plant alerts</div>
          ) : (
            localAlerts.map((alert, idx) => {
              const getAlertStyles = () => {
                switch (alert.type) {
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
                  case "fileLine":
                    return {
                      bg: "bg-[#FFE7E4]",
                      color: "text-[#EF4444]",
                      icon: <FileChartLine size={20} strokeWidth={1.5} />,
                    };
                  default:
                    return {
                      bg: "bg-gray-100",
                      color: "text-gray-600",
                      icon: <FileChartLine size={20} strokeWidth={1.5} />,
                    };
                }
              };
              const styles = getAlertStyles();
              return (
                <div
                  key={idx}
                  className="flex items-center py-4 first:pt-0 last:pb-0"
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 mr-4 ${styles.bg} ${styles.color}`}
                  >
                    {styles.icon}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between grow gap-2 min-w-0">
                    <p className="text-sm font-normal text-black leading-tight">
                      {alert.message}
                    </p>
                    <span className="text-sm  text-(--text-color-gray-3) md:ml-4 shrink-0">
                      {alert.time}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="w-full mt-auto py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-sm md:text-base hover:bg-blue-50 transition-colors" onClick={() => navigate("/notification")}>
          View All Alerts
        </button>
      </div>

      {/* Card 3: Freight Carriers */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Freight Carriers" />
        <div className="space-y-0 divide-y divide-[#F4F6F8] max-[400px] overflow-y-auto pb-5">
          {localCarriers.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No freight carriers registered</div>
          ) : (
            localCarriers.map((carrier, idx) => {
              const isDelayed = carrier.status === "Delayed";
              const icon = idx % 2 === 0 ? networkIcon : gitBranchIcon;
              return (
                <div
                  key={idx}
                  className="flex items-center py-4 first:pt-0 last:pb-0"
                >
                  <div className="w-11 h-11 bg-[#F4F6F8] rounded-lg flex items-center justify-center shrink-0 mr-4">
                    <img src={icon} alt="carrier icon" className="w-full h-full" />
                  </div>
                  <div className="grow min-w-0">
                    <h3 className="text-sm md:text-base  font-medium text-black truncate">
                      {carrier.name}
                    </h3>
                    <p className="text-sm font-inter text-[#637381] mt-1">
                      {carrier.loads}
                    </p>
                  </div>
                  <div className="shrink-0 ml-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-inter font-medium ${isDelayed ? "bg-[#FFF6D0] text-[#B78B00]" : "bg-(--background-green) text-(--text-color-green-2)"}`}
                    >
                      {carrier.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <button className="w-full mt-auto py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-sm md:text-base hover:bg-blue-50 transition-colors" onClick={() => navigate("/logistics/freight-carriers")}>
          View All Carriers
        </button>
      </div>
    </div>
  );
};

export default PlantDataGrids;
