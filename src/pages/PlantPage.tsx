import StatCard from "@/components/ui/stat-card";
import DashboardWidgets from "@/components/DashboardWidgets";
import InventoryTable from "@/components/InventoryTable";
import KPICard from "@/components/KPICard";
import type { Column } from "@/components/Table";
import { flteredMockInventoryData, mockInventoryData, mockMachineUsageData } from "@/data/mockData";
import HammerIcon from "@/assets/hammerIcon.svg";
import CheckedShieldIcon from "@/assets/checkedShieldIcon.svg";
import YellowDollerIcon from "@/assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "@/assets/salmonGraphIcon.svg";
import ProfitIcon from "@/assets/ProfitIcon.svg";
import HashIcon from "@/assets/hashIcon.svg";
import InvoiceDueIcon from "@/assets/InvoiceDueIcon.svg";
import ExpensesIcon from "@/assets/ExpensesIcon.svg";
import TitleSubtitle from "@/components/common_component/TitleSubtitle";
import { dashboardText } from "@/data/text/DashboardText";
import FilterTabs from "@/components/common_component/FilterTabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type TabType = "today" | "week" | "month";

export const DashboardStatsByFilter: Record<
  TabType,
  {
    title: string;
    value: string;
  }[]
> = {
  today: [
    { title: "Total Equipment", value: "247 units" },
    { title: "Available", value: "89" },
    { title: "In Use", value: "124" },
    { title: "Under Maintenance", value: "34" },
  ],

  week: [
    { title: "Total Equipment", value: "312 units" },
    { title: "Available", value: "102" },
    { title: "In Use", value: "156" },
    { title: "Under Maintenance", value: "54" },
  ],

  month: [
    { title: "Total Equipment", value: "320 units" },
    { title: "Available", value: "168" },
    { title: "In Use", value: "98" },
    { title: "Under Maintenance", value: "54" },
  ],
} as const;

export const icons = [
  {
    icon: <img src={HammerIcon} alt="leads" className="md:size-6 size-4" />,
    color: "bg-[#1D51A4]",
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

const kpiVisuals = [
  {
    icon: <img src={ProfitIcon} alt="revenue" className="size-5" />,
    iconBgColor: "bg-[#E9F8FB]",
    iconColor: "text-[#06AED4]",
  },
  {
    icon: <img src={InvoiceDueIcon} alt="revenue" className="size-5" />,
    iconBgColor: "bg-[#E9F5F4]",
    iconColor: "text-green-500",
  },
  {
    icon: <img src={ExpensesIcon} alt="revenue" className="size-4" />,
    iconBgColor: "bg-[#FCEFEA]",
    iconColor: "text-orange-500",
  },
  {
    icon: <img src={HashIcon} alt="revenue" className="size-4" />,
    iconBgColor: "bg-[#EDEDFB]",
    iconColor: "text-purple-500",
  },
];

const PlantPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("month");
  const navigate = useNavigate()

  const inventoryColumns: Column<(typeof mockInventoryData)[0]>[] = [
    {
      header: "Material",
      accessor: (row) => <span className="text-gray-900">{row.material}</span>,
    },
    {
      header: "Current Stock",
      accessor: (row) => (
        <span className="font-semibold">{row.currentStock}</span>
      ),
    },
    {
      header: "Unit",
      accessor: (row) => row.unit,
    },
    {
      header: "Min Level",
      accessor: (row) => row.minLevel,
    },
    {
      header: "Status",
      accessor: (row) => row.status,
    },
    {
      header: "Action",
      accessor: (row) => (
        <button
        onClick={()=>navigate('/equipment_management')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium w-24 text-center transition-colors ${
            row.action === "Reorder"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          {row.action}
        </button>
      ),
      className: "text-center",
      cellClassName: "text-right",
    },
  ];

  const machineColumns: Column<(typeof mockMachineUsageData)[0]>[] = [
    {
      header: "Equipment",
      accessor: (row) => <span className="text-gray-600">{row.equipment}</span>,
    },
    {
      header: "Type",
      accessor: (row) => <span className="text-gray-500">{row.type}</span>,
    },
    {
      header: "Last Service",
      accessor: (row) => (
        <span className="text-gray-900 font-medium">{row.lastService}</span>
      ),
    },
    {
      header: "Next Due",
      accessor: (row) => (
        <span className="text-gray-900 font-medium">{row.nextDue}</span>
      ),
    },
    {
      header: "Priority",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${row.priorityColor} shadow-sm`}
          ></span>
          <span className="text-gray-700">{row.priority}</span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (row) => (
        <button
        onClick={()=>navigate('/equipment_management')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium w-24 text-center transition-colors ${
            row.priority === "High" || row.priority === "Scheduled"
              ? "bg-[#D1FAE5] text-[#065F46] hover:bg-green-200" // Light green button for "Reorder" look
              : "bg-[#DBEAFE] text-[#1E40AF] hover:bg-blue-200" // Light blue for "View"
          }`}
        >
          {row.priority === "High" || row.priority === "Scheduled"
            ? "Reorder"
            : "View"}
        </button>
      ),
      className: "text-center",
      cellClassName: "text-right",
    },
  ];
  const stats = DashboardStatsByFilter[activeTab];
  const kpis = materialKpisByFilter[activeTab];
  return (
    // <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
    <div className="xl:px-0 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
      <TitleSubtitle
        title={dashboardText.header.title}
        subtitle={dashboardText.header.subtitle}
      />

      <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 xl:gap-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={icons[index].icon}
            color={icons[index].color}
          />
        ))}
      </div>

      <h2 className="xl:text-2xl text-lg font-semibold text-black xl:mt-10 ">
        Inventory KPIs
      </h2>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 xl:gap-4 gap-3">
        {kpis.map((kpi, index) => {
          const visual = kpiVisuals[index];

          return (
            <KPICard
              key={kpi.subtext}
              title=""
              value={kpi.value}
              subtext={kpi.subtext}
              trend={kpi.trend}
              icon={visual.icon}
              iconBgColor={visual.iconBgColor}
              iconColor={visual.iconColor}
            />
          );
        })}
      </div>

      {/* Render Inventory Table */}
      <InventoryTable
        title="Material Inventory Snapshot"
        columns={inventoryColumns}
        data={flteredMockInventoryData[activeTab]}
        footer={
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">
              🔔 2 items below minimum stock • 1 pending purchase request
            </span>
          </div>
        }
      />
      <DashboardWidgets />

      {/* Render Machine Usage Table */}
      <InventoryTable
        title="Machine usage & maintenance reminders"
        columns={machineColumns}
        data={mockMachineUsageData}
        onViewAll={() => navigate("/equipment_management")}
      />
    </div>
  );
};

export default PlantPage;
