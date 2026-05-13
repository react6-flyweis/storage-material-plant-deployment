import React from "react";
import {
  File,
  Truck,
  DraftingCompass,
  ChartArea,
  FileChartLine,
} from "lucide-react";
import type {
  ShipperFile,
  PlantAlert,
  FreightCarrier,
} from "@/data/productionMockData";

// Icons
import pdfIcon from "@/assets/icon/dashboard/pdfIcon.svg";
import xlxsIcon from "@/assets/icon/dashboard/xlxs.svg";
import networkIcon from "@/assets/icon/dashboard/network.svg";
import gitBranchIcon from "@/assets/icon/dashboard/gitBranch.svg";
import { useNavigate } from "react-router-dom";

interface PlantDataGridsProps {
  shipperFiles: ShipperFile[];
  alerts: PlantAlert[];
  carriers: FreightCarrier[];
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
  shipperFiles,
  alerts,
  carriers,
}) => {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 xl:gap-4 mt-6">
      {/* Card 1: Recent Shipper Files Received */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Recent Shipper Files Received" />
        <div className="space-y-0 divide-y divide-[--border-color-secondary]">
          {shipperFiles.map((file, idx) => {
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
          })}
        </div>
        <button className="w-full mt-6 py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-base hover:bg-blue-50 transition-colors"
         onClick={()=>navigate("/load_planning/shipper-quotation")}>
          View All Shipper Files
        </button>
      </div>

      {/* Card 2: Plant Alerts */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Plant Alerts" />
        <div className="space-y-0 divide-y divide-[#F4F6F8] max-h-[400px] overflow-y-auto pb-5">
          {alerts.map((alert, idx) => {
            const getAlertStyles = () => {
              switch (alert.type) {
                case "shipper":
                  return {
                    bg: "bg-[#DFF4FE]",
                    color: "text-[#155DFC]",
                    icon: <File size={20} strokeWidth={1.5}/>,
                  };
                case "order":
                  return {
                    bg: "bg-[#ECF6F1]",
                    color: "text-[#3AB449]",
                    icon: <Truck size={20} strokeWidth={1.5}/>,
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
          })}
        </div>
        <button className="w-full mt-auto py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-base hover:bg-blue-50 transition-colors"  onClick={()=>navigate("/notification")}>
          View All Alerts
        </button>
      </div>

      {/* Card 3: Freight Carriers */}
      <div className="bg-white rounded-[14px] p-4 md:p-6 shadow-sm border border-[#F4F6F8] flex flex-col">
        <SectionTitle title="Freight Carriers" />
        <div className="space-y-0 divide-y divide-[#F4F6F8] max-[400px] overflow-y-auto pb-5">
          {carriers.map((carrier, idx) => {
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
          })}
        </div>
        <button className="w-full mt-auto py-2.5 border border-[#155DFC] rounded-lg text-[#0088FF] font-semibold text-base hover:bg-blue-50 transition-colors">
          View All Carriers
        </button>
      </div>
    </div>
  );
};

export default PlantDataGrids;
