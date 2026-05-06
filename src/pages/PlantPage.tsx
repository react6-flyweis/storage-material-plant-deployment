import { useState } from "react";
import HammerIcon from "@/assets/hammerIcon.svg";
import CheckedShieldIcon from "@/assets/checkedShieldIcon.svg";
import YellowDollerIcon from "@/assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "@/assets/salmonGraphIcon.svg";
import TitleSubtitle from "@/components/common_component/TitleSubtitle";
import { dashboardText } from "@/data/text/DashboardText";
import ProductionOverview from "@/components/ProductionOverview";
import PlantDataGrids from "@/components/PlantDataGrids";
import RecentShipperFilesTable from "@/components/RecentShipperFilesTable";
import DrawingApprovalStatusTable from "@/components/DrawingApprovalStatusTable";
import SubHeading from "@/components/common_component/SubHeading";
import {
  productionMetricsByFilter,
  shipperFilesByFilter,
  plantAlertsByFilter,
  freightCarriersByFilter,
  recentShipperFilesByFilter,
  drawingApprovalStatusByFilter,
} from "@/data/productionMockData";


export type TabType = "today" | "week" | "month";

export const DashboardStatsByFilter: Record<
  TabType,
  {
    title: string;
    value: string;
  }[]
> = {
  today: [
    { title: "Total Projects", value: "04" },
    { title: "In Production", value: "89" },
    { title: "Ready to Dispatch", value: "124" },
    { title: "Dispatched Today", value: "34" },
    { title: "Pending Approval", value: "18" },
  ],

  week: [
    { title: "Total Projects", value: "04" },
    { title: "In Production", value: "102" },
    { title: "Ready to Dispatch", value: "156" },
    { title: "Dispatched Today", value: "54" },
    { title: "Pending Approval", value: "18" },
  ],

  month: [
    { title: "Total Projects", value: "04" },
    { title: "In Production", value: "168" },
    { title: "Ready to Dispatch", value: "98" },
    { title: "Dispatched Today", value: "54" },
    { title: "Pending Approval", value: "18" },
  ],
} as const;

export const icons = [
  {
    icon: <img src={HammerIcon} alt="leads" className="md:size-6 size-4" />,
    color: "bg-[#3B82F6]",
  },
  {
    icon: (
      <img
        src={CheckedShieldIcon}
        alt="confirmed"
        className="md:size-6 size-4"
      />
    ),
    color: "bg-[#3AB449]",
  },
  {
    icon: (
      <img src={YellowDollerIcon} alt="value" className="md:size-6 size-4" />
    ),
    color: "bg-[#F59E0B]",
  },
  {
    icon: (
      <img src={SalmonGraphIcon} alt="revenue" className="md:size-6 size-4" />
    ),
    color: "bg-[#6840D4]",
  },
  {
    icon: (
      <img src={SalmonGraphIcon} alt="revenue" className="md:size-6 size-4" />
    ),
    color: "bg-[#FD8D5B]",
  },
];

export const materialKpisByFilter: Record<
  TabType,
  {
    value: string;
    subtext: string;
    trend: { value: string; isPositive: boolean };
  }[]
> = {
  today: [
    {
      value: "$1,248,900",
      subtext: "Current Material Value",
      trend: { value: "+8%", isPositive: true },
    },
    {
      value: "$182,450",
      subtext: "Outflow Today",
      trend: { value: "-3%", isPositive: false },
    },
    {
      value: "2",
      subtext: "Reorder Requests Pending",
      trend: { value: "+12%", isPositive: true },
    },
    {
      value: "1",
      subtext: "Emergency Material Alerts",
      trend: { value: "-10%", isPositive: false },
    },
  ],

  week: [
    {
      value: "$4,782,300",
      subtext: "Current Material Value",
      trend: { value: "+18%", isPositive: true },
    },
    {
      value: "$968,240",
      subtext: "Outflow this Week",
      trend: { value: "-11%", isPositive: false },
    },
    {
      value: "5",
      subtext: "Reorder Requests Pending",
      trend: { value: "+28%", isPositive: true },
    },
    {
      value: "3",
      subtext: "Emergency Material Alerts",
      trend: { value: "-15%", isPositive: false },
    },
  ],

  month: [
    {
      value: "$8,458,798",
      subtext: "Current Material Value",
      trend: { value: "+35%", isPositive: true },
    },
    {
      value: "$4,898,878",
      subtext: "Outflow this Month",
      trend: { value: "-19%", isPositive: false },
    },
    {
      value: "6",
      subtext: "Reorder Requests Pending",
      trend: { value: "+41%", isPositive: true },
    },
    {
      value: "2",
      subtext: "Emergency Material Alerts",
      trend: { value: "-20%", isPositive: false },
    },
  ],
} as const;

// const kpiVisuals = [
//   {
//     icon: <img src={ProfitIcon} alt="revenue" className="size-5" />,
//     iconBgColor: "bg-[#E9F8FB]",
//     iconColor: "text-[#06AED4]",
//   },
//   {
//     icon: <img src={InvoiceDueIcon} alt="revenue" className="size-5" />,
//     iconBgColor: "bg-[#E9F5F4]",
//     iconColor: "text-green-500",
//   },
//   {
//     icon: <img src={ExpensesIcon} alt="revenue" className="size-4" />,
//     iconBgColor: "bg-[#FCEFEA]",
//     iconColor: "text-orange-500",
//   },
//   {
//     icon: <img src={HashIcon} alt="revenue" className="size-4" />,
//     iconBgColor: "bg-[#EDEDFB]",
//     iconColor: "text-purple-500",
//   },
// ];

const filterLabels: Record<TabType, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
};

const PlantPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  // const navigate = useNavigate();

  const productionMetrics = productionMetricsByFilter[activeTab];
  const shipperFiles = shipperFilesByFilter[activeTab];
  const alerts = plantAlertsByFilter[activeTab];
  const carriers = freightCarriersByFilter[activeTab];

  return (
    <div className="xl:px-0 px-2 pb-10 space-y-6 pt-4">
      {/* Header: Title + FilterTabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <TitleSubtitle
          title={dashboardText.header.title}
          subtitle={dashboardText.header.subtitle}
        />
      </div>
      {/* Production Overview (new) */}
      <ProductionOverview
        metrics={productionMetrics}
        filterLabel={filterLabels[activeTab]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {/* Dashboard Grids */}
      <PlantDataGrids
        shipperFiles={shipperFiles}
        alerts={alerts}
        carriers={carriers}
      />

      {/* Recent Shipper Files Table */}
      <div className="space-y-4">
        <SubHeading text="Recent Shipper Files" />
        <RecentShipperFilesTable data={recentShipperFilesByFilter[activeTab]} />
      </div>

      {/* Drawing Approval Status Table */}
      <div className="space-y-4">
        <SubHeading text="Drawing Approval Status" />
        <DrawingApprovalStatusTable data={drawingApprovalStatusByFilter[activeTab]} />
      </div>
    </div>
  );
};

export default PlantPage;
